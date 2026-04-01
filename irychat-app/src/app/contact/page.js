'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

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
    if (!name || !email || !message) return
    setLoading(true)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSent(false), 5000)
    }, 1500)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f', padding: '7rem 5% 5rem' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.h1 variants={fadeUp} style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تواصل معنا</motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'rgba(238,242,255,0.6)' }}>لديك سؤال أو استفسار؟ تواصل معنا وسنرد عليك قريباً</motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '2.5rem' }}>
          {sent && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', color: '#4ade80' }}>
              ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(238,242,255,0.8)' }}>الاسم</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff' }} />
            </motion.div>
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(238,242,255,0.8)' }}>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff' }} />
            </motion.div>
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(238,242,255,0.8)' }}>الرسالة</label>
              <textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', resize: 'vertical' }} />
            </motion.div>
            <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} type="submit" disabled={loading} style={{ width: '100%', padding: '0.9rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem', textAlign: 'center' }}>
          <motion.div variants={fadeUp} style={{ padding: '1rem', background: 'rgba(255,255,255,0.035)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
            <div style={{ fontWeight: 600 }}>البريد الإلكتروني</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>support@irychat.com</div>
          </motion.div>
          <motion.div variants={fadeUp} style={{ padding: '1rem', background: 'rgba(255,255,255,0.035)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <div style={{ fontWeight: 600 }}>الهاتف</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>+966 5 1234 5678</div>
          </motion.div>
          <motion.div variants={fadeUp} style={{ padding: '1rem', background: 'rgba(255,255,255,0.035)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕒</div>
            <div style={{ fontWeight: 600 }}>ساعات العمل</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(238,242,255,0.6)' }}>السبت - الخميس 9ص - 6م</div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(35px,25px) scale(1.08); } }
      `}</style>
    </main>
  )
}