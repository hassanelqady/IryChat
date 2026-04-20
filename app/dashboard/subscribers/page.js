'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Users, Search, Tag, X, Clock, TrendingUp,
  UserX, RefreshCw, Download, Instagram, Facebook, Zap, Plus
} from 'lucide-react'
import Link from 'next/link'

function timeAgo(date, lang) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return lang === 'ar' ? 'الآن' : 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return lang === 'ar' ? `${minutes}د` : `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return lang === 'ar' ? `${hours}س` : `${hours}h`
  return lang === 'ar' ? `${Math.floor(hours/24)}ي` : `${Math.floor(hours/24)}d`
}

function TagBadge({ tag, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)', color: 'var(--db-primary)' }}>
      {tag}
      {onRemove && (
        <button onClick={() => onRemove(tag)} className="hover:opacity-60 transition-opacity">
          <X size={9} />
        </button>
      )}
    </span>
  )
}

function SubscriberRow({ sub, lang, t, onAddTag, onBlock }) {
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (!tag) return
    onAddTag(sub.id, tag, sub.tags || [])
    setTagInput(''); setShowTagInput(false)
  }

  const initials = (sub.name || sub.platform_user_id || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`flex items-center gap-4 px-5 py-4 border-b transition-colors group ${sub.is_blocked ? 'opacity-50' : ''}`}
      style={{ borderColor: 'var(--db-border)' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: 'var(--db-icon-bg)', color: 'var(--db-text-2)' }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--db-text-h)' }}>
            {sub.name || t.unknown}
          </span>
          {sub.username && <span className="text-xs" style={{ color: 'var(--db-text-3)' }}>@{sub.username}</span>}
          {sub.is_blocked && (
            <span className="text-[10px] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
              {t.blocked_label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sub.account?.account_type === 'instagram'
            ? <Instagram size={10} className="text-pink-500" />
            : <Facebook size={10} className="text-blue-500" />
          }
          <span className="text-xs truncate" style={{ color: 'var(--db-text-3)' }}>{sub.account?.account_name || '—'}</span>
          <span style={{ color: 'var(--db-border-2)' }}>·</span>
          <Clock size={10} style={{ color: 'var(--db-text-3)' }} />
          <span className="text-xs" style={{ color: 'var(--db-text-3)' }}>{timeAgo(sub.last_interaction, lang)}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1.5 flex-wrap max-w-[200px]">
        {(sub.tags || []).slice(0, 2).map(tag => (
          <TagBadge key={tag} tag={tag} onRemove={tag => onAddTag(sub.id, null, (sub.tags || []).filter(t => t !== tag), true)} />
        ))}
        {(sub.tags || []).length > 2 && <span className="text-xs" style={{ color: 'var(--db-text-3)' }}>+{sub.tags.length - 2}</span>}
        <button onClick={() => setShowTagInput(!showTagInput)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed transition-all"
          style={{ borderColor: 'var(--db-border-2)', color: 'var(--db-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--db-primary)'; e.currentTarget.style.color = 'var(--db-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--db-border-2)'; e.currentTarget.style.color = 'var(--db-text-3)' }}>
          <Tag size={9} /> {t.addTag}
        </button>
        {showTagInput && (
          <div className="flex gap-1 w-full mt-1">
            <input autoFocus value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTag()}
              placeholder={t.tagPlaceholder}
              className="flex-1 px-2 py-1 border rounded-lg text-xs focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            <button onClick={handleAddTag}
              className="px-2 py-1 text-white rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              {t.add}
            </button>
          </div>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs flex-shrink-0" style={{ color: 'var(--db-text-3)' }}>
        <Zap size={10} /> {sub.total_interactions}
      </div>
      <button onClick={() => onBlock(sub.id, sub.is_blocked)}
        className="p-1.5 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
        style={{ color: 'var(--db-text-3)' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEF2F2' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--db-text-3)'; e.currentTarget.style.backgroundColor = 'transparent' }}>
        <UserX size={14} />
      </button>
    </div>
  )
}

export default function SubscribersPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const [subscribers, setSubscribers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [allTags, setAllTags] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0, thisWeek: 0 })

  const t = {
    ar: {
      title: 'المشتركون', desc: 'كل من تفاعل مع أتمتاتك',
      search: 'ابحث بالاسم أو المعرف...', allPlatforms: 'كل المنصات', allTags: 'كل التاجات',
      total: 'إجمالي', active: 'نشطون', blocked: 'محجوبون', thisWeek: 'هذا الأسبوع',
      addTag: '+ تاج', tagPlaceholder: 'اسم التاج...', add: 'إضافة', unknown: 'مستخدم مجهول',
      empty: 'لا يوجد مشتركون بعد', emptyDesc: 'عندما يتفاعل الناس مع أتمتاتك، سيظهرون هنا.',
      emptyFilter: 'لا توجد نتائج', emptyFilterDesc: 'جرب تغيير فلتر البحث.',
      loading: 'جاري التحميل...', export: 'تصدير', refresh: 'تحديث', blocked_label: 'محجوب', showing: 'عرض',
    },
    en: {
      title: 'Subscribers', desc: 'Everyone who interacted with your automations',
      search: 'Search by name or ID...', allPlatforms: 'All Platforms', allTags: 'All Tags',
      total: 'Total', active: 'Active', blocked: 'Blocked', thisWeek: 'This Week',
      addTag: '+ Tag', tagPlaceholder: 'Tag name...', add: 'Add', unknown: 'Unknown User',
      empty: 'No subscribers yet', emptyDesc: 'When people interact with your automations, they will appear here.',
      emptyFilter: 'No results found', emptyFilterDesc: 'Try changing your search or filter.',
      loading: 'Loading...', export: 'Export', refresh: 'Refresh', blocked_label: 'Blocked', showing: 'Showing',
    },
  }[lang]

  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('subscribers').select('*, account:connected_accounts(account_name, account_type)').eq('user_id', user.id).order('last_interaction', { ascending: false })
    const subs = data || []
    setSubscribers(subs)
    setAllTags([...new Set(subs.flatMap(s => s.tags || []))])
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    setStats({ total: subs.length, active: subs.filter(s => !s.is_blocked).length, blocked: subs.filter(s => s.is_blocked).length, thisWeek: subs.filter(s => new Date(s.subscribed_at) > weekAgo).length })
    setLoading(false)
  }, [router])

  useEffect(() => { loadSubscribers() }, [loadSubscribers])

  useEffect(() => {
    let result = [...subscribers]
    if (search) { const q = search.toLowerCase(); result = result.filter(s => (s.name || '').toLowerCase().includes(q) || (s.username || '').toLowerCase().includes(q) || (s.platform_user_id || '').toLowerCase().includes(q)) }
    if (filterPlatform !== 'all') result = result.filter(s => s.account?.account_type === filterPlatform)
    if (filterTag) result = result.filter(s => (s.tags || []).includes(filterTag))
    setFiltered(result)
  }, [subscribers, search, filterPlatform, filterTag])

  const handleAddTag = async (subId, newTag, currentTags, replace = false) => {
    const supabase = createClient()
    const newTags = replace ? currentTags : [...new Set([...currentTags, newTag])]
    await supabase.from('subscribers').update({ tags: newTags }).eq('id', subId)
    setSubscribers(prev => prev.map(s => s.id === subId ? { ...s, tags: newTags } : s))
    setAllTags(prev => [...new Set([...prev, ...newTags])])
  }

  const handleBlock = async (subId, currentStatus) => {
    const supabase = createClient()
    await supabase.from('subscribers').update({ is_blocked: !currentStatus }).eq('id', subId)
    setSubscribers(prev => prev.map(s => s.id === subId ? { ...s, is_blocked: !currentStatus } : s))
  }

  const exportCSV = () => {
    const rows = [['Name', 'Username', 'Platform', 'Tags', 'Interactions', 'Subscribed At'], ...filtered.map(s => [s.name || '', s.username || '', s.account?.account_type || '', (s.tags || []).join(';'), s.total_interactions, new Date(s.subscribed_at).toLocaleDateString()])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <Users className="w-4 h-4 animate-pulse" style={{ color: 'var(--db-primary)' }} /> {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadSubscribers} className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--db-text-2)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <RefreshCw size={15} />
              </button>
              <button onClick={exportCSV} disabled={filtered.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-40 border"
                style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Download size={14} /> {t.export}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: t.total,    value: stats.total,    icon: Users,     color: 'var(--db-primary)', bg: 'var(--db-primary-bg)' },
            { label: t.active,   value: stats.active,   icon: TrendingUp, color: '#16A34A',          bg: '#F0FDF4' },
            { label: t.thisWeek, value: stats.thisWeek, icon: Zap,       color: '#9333EA',           bg: '#F5F3FF' },
            { label: t.blocked,  value: stats.blocked,  icon: UserX,     color: '#DC2626',           bg: '#FEF2F2' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: s.bg }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} style={{ color: 'var(--db-text-3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search}
              className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border rounded-lg text-sm focus:outline-none transition-colors`}
              style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          {[
            { value: filterPlatform, onChange: setFilterPlatform, options: [{ value: 'all', label: t.allPlatforms }, { value: 'instagram', label: 'Instagram' }, { value: 'facebook_page', label: 'Facebook' }] },
          ].map((sel, i) => (
            <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }}>
              {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          {allTags.length > 0 && (
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }}>
              <option value="">{t.allTags}</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          )}
        </div>

        {subscribers.length > 0 && (
          <p className="text-xs mb-3" style={{ color: 'var(--db-text-3)' }}>{t.showing} {filtered.length} / {subscribers.length}</p>
        )}

        {subscribers.length === 0 && (
          <div className="rounded-2xl p-16 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Users size={24} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.empty}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--db-text-3)' }}>{t.emptyDesc}</p>
            <Link href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={15} /> {lang === 'ar' ? 'إنشاء أتمتة' : 'Create Automation'}
            </Link>
          </div>
        )}

        {subscribers.length > 0 && filtered.length === 0 && (
          <div className="rounded-2xl p-12 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.emptyFilter}</p>
            <p className="text-sm" style={{ color: 'var(--db-text-3)' }}>{t.emptyFilterDesc}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            {filtered.map(sub => (
              <SubscriberRow key={sub.id} sub={sub} lang={lang} t={t} onAddTag={handleAddTag} onBlock={handleBlock} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
