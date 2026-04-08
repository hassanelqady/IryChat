'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Play, Pause, Pencil, Trash2, Bot, LogOut, Zap, Grid, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

export default function AutomationsPage() {
  const router = useRouter()
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      automationsTitle: "All Automations",
      automationsDesc: "Manage and monitor all your automation flows.",
      newAutomationBtn: "New Automation",
      noAutomations: "No Automations Yet",
      noAutomationsDesc: "Create your first automation to start replying to comments and DMs automatically.",
      keyword: "Keyword",
      active: "Active",
      inactive: "Inactive",
      stop: "Stop",
      start: "Start",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this automation?",
      dashboard: "Dashboard",
      accounts: "Accounts",
      automations: "Automations",
      logout: "Logout",
      loading: "Loading...",
    },
    ar: {
      automationsTitle: "كل الأتمتات",
      automationsDesc: "إدارة ومراقبة جميع تدفقات الأتمتة الخاصة بك.",
      newAutomationBtn: "أتمتة جديدة",
      noAutomations: "لا توجد أتمتات بعد",
      noAutomationsDesc: "أنشئ أتمتتك الأولى لبدء الرد على التعليقات والرسائل تلقائياً.",
      keyword: "كلمة مفتاحية",
      active: "نشط",
      inactive: "غير نشط",
      stop: "إيقاف",
      start: "بدء",
      edit: "تعديل",
      delete: "حذف",
      deleteConfirm: "هل أنت متأكد من حذف هذه الأتمتة؟",
      dashboard: "لوحة التحكم",
      accounts: "الحسابات",
      automations: "الأتمتات",
      logout: "تسجيل الخروج",
      loading: "جاري التحميل...",
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
    if (!confirm(t.deleteConfirm)) return
    const supabase = createClient()
    await supabase.from('automations').delete().eq('id', id)
    setAutomations(automations.filter(a => a.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Grid className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Dashboard Sub-nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.automationsTitle}</h1>
            <p className="text-gray-400">{t.automationsDesc}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              <Zap size={18} />
              {t.dashboard}
            </Link>
            <Link 
              href="/dashboard/accounts" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              <Grid size={18} />
              {t.accounts}
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

        {/* Create Button */}
        <div className="mb-8 flex justify-end">
          <Link 
            href="/dashboard/automations/new"
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            {t.newAutomationBtn}
          </Link>
        </div>

        {/* Empty State */}
        {automations.length === 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center mb-10">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-400 mb-6">
              <Bot size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.noAutomations}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">{t.noAutomationsDesc}</p>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all">
              <Plus size={20} />
              {t.newAutomationBtn}
            </Link>
          </motion.div>
        )}

        {/* Automations List */}
        <div className="flex flex-col gap-4">
          {automations.map((automation, i) => (
            <motion.div key={automation.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all hover:border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 ${
                automation.is_active ? 'border-cyan-500/30' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  automation.is_active ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'
                }`}>
                  <Zap size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">{automation.name}</div>
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-gray-500">{t.keyword}:</span>
                    <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs font-mono">
                      {automation.trigger_keyword}
                    </span>
                    {automation.connected_accounts && (
                      <>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-300">
                          {automation.connected_accounts.account_type === 'instagram' ? '📸' : '📘'} {automation.connected_accounts.account_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Status Badge */}
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  automation.is_active 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-white/5 border-white/10 text-gray-500'
                }`}>
                  {automation.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {automation.is_active ? t.active : t.inactive}
                </span>

                {/* Toggle Button */}
                <button 
                  onClick={() => toggleStatus(automation.id, automation.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.is_active 
                      ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' 
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                  title={automation.is_active ? t.stop : t.start}
                >
                  {automation.is_active ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Edit Button */}
                <Link href={`/dashboard/automations/${automation.id}/edit`}
                  className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  title={t.edit}
                >
                  <Pencil size={20} />
                </Link>

                {/* Delete Button */}
                <button 
                  onClick={() => deleteAutomation(automation.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title={t.delete}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </PageLayoutWith3D>
  )
}