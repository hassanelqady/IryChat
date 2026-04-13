'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Zap, Users, Radio, Repeat,
  MessageSquare, BarChart2, Settings, CreditCard,
  Link as LinkIcon, LogOut, ChevronLeft, ChevronRight,
  Menu, X, Link2, Bot
} from 'lucide-react'
import { useState } from 'react'

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
        { href: '/dashboard', icon: LayoutDashboard, label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
        { href: '/dashboard/accounts', icon: LinkIcon, label: lang === 'ar' ? 'الحسابات' : 'Accounts' },
        { href: '/dashboard/flows', icon: Zap, label: lang === 'ar' ? 'الأتمتات' : 'Automations' },
      ]
    },
    {
      section: lang === 'ar' ? 'الجمهور' : 'Audience',
      items: [
        { href: '/dashboard/subscribers', icon: Users, label: lang === 'ar' ? 'المشتركون' : 'Subscribers' },
        { href: '/dashboard/broadcast', icon: Radio, label: lang === 'ar' ? 'البث الجماعي' : 'Broadcast' },
        { href: '/dashboard/sequences', icon: Repeat, label: lang === 'ar' ? 'التسلسلات' : 'Sequences' },
        { href: '/dashboard/inbox', icon: MessageSquare, label: lang === 'ar' ? 'صندوق الوارد' : 'Inbox' },
        { href: '/dashboard/growth', icon: Link2, label: lang === 'ar' ? 'أدوات النمو' : 'Growth Tools' },
        { href: '/dashboard/ai', icon: Bot, label: lang === 'ar' ? 'ردود AI' : 'AI Replies' },
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
    { href: '/dashboard/settings', icon: Settings, label: lang === 'ar' ? 'الإعدادات' : 'Settings' },
    { href: '/dashboard/billing', icon: CreditCard, label: lang === 'ar' ? 'الفوترة' : 'Billing' },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center justify-between px-4 py-5 border-b border-white/10 ${collapsed ? 'px-3' : ''}`}>
        {!collapsed && (
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            Iry<span className="text-cyan-400">Chat</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          {isRTL
            ? (collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
            : (collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
          }
        </button>
        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5 text-gray-400">
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="text-gray-600 text-xs uppercase tracking-widest font-medium px-3 mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      active
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className={`flex-shrink-0 ${active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'}`} />
                    {!collapsed && <span>{item.label}</span>}
                    {active && !collapsed && (
                      <div className="absolute end-3 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <div className={`absolute ${isRTL ? 'right-full me-2' : 'left-full ms-2'} px-2 py-1 bg-black border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50`}>
                        {item.label}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-white/10 py-4 px-2 space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                active
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className={`absolute ${isRTL ? 'right-full me-2' : 'left-full ms-2'} px-2 py-1 bg-black border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50`}>
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}

        {/* Language toggle */}
        {!collapsed && (
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-base">🌐</span>
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group relative"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>}
          {collapsed && (
            <div className={`absolute ${isRTL ? 'right-full me-2' : 'left-full ms-2'} px-2 py-1 bg-black border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50`}>
              {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            </div>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 start-4 z-50 p-2.5 bg-black/80 backdrop-blur border border-white/10 rounded-xl text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`md:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 h-full w-72 bg-[#080808] border-e border-white/10`}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col h-screen bg-[#080808] border-e border-white/10 sticky top-0 flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.div>
    </>
  )
}