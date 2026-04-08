'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Key, Instagram as InstaIcon, LogOut, CheckCircle, AlertCircle, Save, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'
import { useLanguage } from '@/context/LanguageContext'

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
  
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      settings: "Settings",
      subtitle: "Manage your account and application preferences",
      profile: "Profile",
      password: "Password",
      instagram: "Instagram",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      bioLabel: "Bio",
      saveBtn: "Save Changes",
      currentPass: "Current Password",
      newPass: "New Password",
      confirmPass: "Confirm New Password",
      updatePassBtn: "Update Password",
      connectInsta: "Connect Instagram",
      usernamePlaceholder: "@username",
      connectedAs: "Connected as",
      disconnectBtn: "Disconnect",
      passMismatch: "New passwords do not match.",
      passShort: "Password must be at least 6 characters.",
      passSuccess: "Password updated successfully!",
      loading: "Loading...",
      saved: "Changes saved successfully!",
    },
    ar: {
      settings: "الإعدادات",
      subtitle: "إدارة حسابك وإعدادات التطبيق",
      profile: "الملف الشخصي",
      password: "كلمة المرور",
      instagram: "إنستجرام",
      nameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      bioLabel: "نبذة عنك",
      saveBtn: "حفظ التغييرات",
      currentPass: "كلمة المرور الحالية",
      newPass: "كلمة المرور الجديدة",
      confirmPass: "تأكيد كلمة المرور الجديدة",
      updatePassBtn: "تغيير كلمة المرور",
      connectInsta: "ربط انستجرام",
      usernamePlaceholder: "@اسم_المستخدم",
      connectedAs: "متصل بـ",
      disconnectBtn: "فصل الحساب",
      passMismatch: "كلمات المرور غير متطابقة.",
      passShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
      passSuccess: "تم تحديث كلمة المرور بنجاح!",
      loading: "جاري التحميل...",
      saved: "تم حفظ التغييرات بنجاح!",
    }
  }

  const t = content[lang]

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  useEffect(() => {
    // محاكاة جلب المستخدم (نفس المنطق القديم)
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
    if (passwordData.new !== passwordData.confirm) { setPasswordError(t.passMismatch); return }
    if (passwordData.new.length < 6) { setPasswordError(t.passShort); return }
    setTimeout(() => { setPasswordSuccess(t.passSuccess); setPasswordData({ current: '', new: '', confirm: '' }) }, 1000)
  }

  const connectInstagram = () => { 
    setInstagram({ username: '@' + (profile.instagram || 'user'), connected: true }); 
    setSaved(true); 
    setTimeout(() => setSaved(false), 3000) 
  }
  
  const disconnectInstagram = () => { 
    setInstagram({ username: '', connected: false }); 
    setSaved(true); 
    setTimeout(() => setSaved(false), 3000) 
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-cyan-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">{t.settings}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Success Alert */}
        {saved && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-green-400"
          >
            <CheckCircle size={20} />
            {t.saved}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto">
          {[
            { id: 'profile', label: t.profile, icon: User },
            { id: 'password', label: t.password, icon: Key },
            { id: 'instagram', label: t.instagram, icon: InstaIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.nameLabel}</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.emailLabel}</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.bioLabel}</label>
                <textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                  rows="4" 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-vertical"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {t.saveBtn}
              </button>
            </form>
          </motion.div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-xl">
            {passwordError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 flex items-center gap-2"><AlertCircle size={18} /> {passwordError}</div>}
            {passwordSuccess && <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-sm text-green-400 flex items-center gap-2"><CheckCircle size={18} /> {passwordSuccess}</div>}
            
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.currentPass}</label>
                <input 
                  type="password" 
                  value={passwordData.current} 
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.newPass}</label>
                <input 
                  type="password" 
                  value={passwordData.new} 
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.confirmPass}</label>
                <input 
                  type="password" 
                  value={passwordData.confirm} 
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} 
                  required 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {t.updatePassBtn}
              </button>
            </form>
          </motion.div>
        )}

        {/* Instagram Tab */}
        {activeTab === 'instagram' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-xl text-center">
            {!instagram.connected ? (
              <>
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 mb-6 text-white">
                  <InstaIcon size={48} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t.connectInsta}</h3>
                <p className="text-gray-400 mb-8">قم بربط حساب انستجرام الخاص بك لتفعيل الردود التلقائية.</p>
                
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder={t.usernamePlaceholder} 
                    value={profile.instagram} 
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} 
                    className="w-full pl-12 p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <span className="text-xl">@</span>
                  </div>
                </div>

                <button 
                  onClick={connectInstagram} 
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <InstaIcon size={20} />
                  {t.connectInsta}
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white">
                    <InstaIcon size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-lg">{t.connectedAs}</div>
                    <div className="text-cyan-400 font-medium">{instagram.username}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <button 
                  onClick={disconnectInstagram} 
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-full border border-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  {t.disconnectBtn}
                </button>
              </div>
            )}
          </motion.div>
        )}

      </main>
    </PageLayoutWith3D>
  )
}