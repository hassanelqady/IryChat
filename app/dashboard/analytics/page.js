'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { BarChart2, Zap, TrendingUp, MessageSquare, CheckCircle2, XCircle, Bot } from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [automations, setAutomations] = useState([])
  const [logs, setLogs] = useState([])
  const [period, setPeriod] = useState('week')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const t = {
    ar: {
      title: 'التحليلات', desc: 'تتبع أداء أتمتاتك.',
      totalReplies: 'إجمالي الردود', activeAutomations: 'أتمتات نشطة',
      successRate: 'معدل النجاح', topAutomation: 'أفضل أتمتة',
      noData: 'لا توجد بيانات بعد', noDataDesc: 'أنشئ أتمتات وابدأ في الحصول على ردود.',
      week: 'آخر 7 أيام', month: 'آخر 30 يوم',
      automationPerf: 'أداء الأتمتات', name: 'الاسم', keywords: 'الكلمات المفتاحية',
      replies: 'الردود', status: 'الحالة', active: 'نشط', inactive: 'غير نشط',
      commentReply: 'رد تعليق', dmSent: 'DM أُرسل', failed: 'فشل',
      loading: 'جاري التحميل...', recentActivity: 'النشاط الأخير', noActivity: 'لا يوجد نشاط بعد.',
    },
    en: {
      title: 'Analytics', desc: 'Track performance of your automations.',
      totalReplies: 'Total Replies', activeAutomations: 'Active Automations',
      successRate: 'Success Rate', topAutomation: 'Top Automation',
      noData: 'No data yet', noDataDesc: 'Create automations and start getting replies to see analytics here.',
      week: 'Last 7 days', month: 'Last 30 days',
      automationPerf: 'Automation Performance', name: 'Name', keywords: 'Keywords',
      replies: 'Replies', status: 'Status', active: 'Active', inactive: 'Inactive',
      commentReply: 'Comment Reply', dmSent: 'DM Sent', failed: 'Failed',
      loading: 'Loading...', recentActivity: 'Recent Activity', noActivity: 'No activity yet.',
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: automationsData } = await supabase.from('automations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      const list = automationsData || []
      setAutomations(list)
      if (list.length > 0) {
        const ids = list.map(a => a.id)
        const dateFilter = period === 'week'
          ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const { data: logsData } = await supabase.from('automation_logs').select('*').in('automation_id', ids).gte('created_at', dateFilter).order('created_at', { ascending: false })
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
  const logsByAutomation = logs.reduce((acc, log) => { acc[log.automation_id] = (acc[log.automation_id] || 0) + 1; return acc }, {})
  const topAutomationId = Object.entries(logsByAutomation).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topAutomation = automations.find(a => a.id === topAutomationId)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <BarChart2 className="w-4 h-4 animate-pulse" style={{ color: 'var(--db-primary)' }} />
        {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg p-1 border"
              style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)' }}>
              {['week', 'month'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: period === p ? 'var(--db-active-bg)' : 'transparent',
                    color: period === p ? 'var(--db-text-h)' : 'var(--db-text-2)',
                  }}>
                  {p === 'week' ? t.week : t.month}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {automations.length === 0 ? (
          <div className="rounded-2xl p-16 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Bot size={24} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.noData}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--db-text-3)' }}>{t.noDataDesc}</p>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Zap size={15} /> {lang === 'ar' ? 'إنشاء أتمتة' : 'Create Automation'}
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { icon: MessageSquare, value: totalLogs,   label: t.totalReplies,      color: 'var(--db-primary)', bg: 'var(--db-primary-bg)' },
                { icon: Zap,           value: activeCount, label: t.activeAutomations, color: '#16A34A',           bg: '#F0FDF4' },
                { icon: TrendingUp,    value: `${successRate}%`, label: t.successRate, color: successRate >= 80 ? '#16A34A' : successRate >= 50 ? '#D97706' : '#DC2626', bg: 'var(--db-icon-bg)' },
                { icon: BarChart2,     value: topAutomation ? topAutomation.name.slice(0, 12) + (topAutomation.name.length > 12 ? '…' : '') : '—', label: t.topAutomation, color: '#9333EA', bg: '#F5F3FF' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-5 text-center"
                  style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
                  <div className="inline-flex p-2.5 rounded-xl mb-3" style={{ backgroundColor: s.bg }}>
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden mb-4"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{t.automationPerf}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--db-border)' }}>
                      {[t.name, t.keywords, t.replies, t.status].map(h => (
                        <th key={h} className="px-6 py-3 text-xs font-medium text-start" style={{ color: 'var(--db-text-3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {automations.map((automation) => {
                      const keywords = automation.trigger_keywords?.length > 0
                        ? automation.trigger_keywords
                        : automation.trigger_keyword ? [automation.trigger_keyword] : []
                      const count = logsByAutomation[automation.id] || 0
                      return (
                        <tr key={automation.id} className="border-b transition-colors"
                          style={{ borderColor: 'var(--db-border)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td className="px-6 py-3 text-sm font-medium" style={{ color: 'var(--db-text-h)' }}>{automation.name}</td>
                          <td className="px-6 py-3">
                            <div className="flex flex-wrap gap-1">
                              {keywords.slice(0, 3).map((kw, ki) => (
                                <span key={ki} className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ color: 'var(--db-primary)', backgroundColor: 'var(--db-primary-bg)' }}>{kw}</span>
                              ))}
                              {keywords.length > 3 && <span className="text-xs" style={{ color: 'var(--db-text-3)' }}>+{keywords.length - 3}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm font-bold" style={{ color: 'var(--db-text-h)' }}>{count}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              automation.is_active
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-[#27272a] border-gray-200 dark:border-[#3f3f46] text-gray-500'
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
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{t.recentActivity}</h2>
              </div>
              {logs.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: 'var(--db-text-3)' }}>{t.noActivity}</p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {logs.slice(0, 20).map((log, i) => {
                    const automation = automations.find(a => a.id === log.automation_id)
                    const isSuccess = log.action_taken && log.action_taken !== 'failed'
                    return (
                      <div key={log.id || i} className="flex items-center gap-3 px-6 py-3 border-b transition-colors"
                        style={{ borderColor: 'var(--db-border)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--db-text-h)' }}>{automation?.name || '—'}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--db-text-3)' }}>{log.comment_text || log.commenter_name || '—'}</p>
                        </div>
                        <div className="text-end flex-shrink-0">
                          <span className={`text-xs font-medium ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {log.action_taken?.includes('comment') ? t.commentReply : log.action_taken?.includes('dm') ? t.dmSent : t.failed}
                          </span>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--db-text-3)' }}>
                            {new Date(log.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
