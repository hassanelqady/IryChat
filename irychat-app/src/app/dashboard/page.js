'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ conversations: 0, openRate: 98, conversions: 0, revenue: 0 })

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardHover = {
    whileHover: { y: -8, scale: 1.02, boxShadow: '0 10px 30px rgba(0,212,255,0.15)', transition: { duration: 0.2 } }
  }

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', duration: 0.5, delay: 0.2 } }
  }

  useEffect(() => {
    const loggedUser = localStorage.getItem('irychat_user')
    if (!loggedUser) router.push('/login')
    else {
      setUser(JSON.parse(loggedUser))
      const flows = JSON.parse(localStorage.getItem('irychat_flows') || '[]')
      const totalConversations = flows.reduce((sum, f) => sum + f.stats.uses, 0)
      const totalConversions = flows.reduce((sum, f) => sum + f.stats.conversions, 0)
      setStats({ conversations: totalConversations, openRate: 98, conversions: totalConversions, revenue: totalConversions * 24 })
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('irychat_user')
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#00d4ff', fontSize: '1.2rem' }}>جاري التحميل...</motion.div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      {/* Background Effects */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </motion.div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 100,
          padding: '0.85rem 5%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)',
          backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.07)'
        }}
      >
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard/flows" style={{ color: '#eef2ff', textDecoration: 'none' }}>الردود التلقائية</Link>
          <Link href="/dashboard/analytics" style={{ color: '#eef2ff', textDecoration: 'none' }}>التحليلات</Link>
          <Link href="/dashboard/settings" style={{ color: '#eef2ff', textDecoration: 'none' }}>الإعدادات</Link>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: '#eef2ff' }}>مرحباً, {user?.name || 'مستخدم'}</motion.span>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.48rem 1.25rem', borderRadius: '99px', color: '#eef2ff', cursor: 'pointer' }}>تسجيل خروج</motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>لوحة التحكم</h1>
          <p style={{ color: 'rgba(238,242,255,0.6)' }}>مرحباً بك في IryChat! إليك ملخص أداء حسابك</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto 3rem' }}
        >
          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</motion.div>
            <motion.div variants={numberVariants} style={{ fontSize: '2rem', fontWeight: 700, color: '#00d4ff' }}>{stats.conversations.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem' }}>إجمالي المحادثات</div>
            <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 23% عن الشهر الماضي</div>
          </motion.div>
          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</motion.div>
            <motion.div variants={numberVariants} style={{ fontSize: '2rem', fontWeight: 700, color: '#00d4ff' }}>{stats.openRate}%</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem' }}>معدل الفتح</div>
            <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 5% عن الشهر الماضي</div>
          </motion.div>
          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</motion.div>
            <motion.div variants={numberVariants} style={{ fontSize: '2rem', fontWeight: 700, color: '#00d4ff' }}>{stats.conversions.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem' }}>التحويلات</div>
            <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 12% عن الشهر الماضي</div>
          </motion.div>
          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</motion.div>
            <motion.div variants={numberVariants} style={{ fontSize: '2rem', fontWeight: 700, color: '#00d4ff' }}>${stats.revenue.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem' }}>الإيرادات</div>
            <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 34% عن الشهر الماضي</div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#eef2ff', textAlign: 'center' }}>إجراءات سريعة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/flows" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</motion.div>
                <div>إنشاء Flow جديد</div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/analytics" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</motion.div>
                <div>عرض التحليلات</div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/settings" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</motion.div>
                <div>الإعدادات</div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }
      `}</style>
    </main>
  )
}
