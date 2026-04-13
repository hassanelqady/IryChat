'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Link2, QrCode, MessageSquare, Plus, Trash2,
  Copy, CheckCircle2, TrendingUp, MousePointer,
  Users, Zap, X, AlertCircle, ExternalLink,
  ToggleLeft, ToggleRight
} from 'lucide-react'
import QRCode from 'qrcode'

// ─── QR Generator ──────────────────────────────────────────
async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text, { width: 256, margin: 2, color: { dark: '#ffffff', light: '#00000000' } })
  } catch { return null }
}

// ─── Type Config ───────────────────────────────────────────
const TYPES = {
  direct_link: { icon: Link2, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  qr_code:     { icon: QrCode, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  comment_to_dm: { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
}

// ─── New Link Modal ─────────────────────────────────────────
function NewLinkModal({ accounts, onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({ name: '', account_id: '', type: 'direct_link', welcome_message: '', slug: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.type) { setError(t.fillRequired); return }
    setLoading(true)
    setError('')
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36)
    await onCreate({ ...form, slug })
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{t.newLink}</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.linkName} *</label>
            <input
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder={t.linkNamePlaceholder}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.linkType} *</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TYPES).map(([key, cfg]) => {
                const Icon = cfg.icon
                const typeLabels = {
                  ar: { direct_link: 'رابط مباشر', qr_code: 'QR Code', comment_to_dm: 'تعليق → DM' },
                  en: { direct_link: 'Direct Link', qr_code: 'QR Code', comment_to_dm: 'Comment → DM' }
                }
                return (
                  <button
                    key={key}
                    onClick={() => setForm({...form, type: key})}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      form.type === key
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Icon size={18} />
                    {typeLabels[lang][key]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.account} *</label>
            <select
              value={form.account_id}
              onChange={e => setForm({...form, account_id: e.target.value})}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm cursor-pointer"
            >
              <option value="">{t.selectAccount}</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} ({acc.account_type === 'instagram' ? 'Instagram' : 'Facebook'})
                </option>
              ))}
            </select>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.welcomeMessage}
              <span className="text-gray-600 font-normal ms-2">({t.optional})</span>
            </label>
            <textarea
              value={form.welcome_message}
              onChange={e => setForm({...form, welcome_message: e.target.value})}
              placeholder={t.welcomePlaceholder}
              rows={3}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none"
            />
          </div>

          {/* Custom Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.customSlug}
              <span className="text-gray-600 font-normal ms-2">({t.optional})</span>
            </label>
            <div className="flex items-center gap-2 p-3.5 bg-black/30 border border-white/10 rounded-xl">
              <span className="text-gray-600 text-sm">irychat.com/l/</span>
              <input
                value={form.slug}
                onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                placeholder="my-link"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-sm font-medium transition-all">
              {t.cancel}
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><Plus size={16} />{t.create}</>
              }
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Link Card ──────────────────────────────────────────────
function LinkCard({ link, appUrl, onDelete, onToggle, t, lang, index }) {
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const cfg = TYPES[link.type] || TYPES.direct_link
  const Icon = cfg.icon
  const fullUrl = `${appUrl}/l/${link.slug}`

  const copy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShowQR = async () => {
    if (!qrUrl) {
      const url = await generateQR(fullUrl)
      setQrUrl(url)
    }
    setShowQR(!showQR)
  }

  const typeLabels = {
    ar: { direct_link: 'رابط مباشر', qr_code: 'QR Code', comment_to_dm: 'تعليق → DM' },
    en: { direct_link: 'Direct Link', qr_code: 'QR Code', comment_to_dm: 'Comment → DM' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className={`bg-white/5 border ${link.is_active ? cfg.border : 'border-white/10'} rounded-2xl p-5 transition-all hover:border-white/20`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className={cfg.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-semibold text-sm">{link.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                {typeLabels[lang][link.type]}
              </span>
              {!link.is_active && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-500">
                  {t.paused}
                </span>
              )}
            </div>

            {/* URL */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-400 text-xs font-mono truncate">{fullUrl}</span>
              <button onClick={copy} className="text-gray-500 hover:text-cyan-400 transition-colors flex-shrink-0">
                {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <MousePointer size={10} />
                {link.clicks} {t.clicks}
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                {link.conversions} {t.conversions}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={10} />
                {link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0}% CVR
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* QR */}
          <button
            onClick={handleShowQR}
            className={`p-2 rounded-xl transition-all ${showQR ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            title="QR Code"
          >
            <QrCode size={15} />
          </button>
          {/* External */}
          <a
            href={fullUrl} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            <ExternalLink size={15} />
          </a>
          {/* Toggle */}
          <button
            onClick={() => onToggle(link.id, link.is_active)}
            className={`p-2 rounded-xl transition-all ${link.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}`}
          >
            {link.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* QR Code panel */}
      <AnimatePresence>
        {showQR && qrUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-3"
          >
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
            </div>
            <a
              href={qrUrl} download={`${link.name}-qr.png`}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {t.downloadQR}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function GrowthToolsPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://irychat.vercel.app'

  const [links, setLinks] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const t = {
    ar: {
      title: 'أدوات النمو',
      desc: 'روابط مباشرة، QR Codes، وأتمتة التعليقات',
      newLink: 'أداة جديدة',
      linkName: 'اسم الرابط',
      linkNamePlaceholder: 'مثال: رابط انستجرام الرئيسي',
      linkType: 'نوع الأداة',
      account: 'الحساب',
      selectAccount: 'اختر حساباً',
      welcomeMessage: 'رسالة الترحيب',
      welcomePlaceholder: 'مرحباً! شكراً على تواصلك معنا 👋',
      customSlug: 'رابط مخصص',
      optional: 'اختياري',
      cancel: 'إلغاء',
      create: 'إنشاء',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      clicks: 'نقرة',
      conversions: 'تحويل',
      paused: 'متوقف',
      downloadQR: 'تحميل QR Code',
      confirmDelete: 'هل أنت متأكد من حذف هذا الرابط؟',
      empty: 'لا توجد أدوات بعد',
      emptyDesc: 'أنشئ رابطاً مباشراً أو QR Code لجذب المزيد من المشتركين.',
      loading: 'جاري التحميل...',
      totalLinks: 'إجمالي الأدوات',
      totalClicks: 'إجمالي النقرات',
      totalConversions: 'إجمالي التحويلات',
      tipTitle: '💡 كيف تستخدم أدوات النمو؟',
      tip1: 'ضع الرابط المباشر في Bio انستجرام لجذب متابعيك للشات',
      tip2: 'استخدم QR Code في المواد التسويقية والمطبوعات',
      tip3: 'فعّل Comment to DM لتحويل كل تعليق لمحادثة تلقائية',
    },
    en: {
      title: 'Growth Tools',
      desc: 'Direct links, QR Codes, and comment automation',
      newLink: 'New Tool',
      linkName: 'Link Name',
      linkNamePlaceholder: 'e.g. Instagram Main Link',
      linkType: 'Tool Type',
      account: 'Account',
      selectAccount: 'Select an account',
      welcomeMessage: 'Welcome Message',
      welcomePlaceholder: 'Hi! Thanks for reaching out 👋',
      customSlug: 'Custom Slug',
      optional: 'optional',
      cancel: 'Cancel',
      create: 'Create',
      fillRequired: 'Please fill all required fields',
      clicks: 'clicks',
      conversions: 'conversions',
      paused: 'Paused',
      downloadQR: 'Download QR Code',
      confirmDelete: 'Are you sure you want to delete this link?',
      empty: 'No growth tools yet',
      emptyDesc: 'Create a direct link or QR Code to attract more subscribers.',
      loading: 'Loading...',
      totalLinks: 'Total Tools',
      totalClicks: 'Total Clicks',
      totalConversions: 'Total Conversions',
      tipTitle: '💡 How to use Growth Tools?',
      tip1: 'Place the direct link in your Instagram Bio to drive followers to chat',
      tip2: 'Use QR Codes in marketing materials and print media',
      tip3: 'Enable Comment to DM to turn every comment into an automated conversation',
    }
  }[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: linksData }, { data: accsData }] = await Promise.all([
      supabase.from('growth_links').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('connected_accounts').select('*').eq('user_id', user.id).eq('is_active', true),
    ])

    setLinks(linksData || [])
    setAccounts(accsData || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (data) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newLink } = await supabase.from('growth_links').insert({
      user_id: user.id,
      account_id: data.account_id || null,
      name: data.name,
      type: data.type,
      slug: data.slug,
      welcome_message: data.welcome_message || null,
      is_active: true,
    }).select().single()

    if (newLink) setLinks(prev => [newLink, ...prev])
    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return
    const supabase = createClient()
    await supabase.from('growth_links').delete().eq('id', id)
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  const handleToggle = async (id, currentStatus) => {
    const supabase = createClient()
    await supabase.from('growth_links').update({ is_active: !currentStatus }).eq('id', id)
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: !currentStatus } : l))
  }

  const totalClicks = links.reduce((a, l) => a + (l.clicks || 0), 0)
  const totalConversions = links.reduce((a, l) => a + (l.conversions || 0), 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Link2 className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <NewLinkModal
            accounts={accounts}
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
            t={t}
            lang={lang}
          />
        )}
      </AnimatePresence>

      <main className="p-6 md:p-8 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{t.title}</h1>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus size={18} />
            {t.newLink}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.totalLinks, value: links.length, color: 'text-white' },
            { label: t.totalClicks, value: totalClicks, color: 'text-cyan-400' },
            { label: t.totalConversions, value: totalConversions, color: 'text-green-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
            >
              <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 mb-8">
          <p className="text-cyan-400 text-sm font-medium mb-2">{t.tipTitle}</p>
          <ul className="space-y-1">
            {[t.tip1, t.tip2, t.tip3].map((tip, i) => (
              <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                <Zap size={11} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Empty */}
        {links.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-500 mb-6">
              <Link2 size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.empty}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all"
            >
              <Plus size={18} /> {t.newLink}
            </button>
          </motion.div>
        )}

        {/* Links List */}
        <div className="space-y-4">
          {links.map((link, i) => (
            <LinkCard
              key={link.id}
              link={link}
              appUrl={appUrl}
              onDelete={handleDelete}
              onToggle={handleToggle}
              t={t}
              lang={lang}
              index={i}
            />
          ))}
        </div>

      </main>
    </>
  )
}