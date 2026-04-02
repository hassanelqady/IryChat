'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({ name: '', email: '', bio: '', instagram: '' })
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [instagram, setInstagram] = useState({ username: '', connected: false })

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
    whileHover: { y: -5, transition: { duration: 0.2 } }
  }

  useEffect(() => {
    const loggedUser = localStorage.getItem('irychat_user')
    if (!loggedUser) router.push('/login')
    else {
      const userData = JSON.parse(loggedUser)
      setUser(userData)
      setProfile({ name: userData.name || '', email: userData.email || '', bio: userData.bio || '', instagram: userData.instagram || '' })
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('irychat_user')
    router.push('/')
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    const updatedUser = { ...user, ...profile }
    localStorage.setItem('irychat_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (passwordData.new !== passwordData.confirm) { setPasswordError('كلمة المرور الجديدة غير متطابقة'); return }
    if (passwordData.new.length < 6) { setPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    setTimeout(() => { setPasswordSuccess('تم تغيير كلمة المرور بنجاح'); setPasswordData({ current: '', new: '', confirm: '' }) }, 1000)
  }

  const connectInstagram = () => { setInstagram({ username: '@' + (profile.instagram || 'user'), connected: true }); setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const disconnectInstagram = () => { setInstagram({ username: '', connected: false }); setSaved(true); setTimeout(() => setSaved(false), 3000) }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05080f' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }} style={{ color: '#00d4ff' }}>جاري التحميل...</motion.div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      {/* Background */}
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
            <Link href="/dashboard/flows" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              الردود التلقائية
            </Link>
            <Link href="/dashboard/analytics" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', transition: 'all 0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0,212,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              التحليلات
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

      {/* Content - باقي الكود كما هو */}
      <div style={{ padding: '7rem 5% 5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الإعدادات</h1>
          <p style={{ color: 'rgba(238,242,255,0.6)' }}>إدارة حسابك وإعدادات التطبيق</p>
        </motion.div>

        {/* Success Message */}
        {saved && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', color: '#4ade80' }}>تم حفظ التغييرات بنجاح ✅</motion.div>}

        {/* Tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['profile', 'password', 'instagram'].map((tab, i) => (
            <motion.button key={tab} whileHover={{ y: -2 }} onClick={() => setActiveTab(tab)} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === tab ? '#00d4ff' : 'rgba(238,242,255,0.6)', borderBottom: activeTab === tab ? '2px solid #00d4ff' : 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
              {tab === 'profile' ? 'الملف الشخصي' : tab === 'password' ? 'كلمة المرور' : 'ربط انستجرام'}
            </motion.button>
          ))}
        </motion.div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleProfileUpdate}>
              <motion.div variants={fadeUp}><label>الاسم</label><input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
              <motion.div variants={fadeUp}><label>البريد الإلكتروني</label><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
              <motion.div variants={fadeUp}><label>نبذة عنك</label><textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows="3" style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem', resize: 'vertical' }} /></motion.div>
              <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '0.9rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer' }}>حفظ التغييرات</motion.button>
            </form>
          </motion.div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            {passwordError && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', color: '#ff6b6b' }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', color: '#4ade80' }}>{passwordSuccess}</div>}
            <form onSubmit={handlePasswordUpdate}>
              <motion.div variants={fadeUp}><label>كلمة المرور الحالية</label><input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
              <motion.div variants={fadeUp}><label>كلمة المرور الجديدة</label><input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
              <motion.div variants={fadeUp}><label>تأكيد كلمة المرور الجديدة</label><input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} required style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
              <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '0.9rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer' }}>تغيير كلمة المرور</motion.button>
            </form>
          </motion.div>
        )}

        {/* Instagram Tab */}
        {activeTab === 'instagram' && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} {...cardHover} style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '2rem' }}><div style={{ fontSize: '3rem' }}>📸</div><h3>ربط حساب انستجرام</h3><p style={{ color: 'rgba(238,242,255,0.6)' }}>قم بربط حساب انستجرام الخاص بك لتفعيل الردود التلقائية</p></motion.div>
            {!instagram.connected ? (
              <>
                <motion.div variants={fadeUp}><label>اسم المستخدم في انستجرام</label><input type="text" placeholder="@username" value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#eef2ff', marginBottom: '1rem' }} /></motion.div>
                <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={connectInstagram} style={{ width: '100%', padding: '0.9rem', background: '#00d4ff', color: '#05080f', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer' }}>ربط الحساب</motion.button>
              </>
            ) : (
              <>
                <motion.div variants={fadeUp} style={{ background: 'rgba(0,212,255,0.05)', borderRadius: '16px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}><div>✅</div><div style={{ fontWeight: 600, color: '#00d4ff' }}>{instagram.username}</div><div style={{ fontSize: '0.8rem', color: 'rgba(238,242,255,0.5)' }}>متصل</div></motion.div>
                <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={disconnectInstagram} style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', borderRadius: '99px', fontWeight: 700, cursor: 'pointer' }}>فصل الحساب</motion.button>
              </>
            )}
          </motion.div>
        )}
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