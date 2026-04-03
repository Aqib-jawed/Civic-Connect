import type { Metadata } from 'next'
import '../globals.css'
import 'leaflet/dist/leaflet.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'CivicConnect — Smart City Issue Reporting',
  description: 'Report and track civic issues in your city',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0f1e] text-slate-100 antialiased">
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}