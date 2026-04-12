'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { BarChart2, Zap, Grid, TrendingUp, MessageSquare, CheckCircle2, XCircle, Bot, ArrowLeft, ArrowRight } from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [automations, setAutomations] = useState([])
  const [logs, setLogs] = useState([])
  const [period, setPeriod] = useState('week')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      title: "Analytics",
      desc: "Track performance of your automations.",
      totalReplies: "Total Replies",
      totalOps: "Total operations",
      activeAutomations: "Active Automations",
      successRate: "Success Rate",
      topAutomation: "Top Automation",
      noData: "No data yet",
      noDataDesc: "Create automations and start getting replies to see analytics here.",
      week: "Last 7 days",
      month: "Last 30 days",
      automationPerf: "Automation Performance",
      name: "Name",
      keywords: "Keywords",
      replies: "Replies",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      commentReply: "Comment Reply",
      dmSent: "DM Sent",
      failed: "Failed",
      dashboard: "Dashboard",
      flows: "Automations",
      loading: "Loading...",
      recentActivity: "Recent Activity",
      noActivity: "No activity yet.",
      operations: "operations",
      back: "Back",
    },
    ar: {
      title: "التحليلات",
      desc: "تتبع أداء أتمتاتك ومعدلات الردود.",
      totalReplies: "إجمالي الردود",
      totalOps: "إجمالي العمليات",
      activeAutomations: "أتمتات نشطة",
      successRate: "معدل النجاح",
      topAutomation: "أفضل أتمتة",
      noData: "لا توجد بيانات بعد",
      noDataDesc: "أنشئ أتمتات وابدأ في الحصول على ردود لرؤية التحليلات هنا.",
      week: "آخر 7 أيام",
      month: "آخر 30 يوم",
      automationPerf: "أداء الأتمتات",
      name: "الاسم",
      keywords: "الكلمات المفتاحية",
      replies: "الردود",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      commentReply: "رد تعليق",
      dmSent: "DM أُرسل",
      failed: "فشل",
      dashboard: "لوحة التحكم",
      flows: "الأتمتات",
      loading: "جاري التحميل...",
      recentActivity: "النشاط الأخير",
      noActivity: "لا يوجد نشاط بعد.",
      operations: "عملية",
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

      const { data: automationsData } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const automationsList = automationsData || []
      setAutomations(automationsList)

      if (automationsList.length > 0) {
        const ids = automationsList.map(a => a.id)
        const dateFilter = period === 'week'
          ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        const { data: logsData } = await supabase
          .from('automation_logs')
          .select('*')
          .in('automation_id', ids)
          .gte('created_at', dateFilter)
          .order('created_at', { ascending: false })

        setLogs(logsData || [])
      }

      setLoading(false)
    }
    init()
  }, [period])

  const totalLogs = logs.length
  const successLogs = logs.filter(l => l.action_taken && l.action_taken !== 'failed').length
  const successRate = totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0
  const activeCount = automations.filter(a => a.is_active).length

  const logsByAutomation = logs.reduce((acc, log) => {
    acc[log.automation_id] = (acc[log.automation_id] || 0) + 1
    return acc
  }, {})
  const topAutomationId = Object.entries(logsByAutomation).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topAutomation = automations.find(a => a.id === topAutomationId)

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <BarChart2 className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
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
            <Link href="/dashboard/flows" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
              <Grid size={18} /> {t.flows}
            </Link>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {['week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${period === p ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {p === 'week' ? t.week : t.month}
            </button>
          ))}
        </div>

        {/* No automations state */}
        {automations.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-400 mb-6">
              <Bot size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.noData}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">{t.noDataDesc}</p>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all">
              <Zap size={20} />
              {lang === 'ar' ? 'إنشاء أتمتة' : 'Create Automation'}
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3">
                  <MessageSquare size={22} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalLogs}</div>
                <div className="text-gray-400 text-sm">{t.totalReplies}</div>
                <div className="text-gray-600 text-xs mt-1">{t.totalOps}</div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-green-500/10 text-green-400 mb-3">
                  <Zap size={22} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{activeCount}</div>
                <div className="text-gray-400 text-sm">{t.activeAutomations}</div>
                <div className="text-gray-600 text-xs mt-1">{lang === 'ar' ? `من ${automations.length}` : `of ${automations.length}`}</div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-purple-500/10 text-purple-400 mb-3">
                  <TrendingUp size={22} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${successRate >= 80 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {successRate}%
                </div>
                <div className="text-gray-400 text-sm">{t.successRate}</div>
                <div className="text-gray-600 text-xs mt-1">{successLogs}/{totalLogs}</div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-orange-500/10 text-orange-400 mb-3">
                  <BarChart2 size={22} />
                </div>
                <div className="text-lg font-bold text-white mb-1 truncate px-2">
                  {topAutomation ? topAutomation.name : '—'}
                </div>
                <div className="text-gray-400 text-sm">{t.topAutomation}</div>
                {topAutomation && (
                  <div className="text-gray-600 text-xs mt-1">{logsByAutomation[topAutomation.id]} {t.operations}</div>
                )}
              </motion.div>
            </motion.div>

            {/* Automation Performance Table */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-6">{t.automationPerf}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-3 text-gray-400 text-sm font-medium">{t.name}</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">{t.keywords}</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium text-center">{t.replies}</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium text-center">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {automations.map((automation, i) => {
                      const keywords = automation.trigger_keywords?.length > 0
                        ? automation.trigger_keywords
                        : automation.trigger_keyword ? [automation.trigger_keyword] : []
                      const count = logsByAutomation[automation.id] || 0

                      return (
                        <tr key={automation.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 text-white font-medium">{automation.name}</td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {keywords.slice(0, 3).map((kw, ki) => (
                                <span key={ki} className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full text-xs font-mono">
                                  {kw}
                                </span>
                              ))}
                              {keywords.length > 3 && (
                                <span className="text-gray-500 text-xs">+{keywords.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-white font-bold">{count}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                              automation.is_active
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-white/5 border-white/10 text-gray-500'
                            }`}>
                              {automation.is_active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                              {automation.is_active ? t.active : t.inactive}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">{t.recentActivity}</h2>
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">{t.noActivity}</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {logs.slice(0, 20).map((log, i) => {
                    const automation = automations.find(a => a.id === log.automation_id)
                    const isSuccess = log.action_taken && log.action_taken !== 'failed'
                    return (
                      <div key={log.id || i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSuccess ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{automation?.name || '—'}</p>
                          <p className="text-gray-500 text-xs truncate">{log.comment_text || log.commenter_name || '—'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-medium ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                            {log.action_taken?.includes('comment') ? t.commentReply :
                             log.action_taken?.includes('dm') ? t.dmSent : t.failed}
                          </span>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {new Date(log.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </>
  )
}