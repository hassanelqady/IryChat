'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    activeAutomations: 0,
    connectedAccounts: 0,
    totalAutomations: 0,
  })

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
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const [
        { count: totalLogs },
        { count: activeAutomations },
        { count: connectedAccounts },
        { count: totalAutomations },
      ] = await Promise.all([
        supabase.from('automation_logs').select('*', { count: 'exact', head: true })
          .in('automation_id', (await supabase.from('automations').select('id').eq('user_id', user.id)).data?.map(a => a.id) || []),
        supabase.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
        supabase.from('connected_accounts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      setStats({
        totalLogs: totalLogs || 0,
        activeAutomations: activeAutomations || 0,
        connectedAccounts: connectedAccounts || 0,
        totalAutomations: totalAutomations || 0,
      })
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#00d4ff', fontSize: '1.2rem' }}>جاري التحميل...</motion.div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </motion.div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '0.85rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/dashboard/accounts" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>الحسابات</Link>
            <Link href="/dashboard/flows" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>الأتمتة</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,212,255,0.05)', padding: '0.3rem 0.8rem 0.3rem 1rem', borderRadius: '99px', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>{user?.email?.split('@')[0]}</span>
            <div style={{ width: '1px', height: '20px', background: 'rgba(0,212,255,0.2)' }}></div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
              style={{ background: 'transparent', padding: '0.4rem 1rem', borderRadius: '99px', color: '#eef2ff', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
              خروج
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.3rem' }}>لوحة التحكم</h1>
          <p style={{ color: 'rgba(238,242,255,0.5)' }}>مرحباً {user?.email?.split('@')[0]} — إليك ملخص حسابك</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '1000px', marginBottom: '3rem' }}>

          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <motion.div variants={numberVariants} style={{ fontSize: '2.2rem', fontWeight: 700, color: '#00d4ff' }}>{stats.activeAutomations}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem' }}>أتمتة نشطة</div>
            <div style={{ color: 'rgba(238,242,255,0.35)', fontSize: '0.75rem', marginTop: '0.4rem' }}>من أصل {stats.totalAutomations} إجمالاً</div>
          </motion.div>

          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
            <motion.div variants={numberVariants} style={{ fontSize: '2.2rem', fontWeight: 700, color: '#00d4ff' }}>{stats.totalLogs}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem' }}>ردود تلقائية</div>
            <div style={{ color: 'rgba(238,242,255,0.35)', fontSize: '0.75rem', marginTop: '0.4rem' }}>إجمالي العمليات</div>
          </motion.div>

          <motion.div variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
            <motion.div variants={numberVariants} style={{ fontSize: '2.2rem', fontWeight: 700, color: stats.connectedAccounts > 0 ? '#4ade80' : '#00d4ff' }}>{stats.connectedAccounts}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem' }}>حسابات مربوطة</div>
            <div style={{ color: stats.connectedAccounts === 0 ? '#ffa500' : 'rgba(238,242,255,0.35)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
              {stats.connectedAccounts === 0 ? '⚠️ اربط حسابك للبدء' : 'Instagram / Facebook'}
            </div>
          </motion.div>
        </motion.div>

        {/* إذا مفيش حسابات مربوطة */}
        {stats.connectedAccounts === 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            style={{ maxWidth: '1000px', background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#ffa500', fontWeight: 600, marginBottom: '0.25rem' }}>⚠️ لم تربط حسابك بعد</div>
              <div style={{ color: 'rgba(238,242,255,0.5)', fontSize: '0.85rem' }}>اربط حساب Instagram أو Facebook للبدء في استخدام الأتمتة</div>
            </div>
            <Link href="/dashboard/accounts" style={{ background: '#ffa500', color: '#05080f', padding: '0.6rem 1.5rem', borderRadius: '99px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              ربط الحساب
            </Link>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ maxWidth: '1000px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(238,242,255,0.7)', fontWeight: 600 }}>إجراءات سريعة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/accounts" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔗</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>الحسابات</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(238,242,255,0.4)' }}>ربط Instagram / Facebook</div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/automations/new" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>أتمتة جديدة</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(238,242,255,0.4)' }}>رد تلقائي + DM</div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/flows" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', textDecoration: 'none', color: '#eef2ff', display: 'block' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📋</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>كل الأتمتة</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(238,242,255,0.4)' }}>عرض وإدارة</div>
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
