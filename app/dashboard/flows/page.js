'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function AutomationsPage() {
  const router = useRouter()
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('automations')
        .select('*, connected_accounts(account_name, account_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setAutomations(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleStatus = async (id, currentStatus) => {
    const supabase = createClient()
    await supabase.from('automations').update({ is_active: !currentStatus }).eq('id', id)
    setAutomations(automations.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a))
  }

  const deleteAutomation = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    const supabase = createClient()
    await supabase.from('automations').delete().eq('id', id)
    setAutomations(automations.filter(a => a.id !== id))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#00d4ff' }}>جاري التحميل...</motion.div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px' }}></div>
      </div>

      {/* Navbar */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '0.85rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>الرئيسية</Link>
          <Link href="/dashboard/accounts" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>الحسابات</Link>
          <Link href="/dashboard/flows" style={{ color: '#00d4ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', background: 'rgba(0,212,255,0.1)' }}>الأتمتة</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,212,255,0.05)', padding: '0.3rem 0.8rem 0.3rem 1rem', borderRadius: '99px', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff', fontSize: '0.85rem' }}>{user?.email?.split('@')[0]}</span>
            <button onClick={handleLogout} style={{ background: 'transparent', padding: '0.3rem 0.8rem', borderRadius: '99px', color: '#eef2ff', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>خروج</button>
          </div>
        </div>
      </motion.nav>

      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.3rem' }}>الأتمتة</h1>
            <p style={{ color: 'rgba(238,242,255,0.6)' }}>ردود تلقائية على التعليقات والرسائل</p>
          </div>
          <Link href="/dashboard/automations/new"
            style={{ background: '#00d4ff', color: '#05080f', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '99px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', fontSize: '0.95rem' }}>
            + إنشاء أتمتة جديدة
          </Link>
        </motion.div>

        {/* Empty State */}
        {automations.length === 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem' }}>لا توجد أتمتة بعد</h3>
            <p style={{ color: 'rgba(238,242,255,0.5)', marginBottom: '1.5rem' }}>أنشئ أول أتمتة للرد التلقائي على التعليقات وإرسال DM</p>
            <Link href="/dashboard/automations/new"
              style={{ background: '#00d4ff', color: '#05080f', padding: '0.75rem 2rem', borderRadius: '99px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
              + إنشاء أتمتة جديدة
            </Link>
          </motion.div>
        )}

        {/* Automations List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {automations.map((automation, i) => (
            <motion.div key={automation.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'rgba(255,255,255,0.035)', border: `1px solid ${automation.is_active ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>⚡</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.2rem' }}>{automation.name}</div>
                    <div style={{ color: 'rgba(238,242,255,0.5)', fontSize: '0.8rem' }}>
                      كلمة: <span style={{ color: '#00d4ff' }}>{automation.trigger_keyword}</span>
                      {automation.connected_accounts && (
                        <span> · {automation.connected_accounts.account_name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '99px', background: automation.is_active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)', color: automation.is_active ? '#4ade80' : 'rgba(238,242,255,0.4)', border: `1px solid ${automation.is_active ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {automation.is_active ? '● نشط' : '○ متوقف'}
                  </span>
                  <button onClick={() => toggleStatus(automation.id, automation.is_active)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#eef2ff', padding: '0.35rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    {automation.is_active ? 'إيقاف' : 'تشغيل'}
                  </button>
                  <Link href={`/dashboard/automations/${automation.id}/edit`}
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', padding: '0.35rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'none' }}>
                    تعديل
                  </Link>
                  <button onClick={() => deleteAutomation(automation.id)}
                    style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff6b6b', padding: '0.35rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
