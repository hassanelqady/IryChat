'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DevBypass() {
  const [status, setStatus] = useState('جاري تسجيل الدخول...')

  useEffect(() => {
    const login = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        window.location.href = '/dashboard'
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_DEV_EMAIL || 'hassan@irychat.com',
        password: process.env.NEXT_PUBLIC_DEV_PASSWORD || '',
      })

      if (error) {
        setStatus('❌ فشل: ' + error.message)
        return
      }

      window.location.href = '/dashboard'
    }

    login()
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl text-cyan-400 mb-4 animate-pulse">⚡ Admin Login</div>
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  )
}
