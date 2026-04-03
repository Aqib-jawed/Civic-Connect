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
  const { user, profile } = useAuth()   // user is from auth (always set), profile from DB (may be null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: IssueFormData) => {
    // Use user.id directly as it comes from Supabase Auth — always reliable
    const userId = user?.id ?? profile?.id
    if (!userId) {
      notify.error('You must be logged in to report an issue')
      return
    }

    setLoading(true)

    try {
      const imageUrls: string[] = []
      const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ISSUES

      // Upload images if bucket is configured
      if (bucket) {
        for (const file of data.images) {
          const ext = file.name.split('.').pop()
          const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, { upsert: false })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error(`Image upload failed: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName)

          imageUrls.push(publicUrl)
        }
      } else {
        // No bucket configured — store filename placeholders
        console.warn('NEXT_PUBLIC_STORAGE_BUCKET_ISSUES not set — skipping image upload')
        data.images.forEach(f => imageUrls.push(f.name))
      }

      const insertPayload = {
        reported_by: userId,
        category: data.category as string,
        title: data.title,
        description: data.description ?? null,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address ?? null,
        images: imageUrls,
        severity: data.severity as string,
        is_anonymous: data.is_anonymous,
        status: 'submitted' as string,
      }

      const { error: insertError } = await supabase
        .from('issues')
        .insert(insertPayload as any)

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(insertError.message)
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