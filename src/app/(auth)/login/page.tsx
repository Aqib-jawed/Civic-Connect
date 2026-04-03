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
import { MapPin } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      notify.error(error.message)
      setLoading(false)
      return
    }

    notify.success('Welcome back!')
    router.push('/citizen/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-slate-900 to-slate-800 border-r border-slate-700/50">
        <div className="mb-8">
          <span className="font-heading text-2xl font-bold text-sky-400">CivicConnect</span>
        </div>
        <h2 className="font-heading text-4xl font-extrabold leading-tight text-slate-100 mb-4">
          Your Voice,<br />Your City.
        </h2>
        <p className="text-slate-400 leading-relaxed max-w-sm">
          Report civic issues in seconds using live GPS. Track progress and see resolution in real time.
        </p>
        <div className="mt-10 flex flex-col gap-5">
          {[
            { icon: '📍', title: 'Live GPS Verification', desc: 'Location captured only when you are at the spot' },
            { icon: '📷', title: 'Photo Evidence', desc: 'Upload images for credible, actionable reports' },
            { icon: '🔔', title: 'Real-time Updates', desc: 'Notifications as your issue gets resolved' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-lg">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{f.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-[#0a0f1e]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h3 className="font-heading text-2xl font-bold text-slate-100">Citizen Login</h3>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to report and track civic issues
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
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
            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-sky-400 hover:underline">
              Register here
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-slate-500">
            <Link href="/admin/login" className="hover:text-purple-400 transition-colors">
              Government Admin? Login here
            </Link>
          </p>
          <p className="mt-2 text-center">
            <Link href="/" className="text-xs text-slate-600 hover:text-slate-400">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}