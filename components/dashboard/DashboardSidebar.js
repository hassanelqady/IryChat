'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import ThemeToggle from '@/components/ThemeToggle'
import {
  LayoutDashboard, Zap, Users, Radio, Repeat,
  MessageSquare, BarChart2, Settings, CreditCard,
  Link as LinkIcon, LogOut, ChevronLeft, ChevronRight,
  Menu, X, Link2, Plug
} from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, toggleLanguage } = useLanguage()
  const isRTL = lang === 'ar'
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    {
      section: lang === 'ar' ? 'الرئيسية' : 'Main',
      items: [
        { href: '/dashboard',             icon: LayoutDashboard, label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
        { href: '/dashboard/accounts',    icon: LinkIcon,        label: lang === 'ar' ? 'الحسابات'    : 'Accounts' },
        { href: '/dashboard/automations', icon: Zap,             label: lang === 'ar' ? 'الأتمتات'    : 'Automations' },
      ]
    },
    {
      section: lang === 'ar' ? 'الجمهور' : 'Audience',
      items: [
        { href: '/dashboard/subscribers',  icon: Users,         label: lang === 'ar' ? 'المشتركون'    : 'Subscribers' },
        { href: '/dashboard/broadcast',    icon: Radio,         label: lang === 'ar' ? 'البث الجماعي' : 'Broadcast' },
        { href: '/dashboard/sequences',    icon: Repeat,        label: lang === 'ar' ? 'التسلسلات'    : 'Sequences' },
        { href: '/dashboard/inbox',        icon: MessageSquare, label: lang === 'ar' ? 'صندوق الوارد' : 'Inbox' },
        { href: '/dashboard/growth',       icon: Link2,         label: lang === 'ar' ? 'أدوات النمو'  : 'Growth Tools' },
        { href: '/dashboard/integrations', icon: Plug,          label: lang === 'ar' ? 'التكاملات'    : 'Integrations' },
      ]
    },
    {
      section: lang === 'ar' ? 'التحليل' : 'Insights',
      items: [
        { href: '/dashboard/analytics', icon: BarChart2, label: lang === 'ar' ? 'التحليلات' : 'Analytics' },
      ]
    },
  ]

  const bottomItems = [
    { href: '/dashboard/settings', icon: Settings,   label: lang === 'ar' ? 'الإعدادات' : 'Settings' },
    { href: '/dashboard/billing',  icon: CreditCard, label: lang === 'ar' ? 'الفوترة'   : 'Billing' },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--db-bg)' }}>

      {/* ── Logo ── */}
      <div
        className={`flex items-center justify-between py-5 border-b ${collapsed ? 'px-3' : 'px-4'}`}
        style={{ borderColor: 'var(--db-border)' }}
      >
        {!collapsed && (
          <Link href="/" className="text-2xl font-black tracking-tight" style={{ color: 'var(--db-text-h)' }}>
            IryChat
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg transition-all"
          style={{ backgroundColor: 'var(--db-active-bg)', color: 'var(--db-text-2)' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--db-border-2)'
            e.currentTarget.style.color = 'var(--db-text-h)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--db-active-bg)'
            e.currentTarget.style.color = 'var(--db-text-2)'
          }}
        >
          {isRTL
            ? (collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
            : (collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
          }
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5"
          style={{ color: 'var(--db-text-2)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p
                className="text-xs uppercase tracking-wide font-bold px-3 mb-2"
                style={{ color: 'var(--db-text-3)' }}
              >
                {section.section}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
                    style={{
                      backgroundColor: active ? 'var(--db-active-bg)' : 'transparent',
                      color: active ? 'var(--db-text-h)' : 'var(--db-text-2)',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'
                        e.currentTarget.style.color = 'var(--db-text-h)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--db-text-2)'
                      }
                    }}
                  >
                    <Icon
                      size={18}
                      className="flex-shrink-0"
                      style={{ color: active ? 'var(--db-primary)' : 'var(--db-text-3)' }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {active && !collapsed && (
                      <div
                        className="absolute end-3 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--db-primary)' }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className="border-t py-4 px-2 space-y-0.5" style={{ borderColor: 'var(--db-border)' }}>
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2 mb-1">
            <ThemeToggle />
            <button
              onClick={toggleLanguage}
              className="text-xs transition-colors"
              style={{ color: 'var(--db-text-2)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--db-text-h)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--db-text-2)'}
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        )}

        {bottomItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? 'var(--db-active-bg)' : 'transparent',
                color: active ? 'var(--db-text-h)' : 'var(--db-text-2)',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'
                  e.currentTarget.style.color = 'var(--db-text-h)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--db-text-2)'
                }
              }}
            >
              <Icon size={18} className="flex-shrink-0" style={{ color: active ? 'var(--db-primary)' : 'var(--db-text-3)' }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#EF4444' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#FEF2F2'
            e.currentTarget.style.color = '#DC2626'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#EF4444'
          }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 start-4 z-50 p-2.5 rounded-xl shadow-md"
        style={{
          backgroundColor: 'var(--db-bg)',
          border: '1px solid var(--db-border)',
          color: 'var(--db-text-2)',
        }}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`md:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 h-full w-72`}
            style={{
              backgroundColor: 'var(--db-bg)',
              borderInlineEnd: '1px solid var(--db-border)',
            }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-hidden"
        style={{
          backgroundColor: 'var(--db-bg)',
          borderInlineEnd: '1px solid var(--db-border)',
        }}
      >
        <SidebarContent />
      </motion.div>
    </>
  )
}
