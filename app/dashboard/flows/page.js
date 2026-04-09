'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Play, Pause, Pencil, Trash2, Bot, Zap, Grid, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

export default function FlowsPage() {
  const router = useRouter()
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      title: "All Automations",
      desc: "Manage and monitor all your automation flows.",
      newBtn: "New Automation",
      emptyTitle: "No Automations Yet",
      emptyDesc: "Create your first automation to start replying to comments and DMs automatically.",
      keywords: "Keywords",
      replies: "Replies",
      dms: "DMs",
      active: "Active",
      inactive: "Inactive",
      stop: "Pause",
      start: "Activate",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this automation?",
      dashboard: "Dashboard",
      accounts: "Accounts",
      loading: "Loading...",
      any: "Any post",
      back: "Back",
    },
    ar: {
      title: "كل الأتمتات",
      desc: "إدارة ومراقبة جميع تدفقات الأتمتة الخاصة بك.",
      newBtn: "أتمتة جديدة",
      emptyTitle: "لا توجد أتمتات بعد",
      emptyDesc: "أنشئ أتمتتك الأولى لبدء الرد على التعليقات والرسائل تلقائياً.",
      keywords: "الكلمات المفتاحية",
      replies: "ردود التعليقات",
      dms: "رسائل DM",
      active: "نشط",
      inactive: "غير نشط",
      stop: "إيقاف",
      start: "تفعيل",
      edit: "تعديل",
      delete: "حذف",
      deleteConfirm: "هل أنت متأكد من حذف هذه الأتمتة؟",
      dashboard: "لوحة التحكم",
      accounts: "الحسابات",
      loading: "جاري التحميل...",
      any: "كل المنشورات",
      back: "رجوع",
    }
  }

  const t = content[lang]

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
    <div className="min-h-screen flex items-center justify-center bg-black">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-gray-400">{t.desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              {t.back}
            </Link>
            <Link href="/dashboard/accounts" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
              <Grid size={18} /> {t.accounts}
            </Link>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-8 flex justify-end">
          <Link href="/dashboard/automations/new" className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-lg shadow-cyan-500/20">
            <Plus size={20} /> {t.newBtn}
          </Link>
        </div>

        {/* Empty State */}
        {automations.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-400 mb-6">
              <Bot size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.emptyTitle}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">{t.emptyDesc}</p>
            <Link href="/dashboard/automations/new" className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all">
              <Plus size={20} /> {t.newBtn}
            </Link>
          </motion.div>
        )}

        {/* Automations List */}
        <div className="flex flex-col gap-4">
          {automations.map((automation, i) => {
            const keywords = automation.trigger_keywords?.length > 0
              ? automation.trigger_keywords
              : automation.trigger_keyword ? [automation.trigger_keyword] : []
            const repliesCount = automation.comment_replies?.length || (automation.comment_reply ? 1 : 0)
            const dmsCount = automation.dm_messages?.length || (automation.dm_message ? 1 : 0)

            return (
              <motion.div key={automation.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all hover:border-white/20 ${automation.is_active ? 'border-cyan-500/30' : 'border-white/10'}`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                  {/* Left: Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${automation.is_active ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}>
                      <Zap size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-white font-bold text-lg">{automation.name}</span>
                        {automation.connected_accounts && (
                          <span className="text-gray-400 text-sm">
                            {automation.connected_accounts.account_type === 'instagram' ? '📸' : '📘'} {automation.connected_accounts.account_name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-gray-500 text-xs">{t.keywords}:</span>
                        {keywords.map((kw, ki) => (
                          <span key={ki} className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full text-xs font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500">
                        {repliesCount > 0 && <span className="flex items-center gap-1">💬 {repliesCount} {t.replies}</span>}
                        {dmsCount > 0 && <span className="flex items-center gap-1">✉️ {dmsCount} {t.dms}</span>}
                        <span className="flex items-center gap-1">
                          🔗 {automation.post_url ? automation.post_url.slice(0, 30) + '...' : t.any}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      automation.is_active
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}>
                      {automation.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {automation.is_active ? t.active : t.inactive}
                    </span>

                    <button
                      onClick={() => toggleStatus(automation.id, automation.is_active)}
                      className={`p-2 rounded-lg transition-colors ${automation.is_active ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                      title={automation.is_active ? t.stop : t.start}
                    >
                      {automation.is_active ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    <Link
                      href={`/dashboard/automations/${automation.id}/edit`}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title={t.edit}
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => deleteAutomation(automation.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </PageLayoutWith3D>
  )
}