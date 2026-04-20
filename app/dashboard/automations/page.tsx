'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Plus, Play, Pause, MoreHorizontal, Search, Zap,
  X, ChevronRight, MessageSquare, Users, Link2,
  Star, Sparkles, ArrowUpRight, ToggleLeft, Mail,
  Gift, Youtube, Bot, PenLine, TrendingUp
} from 'lucide-react'

const TEMPLATES = [
  { id: 'comment_dm_link', icon: '🔗', category: 'comment', goalAr: 'زيادة المتابعين', goalEn: 'Grow your followers', nameAr: 'روابط الرسائل من التعليقات', nameEn: 'Auto-DM links from comments', descAr: 'أرسل رابطاً تلقائياً لمن يعلق على منشورك', descEn: 'Send a link when people comment on a post or reel', popular: true, trigger: 'comment' },
  { id: 'welcome_followers', icon: '👋', category: 'dm', goalAr: 'التفاعل مع الجمهور', goalEn: 'Engage your audience', nameAr: 'الترحيب بالمتابعين الجدد', nameEn: 'Say hi to new followers', descAr: 'أرسل رسالة ترحيب لكل متابع جديد', descEn: 'Send new followers a one-time welcome message', popular: false, trigger: 'dm' },
  { id: 'story_leads', icon: '📖', category: 'story', goalAr: 'زيادة المبيعات', goalEn: 'Drive traffic', nameAr: 'جذب العملاء من القصص', nameEn: 'Generate leads with stories', descAr: 'استخدم عروض القصص لتحويل المتابعين لعملاء', descEn: 'Use limited-time offers in Stories to convert leads', popular: false, trigger: 'story' },
  { id: 'auto_dm_reply', icon: '💬', category: 'dm', goalAr: 'التفاعل مع الجمهور', goalEn: 'Engage your audience', nameAr: 'الرد على الرسائل الخاصة تلقائياً', nameEn: 'Respond to all your DMs', descAr: 'ردود تلقائية مخصصة على رسائلك الخاصة', descEn: 'Auto-send customized replies when people DM you', popular: false, trigger: 'dm' },
  { id: 'grow_followers_comment', icon: '📈', category: 'comment', goalAr: 'زيادة المتابعين', goalEn: 'Grow your followers', nameAr: 'زيادة المتابعين من التعليقات', nameEn: 'Grow followers from comments', descAr: 'حفّز المتابعة للحصول على مكافأة', descEn: 'Incentivize a follow to grow your account', popular: false, trigger: 'comment' },
  { id: 'affiliate_links', icon: '🛍️', category: 'comment', goalAr: 'زيادة المبيعات', goalEn: 'Drive traffic', nameAr: 'إرسال روابط منتجات التسويق بالعمولة', nameEn: 'Send affiliate product links', descAr: 'أرسل بطاقات المنتجات مع صور وروابط عمولتك', descEn: 'Include product card with photos and links of your affiliate collabs', popular: false, trigger: 'comment' },
  { id: 'ai_conversations', icon: '🤖', category: 'dm', goalAr: 'التفاعل مع الجمهور', goalEn: 'Engage your audience', nameAr: 'أتمتة المحادثات بالذكاء الاصطناعي', nameEn: 'Automate conversations with AI', descAr: 'دع الذكاء الاصطناعي يتحدث ويحوّل المتابعين', descEn: 'Let AI collect info, pitch your offer, and recommend what to buy', popular: false, trigger: 'dm' },
  { id: 'comment_to_dm', icon: '📨', category: 'comment', goalAr: 'التفاعل مع الجمهور', goalEn: 'Engage your audience', nameAr: 'الرد على التعليقات عبر الرسائل الخاصة', nameEn: 'Auto-reply to comment in DM', descAr: 'أرسل قائمة منتجات في رسائل انستجرام الخاصة', descEn: 'Send a product lineup in Instagram DMs', popular: false, trigger: 'comment' },
  { id: 'auto_send_links', icon: '🔀', category: 'dm', goalAr: 'زيادة المبيعات', goalEn: 'Drive traffic', nameAr: 'إرسال الروابط تلقائياً في الرسائل', nameEn: 'Auto-send links in DM', descAr: 'أرسل روابط تلقائياً لمتابعيك عبر الرسائل', descEn: 'Automate DMs to send followers to your website', popular: false, trigger: 'dm' },
  { id: 'follow_for_freebie', icon: '🎁', category: 'comment', goalAr: 'زيادة المتابعين', goalEn: 'Grow your followers', nameAr: 'تابعنا أولاً للحصول على هدية', nameEn: 'Follow first, then freebie', descAr: 'كافئ المتابعين الحقيقيين وليس المتفرجين', descEn: 'Wanna freebie? Gotta follow first. Reward the fans, not the lurkers.', popular: false, trigger: 'comment' },
  { id: 'collect_email', icon: '📧', category: 'dm', goalAr: 'زيادة المبيعات', goalEn: 'Drive traffic', nameAr: 'جمع البريد الإلكتروني', nameEn: 'Collect email addresses', descAr: 'اجمع بريد متابعيك تلقائياً عبر الرسائل', descEn: 'Automatically collect emails from your followers via DMs', popular: false, trigger: 'dm' },
  { id: 'run_giveaway', icon: '🏆', category: 'comment', goalAr: 'زيادة المتابعين', goalEn: 'Grow your followers', nameAr: 'إنشاء مسابقة', nameEn: 'Run a giveaway', descAr: 'نظّم مسابقة لزيادة متابعي انستجرام', descEn: 'Run a giveaway to grow Instagram followers', popular: false, trigger: 'comment' },
  { id: 'grow_youtube', icon: '▶️', category: 'dm', goalAr: 'زيادة المبيعات', goalEn: 'Drive traffic', nameAr: 'تنمية قناة YouTube عبر Instagram', nameEn: 'Grow your YouTube via Instagram', descAr: 'حوّل جمهور انستجرام لمشتركين في يوتيوب', descEn: 'Get YouTube subscribers via IG DMs.', popular: false, trigger: 'dm' },
]

const GOALS = {
  ar: ['الكل', 'زيادة المتابعين', 'التفاعل مع الجمهور', 'زيادة المبيعات'],
  en: ['All templates', 'Grow your followers', 'Engage your audience', 'Drive traffic'],
}

const TRIGGERS = {
  ar: ['تعليق على منشور', 'رسالة مباشرة', 'رد على ستوري'],
  en: ['Post or Reel comment', 'DM', 'Story reply'],
}

const TRIGGER_KEYS = ['comment', 'dm', 'story']

function TemplateCard({ tmpl, lang, onSelect, t }) {
  return (
    <button onClick={() => onSelect(tmpl)}
      className="group text-start p-4 rounded-xl border transition-all"
      style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--db-border-2)'; e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--db-border)'; e.currentTarget.style.backgroundColor = 'var(--db-bg)' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{tmpl.icon}</span>
        {tmpl.popular && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}>
            {t.popular}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--db-text-h)' }}>
        {lang === 'ar' ? tmpl.nameAr : tmpl.nameEn}
      </p>
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--db-text-2)' }}>
        {lang === 'ar' ? tmpl.descAr : tmpl.descEn}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--db-text-3)' }}>
        <Zap size={10} />
        <span>{lang === 'ar' ? 'أتمتة سريعة' : 'Quick Automation'}</span>
      </div>
    </button>
  )
}

function TemplatesModal({ onClose, onSelect, lang }) {
  const [search, setSearch] = useState('')
  const [activeGoal, setActiveGoal] = useState(0)
  const [activeTrigger, setActiveTrigger] = useState(null)

  const goals = GOALS[lang] || GOALS.en
  const triggers = TRIGGERS[lang] || TRIGGERS.en

  const filtered = TEMPLATES.filter(t => {
    const name = lang === 'ar' ? t.nameAr : t.nameEn
    const desc = lang === 'ar' ? t.descAr : t.descEn
    const goal = lang === 'ar' ? t.goalAr : t.goalEn
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
    const matchGoal = activeGoal === 0 || goal === goals[activeGoal]
    const matchTrigger = activeTrigger === null || t.trigger === TRIGGER_KEYS[activeTrigger]
    return matchSearch && matchGoal && matchTrigger
  })

  const t = {
    ar: { title: 'القوالب', search: 'ابحث في القوالب...', scratch: 'ابدأ من الصفر', byGoal: 'حسب الهدف', byTrigger: 'حسب المشغّل', recommended: 'موصى به', discover: 'اكتشف المزيد', popular: 'شائع', noResults: 'لا توجد نتائج' },
    en: { title: 'Templates', search: 'Search templates...', scratch: 'Start From Scratch', byGoal: 'By goal', byTrigger: 'By trigger', recommended: 'Recommended', discover: 'Discover more Templates', popular: 'POPULAR', noResults: 'No results found' },
  }[lang] || {}

  const recommended = filtered.filter(t => t.popular)
  const rest = filtered.filter(t => !t.popular)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--db-border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelect(null)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
              <Plus size={15} /> {t.scratch}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--db-text-2)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--db-border)' }}>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2" style={{ [lang === 'ar' ? 'right' : 'left']: 12, color: 'var(--db-text-3)' }} size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search}
              className={`w-full ${lang === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border rounded-lg text-sm focus:outline-none transition-colors`}
              style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 flex-shrink-0 border-r p-4 space-y-5 overflow-y-auto" style={{ borderColor: 'var(--db-border)' }}>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--db-text-3)' }}>{t.byGoal}</p>
              <div className="space-y-0.5">
                {goals.map((g, i) => (
                  <button key={i} onClick={() => { setActiveGoal(i); setActiveTrigger(null) }}
                    className="w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeGoal === i && activeTrigger === null ? 'var(--db-active-bg)' : 'transparent',
                      color: activeGoal === i && activeTrigger === null ? 'var(--db-text-h)' : 'var(--db-text-2)',
                      fontWeight: activeGoal === i && activeTrigger === null ? 600 : 400,
                    }}
                    onMouseEnter={e => { if (!(activeGoal === i && activeTrigger === null)) e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)' }}
                    onMouseLeave={e => { if (!(activeGoal === i && activeTrigger === null)) e.currentTarget.style.backgroundColor = 'transparent' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--db-text-3)' }}>{t.byTrigger}</p>
              <div className="space-y-0.5">
                {triggers.map((tr, i) => (
                  <button key={i} onClick={() => { setActiveTrigger(i); setActiveGoal(0) }}
                    className="w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeTrigger === i ? 'var(--db-active-bg)' : 'transparent',
                      color: activeTrigger === i ? 'var(--db-text-h)' : 'var(--db-text-2)',
                      fontWeight: activeTrigger === i ? 600 : 400,
                    }}
                    onMouseEnter={e => { if (activeTrigger !== i) e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)' }}
                    onMouseLeave={e => { if (activeTrigger !== i) e.currentTarget.style.backgroundColor = 'transparent' }}>
                    {tr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--db-text-3)' }}>{t.noResults}</div>
            ) : (
              <div className="space-y-8">
                {recommended.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--db-text-h)' }}>{t.recommended}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {recommended.map(tmpl => <TemplateCard key={tmpl.id} tmpl={tmpl} lang={lang} onSelect={onSelect} t={t} />)}
                    </div>
                  </div>
                )}
                {rest.length > 0 && (
                  <div>
                    {recommended.length > 0 && <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--db-text-h)' }}>{t.discover}</h3>}
                    <div className="grid grid-cols-3 gap-3">
                      {rest.map(tmpl => <TemplateCard key={tmpl.id} tmpl={tmpl} lang={lang} onSelect={onSelect} t={t} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Automation {
  id: string
  name: string
  is_active: boolean
  trigger_keyword: string
  trigger_keywords: string[]
  comment_replies: string[]
  dm_messages: string[]
  post_url: string
  created_at: string
  connected_accounts?: { account_name: string; account_type: string }
}

export default function AutomationsPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const t = {
    ar: {
      title: 'الأتمتات', subtitle: 'أتمتة تفاعلات Instagram و Facebook',
      newBtn: 'أتمتة جديدة', all: 'الكل', active: 'نشط', inactive: 'غير نشط',
      search: 'ابحث في الأتمتات...', loading: 'جاري التحميل...',
      empty: 'لا توجد أتمتات بعد', emptyDesc: 'أنشئ أتمتتك الأولى للبدء',
      create: 'إنشاء أتمتة', keyword: 'الكلمة المفتاحية', anyWord: 'أي كلمة',
      edit: 'تعديل', delete: 'حذف', confirmDelete: 'هل أنت متأكد من الحذف؟',
    },
    en: {
      title: 'Automations', subtitle: 'Automate your Instagram & Facebook interactions',
      newBtn: '+ New Automation', all: 'All', active: 'Active', inactive: 'Inactive',
      search: 'Search automations...', loading: 'Loading...',
      empty: 'No automations yet', emptyDesc: 'Create your first automation to get started',
      create: 'Create automation', keyword: 'Keyword', anyWord: 'Any word',
      edit: 'Edit', delete: 'Delete', confirmDelete: 'Are you sure you want to delete?',
    },
  }[lang]

  useEffect(() => { fetchAutomations() }, [filter])

  const fetchAutomations = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let query = supabase
      .from('automations')
      .select('*, connected_accounts(account_name, account_type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (filter === 'active') query = query.eq('is_active', true)
    if (filter === 'inactive') query = query.eq('is_active', false)

    const { data } = await query
    setAutomations((data as Automation[]) || [])
    setLoading(false)
  }

  const toggleStatus = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('automations').update({ is_active: !current }).eq('id', id)
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a))
  }

  const deleteAutomation = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    const supabase = createClient()
    await supabase.from('automations').delete().eq('id', id)
    setAutomations(prev => prev.filter(a => a.id !== id))
    setOpenMenuId(null)
  }

  const handleTemplateSelect = (tmpl: any) => {
    setShowModal(false)
    router.push(tmpl ? `/dashboard/automations/new?template=${tmpl.id}` : '/dashboard/automations/new')
  }

  const filtered = automations.filter(a => !search || a.name?.toLowerCase().includes(search.toLowerCase()))
  const isRTL = lang === 'ar'

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
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.subtitle}</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
              <Plus size={16} /> {t.newBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center rounded-lg p-1 border"
            style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)' }}>
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: filter === f ? 'var(--db-active-bg)' : 'transparent',
                  color: filter === f ? 'var(--db-text-h)' : 'var(--db-text-2)',
                }}>
                {t[f]}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`}
              size={14} style={{ color: 'var(--db-text-3)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search}
              className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border rounded-lg text-xs focus:outline-none transition-colors`}
              style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Zap size={24} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.empty}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--db-text-3)' }}>{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={15} /> {t.create}
            </button>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            {filtered.map(automation => (
              <div key={automation.id}
                className="flex items-center gap-4 px-5 py-4 border-b transition-colors group"
                style={{ borderColor: 'var(--db-border)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>

                {/* Status dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: automation.is_active ? '#22C55E' : 'var(--db-border-2)' }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--db-text-h)' }}>{automation.name}</p>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: automation.is_active ? '#F0FDF4' : 'var(--db-icon-bg)',
                        color: automation.is_active ? '#16A34A' : 'var(--db-text-3)',
                      }}>
                      {automation.is_active ? t.active : t.inactive}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--db-text-3)' }}>
                    {automation.connected_accounts?.account_name && (
                      <span>@{automation.connected_accounts.account_name}</span>
                    )}
                    <span>·</span>
                    <span>
                      {t.keyword}:{' '}
                      <span className="font-medium" style={{ color: 'var(--db-text-2)' }}>
                        {automation.trigger_keywords?.length > 0
                          ? automation.trigger_keywords.join(', ')
                          : automation.trigger_keyword || t.anyWord}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleStatus(automation.id, automation.is_active)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: automation.is_active ? 'var(--db-text-3)' : '#16A34A' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {automation.is_active ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <Link href={`/dashboard/automations/${automation.id}/edit`}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--db-text-3)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--db-hover-bg)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                    <PenLine size={15} />
                  </Link>
                  <div className="relative">
                    <button onClick={() => setOpenMenuId(openMenuId === automation.id ? null : automation.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--db-text-3)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <MoreHorizontal size={15} />
                    </button>
                    {openMenuId === automation.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className={`absolute z-20 top-full mt-1 ${isRTL ? 'left-0' : 'right-0'} w-36 rounded-xl shadow-lg overflow-hidden`}
                          style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
                          <Link href={`/dashboard/automations/${automation.id}/edit`}
                            className="flex items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                            style={{ color: 'var(--db-text-2)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--db-hover-bg)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                            <PenLine size={13} /> {t.edit}
                          </Link>
                          <button onClick={() => deleteAutomation(automation.id)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                            style={{ color: '#DC2626' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <X size={13} /> {t.delete}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <TemplatesModal lang={lang} onClose={() => setShowModal(false)} onSelect={handleTemplateSelect} />}
    </div>
  )
}
