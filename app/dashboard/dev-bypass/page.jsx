// ⚠️ DEV ONLY - احذف هذا الملف قبل الـ production
// ضعه في: app/dashboard/dev-bypass/page.jsx
// الرابط: /dashboard/dev-bypass

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ⛔ هذه الصفحة للتطوير فقط - تسمح بتجاوز تسجيل الدخول
// لا ترفعها على production أبداً
export default function DevBypass() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // المستخدم مسجل دخول فعلاً
        router.push('/dashboard')
        return
      }

      // ⚠️ تسجيل دخول تجريبي بإيميل وهمي
      // تأكد إن هذا الإيميل موجود في Supabase > Authentication > Users
      const { error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_DEV_EMAIL || 'test@irychat.com',
        password: process.env.NEXT_PUBLIC_DEV_PASSWORD || 'test123456',
      })

      if (error) {
        console.error('Dev bypass failed:', error.message)
        document.getElementById('status').textContent = '❌ فشل: ' + error.message
        return
      }

      router.push('/dashboard')
    }

    check()
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl text-cyan-400 mb-4 animate-pulse">⚠️ Dev Bypass</div>
        <p id="status" className="text-gray-400">جاري تسجيل الدخول التجريبي...</p>
        <p className="text-red-400/60 text-xs mt-6">احذف هذه الصفحة قبل الـ production</p>
      </div>
    </div>
  )
}