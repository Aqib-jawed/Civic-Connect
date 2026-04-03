'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { notify } from '@/components/ui/Toast'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type FormValues = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Step 1 — sign in
      const { data, error } = await (supabase as any).auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        notify.error(error.message)
        return
      }

      const userId = data.user?.id
      if (!userId) {
        notify.error('Login failed. No user returned.')
        return
      }

      // Step 2 — fetch profile role
      const { data: profile, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      // Debug — remove after fixing
      // console.log('Profile result:', profile, 'Error:', profileError)

      if (profileError) {
        notify.error('Could not fetch profile: ' + profileError.message)
        await (supabase as any).auth.signOut()
        return
      }

      if (!profile) {
        notify.error('No profile found for this user.')
        await (supabase as any).auth.signOut()
        return
      }

      if (profile.role !== 'admin') {
        notify.error('Access denied. Role is: ' + profile.role)
        await (supabase as any).auth.signOut()
        return
      }

      notify.success('Welcome, Admin!')
      router.push('/admin/dashboard')
      router.refresh()

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-6">
      <div className="w-full max-w-sm">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Admin Login</h3>
        <p className="text-sm text-slate-400 mb-8">Secure access for government administrators</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@civicconnect.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-2 bg-purple-600 hover:bg-purple-500"
          >
            Sign In to Admin Panel
          </Button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-600 hover:text-slate-400">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}