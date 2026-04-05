'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (error) {
      setError(error.message === 'User already registered' ? 'هذا البريد الإلكتروني مسجل مسبقاً' : 'حدث خطأ، حاول مرة أخرى')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (success) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <div style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', borderRadius: '28px', textAlign: 'center', background: 'rgba(5,8,15,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>تم إنشاء الحساب!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>تحقق من بريدك الإلكتروني لتفعيل الحساب</p>
        <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none' }}>الذهاب لتسجيل الدخول</Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#05080f', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px' }}></div>
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={staggerContainer}
        style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', borderRadius: '28px', textAlign: 'center', position: 'relative', zIndex: 1, background: 'rgba(5,8,15,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <motion.div variants={fadeUp}>
          <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>IryChat</Link>
        </motion.div>

        <motion.h1 variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>إنشاء حساب</motion.h1>
        <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', marginBottom: '2rem', fontSize: '0.9rem' }}>انضم إلى IryChat وابدأ رحلتك</motion.p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
            <input type="text" placeholder="الاسم كاملاً" value={name} onChange={(e) => setName(e.target.value)} required
              style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', fontSize: '0.95rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', fontSize: '0.95rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </motion.div>

          <motion.div variants={fadeUp} style={{ position: 'relative', marginBottom: '1rem' }}>
            <input type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', fontSize: '0.95rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.6 }}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
            <input type={showPassword ? 'text' : 'password'} placeholder="تأكيد كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', fontSize: '0.95rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </motion.div>

          <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: '#05080f', border: 'none', borderRadius: '99px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'جاري...' : 'إنشاء حساب'}
          </motion.button>
        </form>

        <motion.div variants={fadeUp} style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>
          لديك حساب؟ <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none', marginRight: '0.3rem' }}>تسجيل الدخول</Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
