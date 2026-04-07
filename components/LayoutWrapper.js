'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}

      {/* 
         تقليل المسافة إلى pt-16 لتناسب الارتفاع الجديد (top-1) والشريط النحيف (h-14)
      */}
      <main className={isDashboard ? "min-h-screen" : "pt-16 min-h-screen"}>
        {children}
      </main>
    </>
  )
}