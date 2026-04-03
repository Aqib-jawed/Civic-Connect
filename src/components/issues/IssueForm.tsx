'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import ImageUploader from '@/components/shared/ImageUploader'
import { CATEGORIES, SEVERITIES } from '@/constants/categories'
import { cn } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'
import type { GPSLocation, IssueFormData } from '@/types'

const LocationCapture = dynamic(
  () => import('@/components/map/LocationCapture'),
  { ssr: false }
)

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  severity: z.string().min(1, 'Please select severity'),
})

type FormValues = z.infer<typeof schema>

interface IssueFormProps {
  onSubmit: (data: IssueFormData) => Promise<void>
  loading?: boolean
}

const STEPS = ['Location', 'Details', 'Photos']

export default function IssueForm({ onSubmit, loading }: IssueFormProps) {
  const [step, setStep] = useState(0)
  const [location, setLocation] = useState<GPSLocation | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: '',
      severity: 'medium',
    },
  })

  // Track selected values for UI only (actual value stored in RHF via setValue)
  const [selectedCat, setSelectedCat] = useState('')
  const [selectedSev, setSelectedSev] = useState('medium')

  const handleCatSelect = (val: string) => {
    setSelectedCat(val)
    setValue('category', val, { shouldValidate: true })
  }

  const handleSevSelect = (val: string) => {
    setSelectedSev(val)
    setValue('severity', val, { shouldValidate: true })
  }

  const handleNext = () => {
    if (step === 0 && !location) {
      notify.error('Please confirm your GPS location first')
      return
    }
    if (step === 1 && !selectedCat) {
      notify.error('Please select a category')
      return
    }
    setStep(s => s + 1)
  }

  const handleFormSubmit = async (values: FormValues) => {
    if (!location) {
      notify.error('GPS location is required')
      return
    }
    if (files.length === 0) {
      notify.error('Please upload at least one photo')
      return
    }

    const addressParts = [location.city, location.state, location.pincode].filter(Boolean)
    const formattedAddress = addressParts.length ? addressParts.join(', ') : undefined

    await onSubmit({
      ...values,
      category: values.category as any,
      severity: values.severity as any,
      latitude: location.latitude,
      longitude: location.longitude,
      address: formattedAddress,
      images: files,
      is_anonymous: false,
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Step indicator ── */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-all',
                  i < step && 'bg-emerald-500 border-emerald-500 text-white',
                  i === step && 'bg-sky-500 border-sky-500 text-white',
                  i > step && 'bg-transparent border-slate-600 text-slate-500'
                )}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-xs',
                i === step ? 'text-sky-400 font-medium' : 'text-slate-500'
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-px flex-1 mx-2 mb-5 transition-all',
                i < step ? 'bg-emerald-500' : 'bg-slate-700'
              )} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>

        {/* ── Step 0: Location ── */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="font-heading text-base font-semibold mb-1">
                📍 Confirm Your Location
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your address then pin the exact location on the map
              </p>
              <LocationCapture onCapture={setLocation} />
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleNext} disabled={!location}>
                Next: Issue Details →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="font-heading text-base font-semibold mb-1">🏷️ Category</h3>
              <p className="text-xs text-slate-400 mb-4">Select the type of civic issue</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCatSelect(cat.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all',
                      selectedCat === cat.value
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    )}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-center text-xs font-medium leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-xs text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Details */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5 flex flex-col gap-4">
              <h3 className="font-heading text-base font-semibold">📝 Details</h3>
              <Input
                label="Issue Title *"
                placeholder="e.g. Large pothole causing danger to vehicles"
                error={errors.title?.message}
                {...register('title')}
              />
              <Textarea
                label="Description (Optional)"
                placeholder="Describe the issue in more detail..."
                rows={3}
                {...register('description')}
              />

              {/* Severity */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2 block">
                  Severity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SEVERITIES.map(sev => (
                    <button
                      key={sev.value}
                      type="button"
                      onClick={() => handleSevSelect(sev.value)}
                      className={cn(
                        'rounded-lg border-2 py-2 text-xs font-semibold transition-all',
                        selectedSev === sev.value
                          ? 'border-current'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      )}
                      style={selectedSev === sev.value
                        ? { borderColor: sev.color, color: sev.color, background: sev.bg }
                        : {}
                      }
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(0)}>← Back</Button>
              <Button type="button" onClick={handleNext}>Next: Add Photos →</Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Photos + Summary + Submit ── */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="font-heading text-base font-semibold mb-1">📷 Upload Photos</h3>
              <p className="text-xs text-slate-400 mb-4">
                At least 1 photo required. Clear images help field teams assess the issue.
              </p>
              <ImageUploader onFilesChange={setFiles} />
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">Submission Summary</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-medium capitalize">{selectedCat.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Severity</span>
                  <span className="font-medium capitalize">{selectedSev}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-emerald-400 text-right max-w-[60%] truncate">
                    {location ? `${location.city ?? ''}, ${location.state ?? ''}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS</span>
                  <span className="font-medium text-emerald-400">✅ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Photos</span>
                  <span className={cn('font-medium', files.length === 0 ? 'text-red-400' : '')}>
                    {files.length} uploaded
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button
                type="submit"
                variant="success"
                size="lg"
                loading={loading}
                disabled={files.length === 0 || loading}
              >
                {loading ? 'Submitting…' : 'Submit Report ✓'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}