'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Zap, MessageSquare, Link as LinkIcon, BarChart2,
  Users, Radio, Repeat, CreditCard, Settings,
  TrendingUp, Link2, Grid,
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0, activeAutomations: 0,
    connectedAccounts: 0, totalAutomations: 0,
  })
  const { lang } = useLanguage()

  const t = {
    ar: {
      hello: 'مرحباً،', subtitle: 'إليك ما يحدث مع أتمتتك اليوم.',
      activeAutomations: 'أتمتة نشطة', fromTotal: 'من إجمالي',
      totalReplies: 'إجمالي الردود', totalOps: 'إجمالي العمليات',
      connectedAccounts: 'حسابات متصلة', quickActions: 'إجراءات سريعة',
      loading: 'جاري التحميل...',
    },
    en: {
      hello: 'Hello,', subtitle: "Here's what's happening with your automations today.",
      activeAutomations: 'Active Automations', fromTotal: 'from',
      totalReplies: 'Total Replies', totalOps: 'Total operations',
      connectedAccounts: 'Connected Accounts', quickActions: 'Quick Actions',
      loading: 'Loading...',
    },
  }[lang]

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        const user = data?.user
        if (!user) { router.push('/login'); return }
        setUser(user)
        const { data: automationsData } = await supabase.from('automations').select('id').eq('user_id', user.id)
        const ids = automationsData?.map(a => a.id) || []
        const [
          { count: totalLogs },
          { count: activeAutomations },
          { count: connectedAccounts },
          { count: totalAutomations },
        ] = await Promise.all([
          supabase.from('automation_logs').select('*', { count: 'exact', head: true }).in('automation_id', ids.length ? ids : ['none']),
          supabase.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
          supabase.from('connected_accounts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        ])
        setStats({
          totalLogs: totalLogs || 0, activeAutomations: activeAutomations || 0,
          connectedAccounts: connectedAccounts || 0, totalAutomations: totalAutomations || 0,
        })
      } catch (err) {
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  const quickActions = [
    { href: '/dashboard/accounts',        icon: LinkIcon,      label: lang === 'ar' ? 'الحسابات'     : 'Accounts',        desc: lang === 'ar' ? 'ربط Instagram / Facebook'  : 'Connect Instagram / Facebook' },
    { href: '/dashboard/automations/new', icon: Zap,           label: lang === 'ar' ? 'أتمتة جديدة'  : 'New Automation',  desc: lang === 'ar' ? 'رد آلي على الرسائل'        : 'Auto-reply to DMs', highlight: true },
    { href: '/dashboard/automations',     icon: Grid,          label: lang === 'ar' ? 'كل الأتمتات'  : 'All Automations', desc: lang === 'ar' ? 'إدارة جميع الأتمتات'       : 'Manage all automations' },
    { href: '/dashboard/subscribers',     icon: Users,         label: lang === 'ar' ? 'المشتركون'    : 'Subscribers',     desc: lang === 'ar' ? 'إدارة جمهورك'              : 'Manage your audience' },
    { href: '/dashboard/broadcast',       icon: Radio,         label: lang === 'ar' ? 'البث الجماعي' : 'Broadcast',       desc: lang === 'ar' ? 'إرسال رسائل جماعية'        : 'Send bulk messages' },
    { href: '/dashboard/sequences',       icon: Repeat,        label: lang === 'ar' ? 'التسلسلات'    : 'Sequences',       desc: lang === 'ar' ? 'رسائل متسلسلة تلقائية'     : 'Automated message series' },
    { href: '/dashboard/inbox',           icon: MessageSquare, label: lang === 'ar' ? 'صندوق الوارد' : 'Inbox',           desc: lang === 'ar' ? 'محادثات مباشرة'             : 'Live conversations' },
    { href: '/dashboard/growth',          icon: Link2,         label: lang === 'ar' ? 'أدوات النمو'  : 'Growth Tools',    desc: lang === 'ar' ? 'روابط وQR Code'             : 'Links & QR Codes' },
    { href: '/dashboard/analytics',       icon: BarChart2,     label: lang === 'ar' ? 'التحليلات'    : 'Analytics',       desc: lang === 'ar' ? 'تقارير الأداء'              : 'View performance reports' },
    { href: '/dashboard/settings',        icon: Settings,      label: lang === 'ar' ? 'الإعدادات'    : 'Settings',        desc: lang === 'ar' ? 'إدارة حسابك'               : 'Manage account' },
    { href: '/dashboard/billing',         icon: CreditCard,    label: lang === 'ar' ? 'الفوترة'      : 'Billing',         desc: lang === 'ar' ? 'إدارة اشتراكك'             : 'Manage subscription' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-3" style={{ color: 'var(--db-text-3)' }}>
        <Zap className="w-5 h-5 animate-pulse" style={{ color: 'var(--db-primary)' }} />
        <span className="text-sm font-medium">{t.loading}</span>
      </div>
    </div>
  )

  const statCards = [
    { icon: Zap,        value: stats.activeAutomations, label: t.activeAutomations, sub: `${t.fromTotal} ${stats.totalAutomations}`, color: 'var(--db-primary)', bg: 'var(--db-primary-bg)' },
    { icon: MessageSquare, value: stats.totalLogs,       label: t.totalReplies,      sub: t.totalOps,               color: '#9333EA', bg: '#F5F3FF' },
    { icon: LinkIcon,   value: stats.connectedAccounts, label: t.connectedAccounts, sub: 'Instagram / Facebook',    color: '#16A34A', bg: '#F0FDF4' },
  ]

  return (
    <main className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--db-text-h)' }}>
          {t.hello}{' '}
          <span style={{ color: 'var(--db-primary)' }}>{user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--db-text-2)' }}>{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="rounded-2xl p-5 text-center"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="inline-flex p-3 rounded-xl mb-3" style={{ backgroundColor: stat.bg }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--db-text-h)' }}>{stat.value}</div>
              <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--db-text-2)' }}>{stat.label}</div>
              <div className="text-xs" style={{ color: 'var(--db-text-3)' }}>{stat.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--db-text-h)' }}>
          <TrendingUp size={15} style={{ color: 'var(--db-primary)' }} />
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-150"
                style={action.highlight
                  ? { backgroundColor: 'var(--db-primary)', borderColor: 'var(--db-primary)' }
                  : { backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)' }
                }
                onMouseEnter={e => {
                  if (!action.highlight) {
                    e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'
                    e.currentTarget.style.borderColor = 'var(--db-border-2)'
                  } else {
                    e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'
                  }
                }}
                onMouseLeave={e => {
                  if (!action.highlight) {
                    e.currentTarget.style.backgroundColor = 'var(--db-surface)'
                    e.currentTarget.style.borderColor = 'var(--db-border)'
                  } else {
                    e.currentTarget.style.backgroundColor = 'var(--db-primary)'
                  }
                }}
              >
                <div className="inline-flex p-2.5 rounded-xl mb-2.5"
                  style={{ backgroundColor: action.highlight ? 'rgba(255,255,255,0.15)' : 'var(--db-icon-bg)' }}>
                  <Icon size={18} style={{ color: action.highlight ? '#FFFFFF' : 'var(--db-text-2)' }} />
                </div>
                <div className="font-semibold text-xs mb-0.5"
                  style={{ color: action.highlight ? '#FFFFFF' : 'var(--db-text-h)' }}>
                  {action.label}
                </div>
                <div className="text-[10px] leading-snug"
                  style={{ color: action.highlight ? 'rgba(255,255,255,0.75)' : 'var(--db-text-3)' }}>
                  {action.desc}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
