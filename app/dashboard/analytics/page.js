'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flows, setFlows] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const loggedUser = localStorage.getItem('irychat_user')
    if (!loggedUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(loggedUser))
      const savedFlows = localStorage.getItem('irychat_flows')
      if (savedFlows) {
        setFlows(JSON.parse(savedFlows))
      }
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    setTimeout(() => setAnimated(true), 500)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('irychat_user')
    router.push('/')
  }

  const totalConversations = flows.reduce((sum, flow) => sum + flow.stats.uses, 0)
  const totalConversions = flows.reduce((sum, flow) => sum + flow.stats.conversions, 0)
  const totalRevenue = totalConversions * 24
  const averageConversionRate = totalConversations > 0 
    ? Math.round((totalConversions / totalConversations) * 100) 
    : 0

  const bestFlow = flows.length > 0 
    ? flows.reduce((best, flow) => 
        (flow.stats.conversions > best.stats.conversions) ? flow : best, flows[0])
    : null

  const weeklyData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    conversations: [45, 52, 68, 74, 89, 112, 98],
    conversions: [8, 12, 15, 18, 24, 31, 28]
  }

  const monthlyData = {
    labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
    conversations: [320, 380, 420, 490],
    conversions: [45, 58, 72, 89]
  }

  const currentData = selectedPeriod === 'week' ? weeklyData : monthlyData
  const maxValue = Math.max(...currentData.conversations)

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', duration: 0.5 } }
  }

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#00d4ff' }}>
          جاري التحميل...
        </motion.div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: '700px', height: '700px', borderRadius: '50%',
          background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)',
          top: '-200px', right: '-180px', animation: 'float 12s infinite alternate'
        }}></div>
        <div style={{
          position: 'absolute', width: '550px', height: '550px', borderRadius: '50%',
          background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)',
          bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate',
          animationDelay: '-5s'
        }}></div>
      </div>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }}></div>

      {/* Navbar - تم تعديله ليصبح احترافي */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 100,
          padding: '0.85rem 5%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)',
          backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,212,255,0.15)'
        }}
      >
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* روابط النافبار */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              الرئيسية
            </Link>
            <Link href="/dashboard/flows" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              الردود التلقائية
            </Link>
            <Link href="/dashboard/settings" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              الإعدادات
            </Link>
          </div>
          
          {/* قسم الترحيب والخروج */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,212,255,0.05)', padding: '0.3rem 0.8rem 0.3rem 1rem', borderRadius: '99px', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>مرحباً, {user?.name || 'مستخدم'}</span>
            <div style={{ width: '1px', height: '20px', background: 'rgba(0,212,255,0.2)' }}></div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleLogout} 
              style={{ 
                background: 'transparent', 
                padding: '0.4rem 1rem', 
                borderRadius: '99px', 
                color: '#eef2ff', 
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.8rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,80,80,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              تسجيل خروج
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content - باقي الكود كما هو بدون تغيير */}
      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>التحليلات والتقارير</h1>
          <p style={{ color: 'rgba(238,242,255,0.6)' }}>تحليل أداء الردود التلقائية ومعدلات التحويل</p>
        </motion.div>

        {/* Period Selector */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button onClick={() => setSelectedPeriod('week')} style={{ padding: '0.5rem 1.5rem', borderRadius: '99px', border: 'none', background: selectedPeriod === 'week' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: selectedPeriod === 'week' ? '#05080f' : '#eef2ff', cursor: 'pointer' }}>آخر 7 أيام</button>
          <button onClick={() => setSelectedPeriod('month')} style={{ padding: '0.5rem 1.5rem', borderRadius: '99px', border: 'none', background: selectedPeriod === 'month' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: selectedPeriod === 'month' ? '#05080f' : '#eef2ff', cursor: 'pointer' }}>آخر 30 يوم</button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <motion.div variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>💬</div>
            <motion.div variants={numberVariants} style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00d4ff' }}>{totalConversations.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)' }}>إجمالي المحادثات</div>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🎯</div>
            <motion.div variants={numberVariants} style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00d4ff' }}>{totalConversions.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)' }}>إجمالي التحويلات</div>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>📊</div>
            <motion.div variants={numberVariants} style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffd700' }}>{averageConversionRate}%</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)' }}>متوسط التحويل</div>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>💰</div>
            <motion.div variants={numberVariants} style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00d4ff' }}>${totalRevenue.toLocaleString()}</motion.div>
            <div style={{ color: 'rgba(238,242,255,0.6)' }}>الإيرادات المتوقعة</div>
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        <div style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>📈 المحادثات والتحويلات</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentData.labels.map((label, index) => (
              <div key={index} style={{ textAlign: 'center', width: '60px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: animated ? `${(currentData.conversations[index] / maxValue) * 150}px` : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ width: '30px', background: '#00d4ff', borderRadius: '8px 8px 0 0' }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: animated ? `${(currentData.conversions[index] / maxValue) * 150}px` : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    style={{ width: '30px', background: '#4ade80', borderRadius: '8px 8px 0 0' }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: 'rgba(238,242,255,0.6)' }}>{label}</div>
                <div style={{ fontSize: '0.65rem', color: '#00d4ff' }}>{currentData.conversations[index]}</div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>{currentData.conversions[index]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#00d4ff' }}></div>
              <span>المحادثات</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#4ade80' }}></div>
              <span>التحويلات</span>
            </div>
          </div>
        </div>

        {/* Best Flow */}
        {bestFlow && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'rgba(0,212,255,0.05)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2rem' }}>🏆</div>
            <h3>أفضل Flow أداءً</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00d4ff' }}>{bestFlow.name}</p>
            <p>{bestFlow.stats.conversions} تحويل من {bestFlow.stats.uses} محادثة ({Math.round((bestFlow.stats.conversions / bestFlow.stats.uses) * 100)}% نسبة تحويل)</p>
          </motion.div>
        )}

        {/* Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 أداء الردود التلقائية</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>الاسم</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>النوع</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>الاستخدامات</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>التحويلات</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>نسبة التحويل</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {flows.map((flow, idx) => (
                  <motion.tr key={flow.id} initial="hidden" animate="visible" variants={tableRowVariants} transition={{ delay: idx * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem' }}>{flow.name}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', background: flow.type === 'DM' ? 'rgba(0,212,255,0.2)' : 'rgba(255,165,0,0.2)', color: flow.type === 'DM' ? '#00d4ff' : '#ffa500' }}>
                        {flow.type === 'DM' ? 'رسائل خاصة' : 'تعليقات'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{flow.stats.uses}</td>
                    <td style={{ padding: '0.75rem' }}>{flow.stats.conversions}</td>
                    <td style={{ padding: '0.75rem', color: '#ffd700' }}>{flow.stats.uses > 0 ? Math.round((flow.stats.conversions / flow.stats.uses) * 100) : 0}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', background: flow.active ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)', color: flow.active ? '#4ade80' : '#aaa' }}>
                        {flow.active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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