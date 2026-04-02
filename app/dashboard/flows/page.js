'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FlowsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flows, setFlows] = useState([])
  const [editingFlow, setEditingFlow] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    whileHover: { y: -8, scale: 1.02, transition: { duration: 0.2 } }
  }

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', duration: 0.5 } }
  }

  useEffect(() => {
    const loggedUser = localStorage.getItem('irychat_user')
    if (!loggedUser) router.push('/login')
    else {
      setUser(JSON.parse(loggedUser))
      const savedFlows = localStorage.getItem('irychat_flows')
      if (savedFlows) setFlows(JSON.parse(savedFlows))
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (flows.length > 0) localStorage.setItem('irychat_flows', JSON.stringify(flows))
  }, [flows])

  const handleLogout = () => {
    localStorage.removeItem('irychat_user')
    router.push('/')
  }

  const toggleFlowStatus = (id) => {
    setFlows(flows.map(flow => flow.id === id ? { ...flow, active: !flow.active } : flow))
  }

  const deleteFlow = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الـ Flow؟')) setFlows(flows.filter(flow => flow.id !== id))
  }

  const addFlow = () => {
    const newId = flows.length > 0 ? Math.max(...flows.map(f => f.id)) + 1 : 1
    const newFlow = {
      id: newId, name: 'Flow جديد', trigger: 'كلمة مفتاحية جديدة', response: 'رد تلقائي جديد',
      active: true, type: 'DM', stats: { uses: 0, conversions: 0 }, createdAt: new Date().toISOString()
    }
    setFlows([...flows, newFlow])
  }

  const openEditModal = (flow) => { setEditingFlow({ ...flow }); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setEditingFlow(null) }
  const saveEditFlow = () => { setFlows(flows.map(flow => flow.id === editingFlow.id ? editingFlow : flow)); closeModal() }
  const updateEditingFlow = (field, value) => { setEditingFlow({ ...editingFlow, [field]: value }) }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }} style={{ color: '#00d4ff' }}>جاري التحميل...</motion.div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px', animation: 'float 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px', animation: 'float 12s infinite alternate', animationDelay: '-5s' }}></div>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

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
            <Link href="/dashboard/analytics" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              التحليلات
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
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الردود التلقائية (Flows)</h1>
            <p style={{ color: 'rgba(238,242,255,0.6)' }}>أنشئ ردود تلقائية ذكية للـ DMs والكومنتات</p>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,212,255,0.4)' }} whileTap={{ scale: 0.95 }} onClick={addFlow} style={{ background: '#00d4ff', color: '#05080f', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '99px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>+</span> إنشاء Flow جديد
          </motion.button>
        </motion.div>

        {/* Flows Grid */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {flows.map((flow) => (
            <motion.div key={flow.id} variants={fadeUp} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: `1px solid ${flow.active ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '20px', padding: '1.5rem', transition: 'all 0.2s' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <motion.div whileHover={{ scale: 1.1 }} style={{ width: '40px', height: '40px', borderRadius: '12px', background: flow.type === 'DM' ? 'rgba(0,212,255,0.2)' : 'rgba(255,165,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {flow.type === 'DM' ? '💬' : '📝'}
                  </motion.div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{flow.name}</h3>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '99px', background: flow.type === 'DM' ? 'rgba(0,212,255,0.2)' : 'rgba(255,165,0,0.2)', color: flow.type === 'DM' ? '#00d4ff' : '#ffa500' }}>
                      {flow.type === 'DM' ? 'رسائل خاصة' : 'تعليقات'}
                    </span>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleFlowStatus(flow.id)} style={{ background: flow.active ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: flow.active ? '#05080f' : '#eef2ff', border: 'none', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  {flow.active ? 'نشط ✓' : 'غير نشط'}
                </motion.button>
              </div>

              {/* Trigger */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(238,242,255,0.5)' }}>⚡ مفتاح التشغيل</div>
                <div style={{ fontSize: '0.9rem', color: '#eef2ff' }}>{flow.trigger}</div>
              </div>

              {/* Response */}
              <div style={{ background: 'rgba(0,212,255,0.05)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(238,242,255,0.5)' }}>💬 الرد التلقائي</div>
                <div style={{ fontSize: '0.9rem', color: '#00d4ff' }}>"{flow.response}"</div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <motion.div variants={numberVariants} style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00d4ff' }}>{flow.stats.uses}</motion.div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(238,242,255,0.5)' }}>عدد الاستخدامات</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <motion.div variants={numberVariants} style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>{flow.stats.conversions}</motion.div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(238,242,255,0.5)' }}>تحويلات</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <motion.div variants={numberVariants} style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffd700' }}>
                    {flow.stats.uses > 0 ? Math.round((flow.stats.conversions / flow.stats.uses) * 100) : 0}%
                  </motion.div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(238,242,255,0.5)' }}>نسبة التحويل</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openEditModal(flow)} style={{ flex: 1, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', padding: '0.5rem', borderRadius: '10px', color: '#00d4ff', cursor: 'pointer' }}>تعديل</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => deleteFlow(flow.id)} style={{ flex: 1, background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', padding: '0.5rem', borderRadius: '10px', color: '#ff6b6b', cursor: 'pointer' }}>حذف</motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {flows.length === 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.035)', borderRadius: '24px' }}>
            <div style={{ fontSize: '4rem' }}>🤖</div>
            <h3>لا توجد ردود تلقائية</h3>
            <p style={{ color: 'rgba(238,242,255,0.6)' }}>أنشئ أول Flow للرد التلقائي على العملاء</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addFlow} style={{ background: '#00d4ff', color: '#05080f', padding: '0.75rem 1.5rem', borderRadius: '99px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>+ إنشاء Flow جديد</motion.button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingFlow && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', background: 'rgba(5,8,15,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '24px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تعديل الـ Flow</h2>
            <div style={{ marginBottom: '1rem' }}><label>اسم الـ Flow</label><input type="text" value={editingFlow.name} onChange={(e) => updateEditingFlow('name', e.target.value)} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#eef2ff' }} /></div>
            <div style={{ marginBottom: '1rem' }}><label>النوع</label><select value={editingFlow.type} onChange={(e) => updateEditingFlow('type', e.target.value)} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#eef2ff' }}><option value="DM">رسائل خاصة (DM)</option><option value="Comment">تعليقات (Comment)</option></select></div>
            <div style={{ marginBottom: '1rem' }}><label>مفتاح التشغيل</label><input type="text" value={editingFlow.trigger} onChange={(e) => updateEditingFlow('trigger', e.target.value)} placeholder="مثال: سعر, اسعار, عرض" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#eef2ff' }} /></div>
            <div style={{ marginBottom: '1.5rem' }}><label>الرد التلقائي</label><textarea value={editingFlow.response} onChange={(e) => updateEditingFlow('response', e.target.value)} rows="3" placeholder="الرد الذي سيرسل تلقائياً..." style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#eef2ff', resize: 'vertical' }} /></div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveEditFlow} style={{ flex: 1, padding: '0.8rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer' }}>حفظ التغييرات</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={closeModal} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#eef2ff', borderRadius: '99px', cursor: 'pointer' }}>إلغاء</motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }
      `}</style>
    </main>
  )
}