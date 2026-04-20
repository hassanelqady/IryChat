'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Plus, Play, Pause, MoreHorizontal, Search, Zap, LayoutTemplate, ChevronRight
} from 'lucide-react'

interface Flow {
  id: string
  name: string
  is_active: boolean
  is_template: boolean
  trigger_config: any
  actions: any[]
  stats: { triggers: number; success: number }
  connected_accounts?: { account_name: string; account_type: string }
  created_at: string
}

export default function FlowsPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [flows, setFlows] = useState<Flow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  const t = {
    en: {
      title: 'Automations', subtitle: 'Manage and monitor your automated workflows',
      newAutomation: 'New Automation', all: 'All', active: 'Active', inactive: 'Inactive',
      search: 'Search automations...', triggers: 'triggers', success: 'successful',
      loading: 'Loading...', empty: 'No automations yet', emptyDesc: 'Create your first automation to get started',
    },
    ar: {
      title: 'الأتمتات', subtitle: 'إدارة ومراقبة سير العمل الآلي',
      newAutomation: 'أتمتة جديدة', all: 'الكل', active: 'نشط', inactive: 'غير نشط',
      search: 'البحث في الأتمتات...', triggers: 'تشغيل', success: 'ناجح',
      loading: 'جاري التحميل...', empty: 'لا توجد أتمتات', emptyDesc: 'أنشئ أتمتتك الأولى للبدء',
    }
  }[lang]

  const isRTL = lang === 'ar'

  useEffect(() => {
    const fetchFlows = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) { router.push('/login'); return }

      let query = supabase
        .from('automation_flows')
        .select('*, connected_accounts(account_name, account_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filter === 'active') query = query.eq('is_active', true)
      if (filter === 'inactive') query = query.eq('is_active', false)

      const { data: flowsData } = await query
      setFlows((flowsData as Flow[]) || [])
      setLoading(false)
    }
    fetchFlows()
  }, [filter])

  const toggleStatus = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('automation_flows').update({ is_active: !current }).eq('id', id)
    setFlows(prev => prev.map(f => f.id === id ? { ...f, is_active: !current } : f))
  }

  const filtered = flows.filter(f => !search || f.name?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <Zap className="w-4 h-4 animate-pulse" style={{ color: 'var(--db-primary)' }} /> {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--db-text-2)' }}>{t.subtitle}</p>
            </div>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--db-primary-h)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--db-primary)'}>
              <Plus size={18} /> {t.newAutomation}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Filters & Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 rounded-lg border p-1"
            style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)' }}>
            {(['all', 'active', 'inactive'] as const).map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: filter === tab ? 'var(--db-active-bg)' : 'transparent',
                  color: filter === tab ? 'var(--db-text-h)' : 'var(--db-text-2)',
                }}>
                {t[tab]}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`}
                size={18} style={{ color: 'var(--db-text-3)' }} />
              <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg text-sm focus:outline-none transition-colors`}
                style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            </div>
          </div>
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="rounded-xl p-12 text-center border" style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Zap size={32} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--db-text-h)' }}>{t.empty}</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--db-text-2)' }}>{t.emptyDesc}</p>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--db-primary)' }}>
              {t.newAutomation} <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            {filtered.map((flow) => (
              <div key={flow.id}
                className="p-6 border-b transition-colors"
                style={{ borderColor: 'var(--db-border)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: flow.is_template ? '#F5F3FF' : 'var(--db-primary-bg)',
                        color: flow.is_template ? '#9333EA' : 'var(--db-primary)',
                      }}>
                      {flow.is_template
                        ? <LayoutTemplate size={20} />
                        : <Zap size={20} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-medium" style={{ color: 'var(--db-text-h)' }}>{flow.name}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                          style={{
                            backgroundColor: flow.is_active ? '#F0FDF4' : 'var(--db-icon-bg)',
                            borderColor: flow.is_active ? '#BBF7D0' : 'var(--db-border)',
                            color: flow.is_active ? '#16A34A' : 'var(--db-text-3)',
                          }}>
                          {flow.is_active ? t.active : t.inactive}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--db-text-2)' }}>
                        {flow.connected_accounts?.account_name}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--db-text-3)' }}>
                        <span className="flex items-center gap-1">
                          <Zap size={14} /> {flow.stats?.triggers || 0} {t.triggers}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {flow.stats?.success || 0} {t.success}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(flow.id, flow.is_active)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: flow.is_active ? 'var(--db-text-3)' : '#16A34A' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      {flow.is_active ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--db-text-3)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
