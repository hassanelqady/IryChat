'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogOut, Settings, Grid, Zap, MessageSquare, Link as LinkIcon, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

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
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      dashboard: "Dashboard",
      hello: "Hello,",
      dashboardSubtitle: "Here is what's happening with your automations today.",
      activeAutomations: "Active Automations",
      fromTotal: "from",
      totalReplies: "Total Replies",
      totalOps: "Total operations",
      connectedAccounts: "Connected Accounts",
      connectAccount: "Connect Account",
      noAccountWarning: "No Connected Accounts",
      noAccountDesc: "Connect your Instagram or Facebook account to start automating.",
      quickActions: "Quick Actions",
      accounts: "Accounts",
      connectIG: "Connect Instagram",
      newAutomation: "New Automation",
      autoReplyDM: "Auto-reply to DMs",
      allAutomations: "All Automations",
      manageView: "Manage and view all flows",
      logout: "Logout",
      loading: "Loading...",
    },
    ar: {
      dashboard: "لوحة التحكم",
      hello: "مرحباً،",
      dashboardSubtitle: "إليك ما يحدث مع أتمتتك اليوم.",
      activeAutomations: "أتمتة نشطة",
      fromTotal: "من إجمالي",
      totalReplies: "إجمالي الردود",
      totalOps: "إجمالي العمليات",
      connectedAccounts: "حسابات متصلة",
      connectAccount: "ربط الحساب",
      noAccountWarning: "لا توجد حسابات متصلة",
      noAccountDesc: "قم بربط حساب إنستجرام أو فيسبوك لبدء الأتمتة.",
      quickActions: "إجراءات سريعة",
      accounts: "الحسابات",
      connectIG: "ربط انستجرام",
      newAutomation: "أتمتة جديدة",
      autoReplyDM: "رد آلي على الرسائل",
      allAutomations: "كل الأتمتات",
      manageView: "إدارة وعرض جميع المسارات",
      logout: "تسجيل الخروج",
      loading: "جاري التحميل...",
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const cardHover = {
    whileHover: { y: -5, scale: 1.02, transition: { duration: 0.2 } }
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

      // Fetching stats (Keeping original logic)
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Settings className="w-6 h-6" />
        </motion.div>
        <span className="text-xl font-medium animate-pulse">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Dashboard Header / Sub-nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t.hello} <span className="text-cyan-400">{user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-400">{t.dashboardSubtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/accounts" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              <Grid size={18} />
              {t.accounts}
            </Link>
            <Link 
              href="/dashboard/flows" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              <Zap size={18} />
              {t.allAutomations}
            </Link>
            
            <div className="h-6 w-px bg-white/20 mx-1 hidden md:block"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium transition-all"
            >
              <LogOut size={18} />
              {t.logout}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
          {/* Active Automations */}
          <motion.div variants={fadeUp} {...cardHover} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4">
              <Zap size={28} />
            </div>
            <motion.div variants={numberVariants} className="text-4xl font-bold text-white mb-1">{stats.activeAutomations}</motion.div>
            <div className="text-gray-400 font-medium mb-1">{t.activeAutomations}</div>
            <div className="text-xs text-gray-500">{t.fromTotal} {stats.totalAutomations}</div>
          </motion.div>

          {/* Total Replies */}
          <motion.div variants={fadeUp} {...cardHover} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
              <MessageSquare size={28} />
            </div>
            <motion.div variants={numberVariants} className="text-4xl font-bold text-white mb-1">{stats.totalLogs}</motion.div>
            <div className="text-gray-400 font-medium mb-1">{t.totalReplies}</div>
            <div className="text-xs text-gray-500">{t.totalOps}</div>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div variants={fadeUp} {...cardHover} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-green-500/10 text-green-400 mb-4">
              <LinkIcon size={28} />
            </div>
            <motion.div variants={numberVariants} className={`text-4xl font-bold mb-1 ${stats.connectedAccounts > 0 ? 'text-green-400' : 'text-cyan-400'}`}>
              {stats.connectedAccounts}
            </motion.div>
            <div className="text-gray-400 font-medium mb-1">{t.connectedAccounts}</div>
            <div className="text-xs text-gray-500">
  Instagram / Facebook
</div>

          </motion.div>
        </motion.div>

       

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-xl font-bold text-white mb-6">{t.quickActions}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Connect Account Card */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/accounts" className="block h-full bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl p-8 text-center text-white transition-all">
                <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-4">
                  <LinkIcon size={32} />
                </div>
                <div className="text-xl font-bold mb-2">{t.accounts}</div>
                <div className="text-sm text-gray-400">{t.connectIG}</div>
              </Link>
            </motion.div>

            {/* New Automation Card */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/automations/new" className="block h-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 rounded-3xl p-8 text-center text-white transition-all">
                <div className="inline-flex p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-4">
                  <Zap size={32} />
                </div>
                <div className="text-xl font-bold mb-2">{t.newAutomation}</div>
                <div className="text-sm text-gray-300">{t.autoReplyDM}</div>
              </Link>
            </motion.div>

            {/* View All Automations Card */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link href="/dashboard/flows" className="block h-full bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl p-8 text-center text-white transition-all">
                <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
                  <Grid size={32} />
                </div>
                <div className="text-xl font-bold mb-2">{t.allAutomations}</div>
                <div className="text-sm text-gray-400">{t.manageView}</div>
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </PageLayoutWith3D>
  )
}