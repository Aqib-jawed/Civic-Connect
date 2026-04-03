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
  full_name:        z.string().min(2, 'Name must be at least 2 characters'),
  email:            z.string().email('Enter a valid email'),
  phone:            z.string().optional(),
  password:         z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path:    ['confirm_password'],
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Step 1 — sign up (trigger will auto-create profile)
      const { data, error } = await (supabase as any).auth.signUp({
        email:    values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone:     values.phone ?? null,
            role:      'citizen',
          },
        },
      })

      if (error) {
        notify.error(error.message)
        return
      }

      if (!data.user) {
        notify.error('Signup failed. Please try again.')
        return
      }

      // Step 2 — sign in immediately
      const { error: signInError } = await (supabase as any).auth.signInWithPassword({
        email:    values.email,
        password: values.password,
      })

      if (signInError) {
        notify.success('Account created! Please log in.')
        router.push('/login')
        return
      }

      notify.success('Welcome to CivicConnect! 🎉')
      router.push('/citizen/dashboard')
      router.refresh()

    } catch (err: any) {
      notify.error(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-6">
      <div className="w-full max-w-sm">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Create Account</h3>
        <p className="text-sm text-slate-400 mb-8">
          Join thousands of citizens improving their city
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Aarav Sharma"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone (Optional)"
            type="tel"
            placeholder="+91 9876543210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Create Account &amp; Continue
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}