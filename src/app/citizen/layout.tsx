import Sidebar from '@/components/shared/Sidebar'
import { ToastProvider } from '@/components/ui/Toast'

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f1e]">
      <ToastProvider />
      <Sidebar role="citizen" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}