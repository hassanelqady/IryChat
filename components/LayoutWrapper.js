'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {/* الـ Navbar يظهر في كل الصفحات ما عدا الداشبورد */}
      {!isDashboard && <Navbar />}

      {/* تعديل المسافة العلوية حسب الصفحة */}
      <main className={isDashboard ? "min-h-screen" : "pt-28 min-h-screen"}>
        {children}
      </main>
    </>
  )
}