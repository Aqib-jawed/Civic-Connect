'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import IssueForm from '@/components/issues/IssueForm'
import { notify } from '@/components/ui/Toast'
import type { IssueFormData } from '@/types'

export default function ReportIssuePage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: IssueFormData) => {
    const userId = user?.id ?? profile?.id
    if (!userId) {
      notify.error('You must be logged in to report an issue')
      return
    }

    setLoading(true)

    try {
      const imageUrls: string[] = []
      const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ISSUES

      // Upload images via Supabase client (storage allows authenticated uploads)
      if (bucket && data.images?.length > 0) {
        for (const file of data.images) {
          const ext = file.name.split('.').pop()
          const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, { upsert: false })

          if (uploadError) {
            console.warn('Image upload failed (continuing without image):', uploadError.message)
            // Don't throw — allow issue submission even if image upload fails
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from(bucket)
              .getPublicUrl(fileName)
            imageUrls.push(publicUrl)
          }
        }
      }

      // Submit issue via server-side API (uses service role — bypasses RLS)
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reported_by:  userId,
          category:     data.category,
          title:        data.title,
          description:  data.description ?? null,
          latitude:     data.latitude,
          longitude:    data.longitude,
          address:      data.address ?? null,
          images:       imageUrls,
          severity:     data.severity ?? 'medium',
          is_anonymous: data.is_anonymous ?? false,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        console.error('Issue submit error:', result)
        throw new Error(result.error ?? 'Failed to submit issue')
      }

      notify.success('Issue reported successfully! 🎉')
      router.push('/citizen/issues')

    } catch (err: any) {
      console.error('Submit error:', err)
      notify.error(err.message ?? 'Failed to submit issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">
          Report a Civic Issue
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Complete 3 steps to submit your issue with verified GPS location
        </p>
      </div>
      <IssueForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}