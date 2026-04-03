'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void
  maxFiles?:     number
  maxSizeMB?:    number
}

export default function ImageUploader({
  onFilesChange,
  maxFiles  = 5,
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  const onDrop = useCallback(
    (accepted: File[]) => {
      const remaining = maxFiles - previews.length
      const toAdd     = accepted.slice(0, remaining)

      if (accepted.length > remaining) {
        notify.warning(`Maximum ${maxFiles} images allowed`)
      }

      const newPreviews = toAdd.map(file => ({
        file,
        url: URL.createObjectURL(file),
      }))

      const updated = [...previews, ...newPreviews]
      setPreviews(updated)
      onFilesChange(updated.map(p => p.file))
    },
    [previews, maxFiles, onFilesChange]
  )

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index].url)
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onFilesChange(updated.map(p => p.file))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.webp'] },
    maxSize:  maxSizeMB * 1024 * 1024,
    disabled: previews.length >= maxFiles,
    onDropRejected: (rejections) => {
      rejections.forEach(r => {
        if (r.errors[0]?.code === 'file-too-large') {
          notify.error(`File too large. Max ${maxSizeMB}MB allowed.`)
        }
      })
    },
  })

  return (
    <div className="flex flex-col gap-3">
      {previews.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3',
            'rounded-xl border-2 border-dashed border-slate-700 p-8',
            'transition-all duration-200',
            isDragActive
              ? 'border-sky-500 bg-sky-500/5'
              : 'hover:border-sky-500/50 hover:bg-slate-800/50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700">
            <Upload size={20} className="text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">
              {isDragActive ? 'Drop photos here' : 'Click or drag photos here'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG, HEIC · Max {maxSizeMB}MB · Up to {maxFiles} images
            </p>
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-700"
            >
              <img
                src={preview.url}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className={cn(
                  'absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center',
                  'rounded-full bg-red-500 opacity-0 transition-opacity',
                  'group-hover:opacity-100'
                )}
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">
        {previews.length} / {maxFiles} Images uploaded
      </p>
    </div>
  )
}