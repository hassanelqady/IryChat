'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    if (password !== confirmPassword) { setError('كلمة المرور غير متطابقة'); return }
    setLoading(true)
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/login'), 2000)
    }, 1500)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#05080f' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', borderRadius: '28px', textAlign: 'center', zIndex: 1, background: 'rgba(5,8,15,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <motion.div variants={fadeUp}>
          <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        </motion.div>
        
        <motion.h1 variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>إعادة تعيين كلمة المرور</motion.h1>
        
        <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', marginBottom: '2rem' }}>أدخل كلمة المرور الجديدة</motion.p>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '1rem', color: '#4ade80' }}>
            ✅ تم تغيير كلمة المرور بنجاح! جاري التحويل...
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,80,80,0.15)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', color: '#ff6b6b' }}>{error}</motion.div>}
            <motion.div variants={fadeUp} style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور الجديدة" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>{showPassword ? '🙈' : '👁️'}</button>
            </motion.div>
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="تأكيد كلمة المرور الجديدة" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff' }} />
            </motion.div>
            <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} type="submit" disabled={loading} style={{ width: '100%', padding: '0.9rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </motion.button>
          </form>
        )}

        <motion.div variants={fadeUp} style={{ marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none' }}>العودة إلى تسجيل الدخول</Link>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(35px,25px) scale(1.08); } }
      `}</style>
    </main>
  )
}