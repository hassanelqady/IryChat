'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Users, Search, Tag, X, ArrowLeft, ArrowRight,
  MessageSquare, Clock, TrendingUp, Filter,
  ChevronDown, UserX, RefreshCw, Download,
  Instagram, Facebook, Zap
} from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────
const PLATFORM_COLORS = {
  instagram: 'from-purple-600 via-pink-500 to-orange-400',
  facebook_page: 'from-blue-600 to-blue-400',
}

const TAG_COLORS = [
  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'bg-green-500/10 border-green-500/20 text-green-400',
  'bg-orange-500/10 border-orange-500/20 text-orange-400',
  'bg-pink-500/10 border-pink-500/20 text-pink-400',
]

function timeAgo(date, lang) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return lang === 'ar' ? 'الآن' : 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return lang === 'ar' ? `${minutes} د` : `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return lang === 'ar' ? `${hours} س` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  return lang === 'ar' ? `${days} ي` : `${days}d ago`
}

// ─── Tag Badge ─────────────────────────────────────────────
function TagBadge({ tag, index, onRemove }) {
  const color = TAG_COLORS[index % TAG_COLORS.length]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {tag}
      {onRemove && (
        <button onClick={() => onRemove(tag)} className="hover:opacity-60 transition-opacity">
          <X size={10} />
        </button>
      )}
    </span>
  )
}

// ─── Subscriber Card ───────────────────────────────────────
function SubscriberCard({ sub, lang, t, onAddTag, onBlock, index }) {
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const isRTL = lang === 'ar'

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (!tag) return
    onAddTag(sub.id, tag, sub.tags || [])
    setTagInput('')
    setShowTagInput(false)
  }

  const handleRemoveTag = (tag) => {
    const newTags = (sub.tags || []).filter(t => t !== tag)
    onAddTag(sub.id, null, newTags, true)
  }

  const initials = (sub.name || sub.platform_user_id || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const gradientClass = sub.account?.account_type
    ? PLATFORM_COLORS[sub.account.account_type] || 'from-gray-600 to-gray-400'
    : 'from-cyan-600 to-blue-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all ${sub.is_blocked ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white font-semibold text-sm truncate">
              {sub.name || t.unknown}
            </span>
            {sub.username && (
              <span className="text-gray-500 text-xs">@{sub.username}</span>
            )}
            {sub.is_blocked && (
              <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                {t.blocked}
              </span>
            )}
          </div>

          {/* Platform */}
          <div className="flex items-center gap-1.5 mb-3">
            {sub.account?.account_type === 'instagram'
              ? <Instagram size={11} className="text-pink-400" />
              : <Facebook size={11} className="text-blue-400" />
            }
            <span className="text-gray-500 text-xs truncate">
              {sub.account?.account_name || '—'}
            </span>
            <span className="text-gray-700 text-xs">·</span>
            <Clock size={11} className="text-gray-600" />
            <span className="text-gray-500 text-xs">{timeAgo(sub.last_interaction, lang)}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(sub.tags || []).map((tag, i) => (
              <TagBadge key={tag} tag={tag} index={i} onRemove={handleRemoveTag} />
            ))}
            <button
              onClick={() => setShowTagInput(!showTagInput)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed border-white/20 text-gray-500 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              <Tag size={10} />
              {t.addTag}
            </button>
          </div>

          {/* Tag Input */}
          <AnimatePresence>
            {showTagInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-2"
              >
                <input
                  autoFocus
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                  placeholder={t.tagPlaceholder}
                  className="flex-1 px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition-colors"
                >
                  {t.add}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Zap size={10} className="text-cyan-600" />
              {sub.total_interactions} {t.interactions}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {new Date(sub.subscribed_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
          </div>
        </div>

        {/* Block button */}
        <button
          onClick={() => onBlock(sub.id, sub.is_blocked)}
          title={sub.is_blocked ? t.unblock : t.block}
          className="p-2 rounded-lg bg-white/5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
        >
          <UserX size={15} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
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
  const [showFilters, setShowFilters] = useState(false)

  const content = {
    ar: {
      title: 'المشتركون',
      desc: 'كل من تفاعل مع أتمتاتك',
      search: 'ابحث بالاسم أو المعرف...',
      allPlatforms: 'كل المنصات',
      instagram: 'Instagram',
      facebook: 'Facebook',
      allTags: 'كل التاجات',
      total: 'إجمالي',
      active: 'نشطون',
      blocked: 'محجوبون',
      thisWeek: 'هذا الأسبوع',
      addTag: '+ تاج',
      tagPlaceholder: 'اسم التاج...',
      add: 'إضافة',
      block: 'حجب',
      unblock: 'إلغاء الحجب',
      interactions: 'تفاعل',
      unknown: 'مستخدم مجهول',
      empty: 'لا يوجد مشتركون بعد',
      emptyDesc: 'عندما يتفاعل الناس مع أتمتاتك، سيظهرون هنا تلقائياً.',
      emptyFilter: 'لا توجد نتائج مطابقة',
      emptyFilterDesc: 'جرب تغيير فلتر البحث أو التاج.',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      filters: 'فلاتر',
      export: 'تصدير',
      refresh: 'تحديث',
      blocked_label: 'محجوب',
    },
    en: {
      title: 'Subscribers',
      desc: 'Everyone who interacted with your automations',
      search: 'Search by name or ID...',
      allPlatforms: 'All Platforms',
      instagram: 'Instagram',
      facebook: 'Facebook',
      allTags: 'All Tags',
      total: 'Total',
      active: 'Active',
      blocked: 'Blocked',
      thisWeek: 'This Week',
      addTag: '+ Tag',
      tagPlaceholder: 'Tag name...',
      add: 'Add',
      block: 'Block',
      unblock: 'Unblock',
      interactions: 'interactions',
      unknown: 'Unknown User',
      empty: 'No subscribers yet',
      emptyDesc: 'When people interact with your automations, they will appear here automatically.',
      emptyFilter: 'No matching results',
      emptyFilterDesc: 'Try changing your search or filter.',
      back: 'Back',
      loading: 'Loading...',
      filters: 'Filters',
      export: 'Export',
      refresh: 'Refresh',
      blocked_label: 'Blocked',
    }
  }

  const t = content[lang]

  // ── Load data
  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data } = await supabase
      .from('subscribers')
      .select('*, account:connected_accounts(account_name, account_type)')
      .eq('user_id', user.id)
      .order('last_interaction', { ascending: false })

    const subs = data || []
    setSubscribers(subs)

    // Collect all unique tags
    const tags = [...new Set(subs.flatMap(s => s.tags || []))]
    setAllTags(tags)

    // Stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    setStats({
      total: subs.length,
      active: subs.filter(s => !s.is_blocked).length,
      blocked: subs.filter(s => s.is_blocked).length,
      thisWeek: subs.filter(s => new Date(s.subscribed_at) > weekAgo).length,
    })

    setLoading(false)
  }, [router])

  useEffect(() => { loadSubscribers() }, [loadSubscribers])

  // ── Filter
  useEffect(() => {
    let result = [...subscribers]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.username || '').toLowerCase().includes(q) ||
        (s.platform_user_id || '').toLowerCase().includes(q)
      )
    }
    if (filterPlatform !== 'all') {
      result = result.filter(s => s.account?.account_type === filterPlatform)
    }
    if (filterTag) {
      result = result.filter(s => (s.tags || []).includes(filterTag))
    }
    setFiltered(result)
  }, [subscribers, search, filterPlatform, filterTag])

  // ── Add / update tag
  const handleAddTag = async (subId, newTag, currentTags, replace = false) => {
    const supabase = createClient()
    const newTags = replace ? currentTags : [...new Set([...currentTags, newTag])]
    await supabase.from('subscribers').update({ tags: newTags }).eq('id', subId)
    setSubscribers(prev => prev.map(s => s.id === subId ? { ...s, tags: newTags } : s))
    // Update allTags
    setAllTags(prev => [...new Set([...prev, ...newTags])])
  }

  // ── Block / unblock
  const handleBlock = async (subId, currentStatus) => {
    const supabase = createClient()
    await supabase.from('subscribers').update({ is_blocked: !currentStatus }).eq('id', subId)
    setSubscribers(prev => prev.map(s => s.id === subId ? { ...s, is_blocked: !currentStatus } : s))
  }

  // ── Export CSV
  const exportCSV = () => {
    const rows = [
      ['Name', 'Username', 'Platform', 'Tags', 'Interactions', 'Subscribed At'],
      ...filtered.map(s => [
        s.name || '',
        s.username || '',
        s.account?.account_type || '',
        (s.tags || []).join(';'),
        s.total_interactions,
        new Date(s.subscribed_at).toLocaleDateString(),
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Users className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{t.title}</h1>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {t.back}
            </Link>
            <button
              onClick={loadSubscribers}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title={t.refresh}
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white text-sm transition-all disabled:opacity-30"
            >
              <Download size={16} />
              {t.export}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: t.total, value: stats.total, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: t.active, value: stats.active, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: t.thisWeek, value: stats.thisWeek, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: t.blocked, value: stats.blocked, icon: UserX, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`p-2 rounded-xl ${stat.bg} flex-shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full ps-9 pe-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Platform filter */}
          <select
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">{t.allPlatforms}</option>
            <option value="instagram">{t.instagram}</option>
            <option value="facebook_page">{t.facebook}</option>
          </select>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">{t.allTags}</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
        </div>

        {/* Active filters chips */}
        {(filterTag || filterPlatform !== 'all' || search) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="flex items-center gap-1 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs">
                🔍 {search}
                <button onClick={() => setSearch('')}><X size={10} /></button>
              </span>
            )}
            {filterPlatform !== 'all' && (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs">
                {filterPlatform === 'instagram' ? '📸' : '📘'} {filterPlatform}
                <button onClick={() => setFilterPlatform('all')}><X size={10} /></button>
              </span>
            )}
            {filterTag && (
              <span className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs">
                🏷️ {filterTag}
                <button onClick={() => setFilterTag('')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Count */}
        {subscribers.length > 0 && (
          <div className="text-gray-500 text-xs mb-4">
            {lang === 'ar'
              ? `عرض ${filtered.length} من ${subscribers.length}`
              : `Showing ${filtered.length} of ${subscribers.length}`
            }
          </div>
        )}

        {/* Empty state — no subscribers at all */}
        {subscribers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-500 mb-6">
              <Users size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.empty}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">{t.emptyDesc}</p>
            <Link
              href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all"
            >
              <Zap size={18} />
              {lang === 'ar' ? 'إنشاء أتمتة' : 'Create Automation'}
            </Link>
          </motion.div>
        )}

        {/* Empty state — no results for filter */}
        {subscribers.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">{t.emptyFilter}</h3>
            <p className="text-gray-400 text-sm">{t.emptyFilterDesc}</p>
          </motion.div>
        )}

        {/* Subscribers Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((sub, i) => (
              <SubscriberCard
                key={sub.id}
                sub={sub}
                lang={lang}
                t={t}
                onAddTag={handleAddTag}
                onBlock={handleBlock}
                index={i}
              />
            ))}
          </div>
        )}

      </main>
  )
}