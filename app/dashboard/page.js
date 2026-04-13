'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Zap, MessageSquare, Link as LinkIcon, BarChart2,
  Users, Radio, Repeat, CreditCard, Settings,
  Grid, TrendingUp, Link2
} from 'lucide-react'

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

  const t = {
    ar: {
      hello: 'مرحباً،',
      subtitle: 'إليك ما يحدث مع أتمتتك اليوم.',
      activeAutomations: 'أتمتة نشطة',
      fromTotal: 'من إجمالي',
      totalReplies: 'إجمالي الردود',
      totalOps: 'إجمالي العمليات',
      connectedAccounts: 'حسابات متصلة',
      quickActions: 'إجراءات سريعة',
      loading: 'جاري التحميل...',
    },
    en: {
      hello: 'Hello,',
      subtitle: "Here is what's happening with your automations today.",
      activeAutomations: 'Active Automations',
      fromTotal: 'from',
      totalReplies: 'Total Replies',
      totalOps: 'Total operations',
      connectedAccounts: 'Connected Accounts',
      quickActions: 'Quick Actions',
      loading: 'Loading...',
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const automationIds = (await supabase.from('automations').select('id').eq('user_id', user.id)).data?.map(a => a.id) || []

      const [
        { count: totalLogs },
        { count: activeAutomations },
        { count: connectedAccounts },
        { count: totalAutomations },
      ] = await Promise.all([
        supabase.from('automation_logs').select('*', { count: 'exact', head: true }).in('automation_id', automationIds.length ? automationIds : ['none']),
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

  const quickActions = [
    { href: '/dashboard/accounts',       icon: LinkIcon,      color: 'bg-blue-500/10 text-blue-400',    label: lang === 'ar' ? 'الحسابات' : 'Accounts',         desc: lang === 'ar' ? 'ربط Instagram / Facebook' : 'Connect Instagram / Facebook' },
    { href: '/dashboard/automations/new',icon: Zap,           color: 'bg-cyan-500/10 text-cyan-400',    label: lang === 'ar' ? 'أتمتة جديدة' : 'New Automation', desc: lang === 'ar' ? 'رد آلي على الرسائل' : 'Auto-reply to DMs', highlight: true },
    { href: '/dashboard/flows',          icon: Grid,          color: 'bg-purple-500/10 text-purple-400', label: lang === 'ar' ? 'كل الأتمتات' : 'All Automations', desc: lang === 'ar' ? 'إدارة وعرض جميع المسارات' : 'Manage all flows' },
    { href: '/dashboard/subscribers',    icon: Users,         color: 'bg-green-500/10 text-green-400',  label: lang === 'ar' ? 'المشتركون' : 'Subscribers',      desc: lang === 'ar' ? 'إدارة جمهورك' : 'Manage your audience' },
    { href: '/dashboard/broadcast',      icon: Radio,         color: 'bg-orange-500/10 text-orange-400', label: lang === 'ar' ? 'البث الجماعي' : 'Broadcast',    desc: lang === 'ar' ? 'إرسال رسائل جماعية' : 'Send bulk messages' },
    { href: '/dashboard/sequences',      icon: Repeat,        color: 'bg-pink-500/10 text-pink-400',    label: lang === 'ar' ? 'التسلسلات' : 'Sequences',        desc: lang === 'ar' ? 'رسائل متسلسلة تلقائية' : 'Automated message series' },
    { href: '/dashboard/inbox',          icon: MessageSquare, color: 'bg-teal-500/10 text-teal-400',    label: lang === 'ar' ? 'صندوق الوارد' : 'Inbox',          desc: lang === 'ar' ? 'محادثات مباشرة' : 'Live conversations' },
    { href: '/dashboard/growth',         icon: Link2,         color: 'bg-cyan-500/10 text-cyan-400',    label: lang === 'ar' ? 'أدوات النمو' : 'Growth Tools',    desc: lang === 'ar' ? 'روابط وQR Code' : 'Links & QR Codes' },
    { href: '/dashboard/analytics',      icon: BarChart2,     color: 'bg-yellow-500/10 text-yellow-400', label: lang === 'ar' ? 'التحليلات' : 'Analytics',       desc: lang === 'ar' ? 'عرض تقارير الأداء' : 'View performance reports' },
    { href: '/dashboard/settings',       icon: Settings,      color: 'bg-gray-500/10 text-gray-400',    label: lang === 'ar' ? 'الإعدادات' : 'Settings',         desc: lang === 'ar' ? 'إدارة حسابك' : 'Manage account' },
    { href: '/dashboard/billing',        icon: CreditCard,    color: 'bg-violet-500/10 text-violet-400', label: lang === 'ar' ? 'الفوترة' : 'Billing',           desc: lang === 'ar' ? 'إدارة اشتراكك' : 'Manage subscription' },
  ]

  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }
  const fadeUp  = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Zap className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <main className="p-6 md:p-8 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
          {t.hello} <span className="text-cyan-400">{user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Zap,          color: 'bg-cyan-500/10 text-cyan-400',    value: stats.activeAutomations, label: t.activeAutomations, sub: `${t.fromTotal} ${stats.totalAutomations}` },
          { icon: MessageSquare,color: 'bg-purple-500/10 text-purple-400', value: stats.totalLogs,         label: t.totalReplies,       sub: t.totalOps },
          { icon: LinkIcon,     color: 'bg-green-500/10 text-green-400',  value: stats.connectedAccounts, label: t.connectedAccounts,  sub: 'Instagram / Facebook' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center"
            >
              <div className={`inline-flex p-3 rounded-2xl ${stat.color} mb-3`}><Icon size={24} /></div>
              <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm font-medium mb-0.5">{stat.label}</div>
              <div className="text-gray-600 text-xs">{stat.sub}</div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-cyan-400" />
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <motion.div key={action.href} variants={fadeUp} whileHover={{ y: -4, scale: 1.03 }}>
                <Link href={action.href}
                  className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all h-full ${
                    action.highlight
                      ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-xl ${action.color} mb-3`}><Icon size={22} /></div>
                  <div className="text-white font-semibold text-sm mb-1">{action.label}</div>
                  <div className="text-gray-500 text-xs leading-snug">{action.desc}</div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

    </main>
  )
}