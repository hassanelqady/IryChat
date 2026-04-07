'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}

      {/* تم تقليل pt إلى 20 لأن الشريط أصبح عالي جداً (top-2) */}
      <main className={isDashboard ? "min-h-screen" : "pt-20 min-h-screen"}>
        {children}
      </main>
    </>
  )
}