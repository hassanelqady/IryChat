'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  useEffect(() => {
    const remembered = localStorage.getItem('irychat_remembered')
    if (remembered) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(remembered)
        setEmail(savedEmail)
        setPassword(savedPassword)
        const rememberCheckbox = document.getElementById('rememberMe')
        if (rememberCheckbox) rememberCheckbox.checked = true
      } catch (e) {}
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (email === 'test@irychat.com' && password === '123456') {
      const userData = { name: 'أحمد', email: email, avatar: '😎', loggedIn: true }
      localStorage.setItem('irychat_user', JSON.stringify(userData))
      
      const rememberMe = document.getElementById('rememberMe')?.checked
      if (rememberMe) {
        localStorage.setItem('irychat_remembered', JSON.stringify({ email, password }))
      } else {
        localStorage.removeItem('irychat_remembered')
      }
      
      const existingFlows = localStorage.getItem('irychat_flows')
      if (!existingFlows) {
        const defaultFlows = [
          { id: 1, name: 'الرد على الأسعار', trigger: 'كلمة "سعر" أو "اسعار"', response: 'مرحباً! سعر المنتج 299 ريال.', active: true, type: 'DM', stats: { uses: 234, conversions: 56 } },
          { id: 2, name: 'الترحيب بالعملاء الجدد', trigger: 'أول رسالة من العميل', response: 'أهلاً بك! كيف يمكنني مساعدتك؟', active: true, type: 'DM', stats: { uses: 567, conversions: 89 } },
          { id: 3, name: 'الرد على الكومنتات', trigger: 'كلمة "عرض"', response: 'تم إرسال العرض عبر الخاص 📩', active: false, type: 'Comment', stats: { uses: 89, conversions: 23 } }
        ]
        localStorage.setItem('irychat_flows', JSON.stringify(defaultFlows))
      }
      
      window.location.href = '/dashboard'
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#05080f' }}>
      {/* خلفية متحركة */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,212,255,0.06)', filter: 'blur(110px)', top: '45%', left: '38%', animation: 'float 12s infinite alternate', animationDelay: '-9s' }}></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '28px',
          textAlign: 'center',
          zIndex: 1,
          background: 'rgba(5,8,15,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
        }}
      >
        <motion.div variants={fadeUp}>
          <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>IryChat</Link>
        </motion.div>
        
        <motion.h1 variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تسجيل الدخول</motion.h1>
        
        <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)', marginBottom: '2rem' }}>مرحباً بعودتك! سجل دخولك للمتابعة</motion.p>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', color: '#ff6b6b', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '0.9rem 1rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '14px', 
                color: '#eef2ff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </motion.div>

          {/* حقل كلمة المرور - عين على الشمال */}
          <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="كلمة المرور" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1rem 0.9rem 3rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '14px', 
                  color: '#eef2ff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  cursor: 'pointer', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  color: '#00d4ff'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,212,255,0.15)'
                  e.target.style.borderColor = '#00d4ff'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'rgba(238,242,255,0.8)', fontSize: '0.85rem' }}>
              <input type="checkbox" id="rememberMe" style={{ width: '16px', height: '16px', accentColor: '#00d4ff', cursor: 'pointer' }} />
              <span>تذكرني</span>
            </label>
            <Link href="/forgot-password" style={{ color: '#00d4ff', textDecoration: 'none', fontSize: '0.85rem' }}>نسيت كلمة المرور؟</Link>
          </motion.div>

          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
              color: '#05080f',
              border: 'none',
              borderRadius: '99px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '1rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'جاري...' : 'دخول'}
          </motion.button>
        </form>

        <motion.div variants={fadeUp}>
          <Link href="/signup" style={{ color: '#00d4ff', textDecoration: 'none', fontSize: '0.9rem' }}>إنشاء حساب جديد</Link>
        </motion.div>
        
        {/* تم إزالة نص الاختبار */}
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }
      `}</style>
    </main>
  )
}