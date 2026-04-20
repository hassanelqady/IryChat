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

async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text, { width: 256, margin: 2, color: { dark: '#000000', light: '#ffffff00' } })
  } catch { return null }
}

const TYPES = {
  direct_link:   { icon: Link2,        color: 'var(--db-primary)', bg: 'var(--db-primary-bg)' },
  qr_code:       { icon: QrCode,       color: '#9333EA',           bg: '#F5F3FF' },
  comment_to_dm: { icon: MessageSquare, color: '#16A34A',           bg: '#F0FDF4' },
}

function NewLinkModal({ accounts, onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({ name: '', account_id: '', type: 'direct_link', welcome_message: '', slug: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.type) { setError(t.fillRequired); return }
    setLoading(true); setError('')
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36)
    await onCreate({ ...form, slug })
    setLoading(false)
  }

  const typeLabels = {
    ar: { direct_link: 'رابط مباشر', qr_code: 'QR Code', comment_to_dm: 'تعليق → DM' },
    en: { direct_link: 'Direct Link', qr_code: 'QR Code', comment_to_dm: 'Comment → DM' }
  }

  const inp = `w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors`

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--db-text-h)' }}>{t.newLink}</h2>
          <button onClick={onClose} className="p-2 rounded-xl transition-all" style={{ color: 'var(--db-text-2)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {error && (
            <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>{t.linkName} *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.linkNamePlaceholder}
              className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>{t.linkType} *</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TYPES).map(([key, cfg]) => {
                const Icon = cfg.icon
                return (
                  <button key={key} onClick={() => setForm({...form, type: key})}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      backgroundColor: form.type === key ? cfg.bg : 'var(--db-bg)',
                      borderColor: form.type === key ? cfg.color : 'var(--db-border)',
                      color: form.type === key ? cfg.color : 'var(--db-text-2)',
                    }}>
                    <Icon size={18} />
                    {typeLabels[lang][key]}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>{t.account} *</label>
            <select value={form.account_id} onChange={e => setForm({...form, account_id: e.target.value})}
              className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }}>
              <option value="">{t.selectAccount}</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_type})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>
              {t.welcomeMessage} <span style={{ color: 'var(--db-text-3)' }}>({t.optional})</span>
            </label>
            <textarea value={form.welcome_message} onChange={e => setForm({...form, welcome_message: e.target.value})}
              placeholder={t.welcomePlaceholder} rows={3}
              className={inp + ' resize-none'} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>
              {t.customSlug} <span style={{ color: 'var(--db-text-3)' }}>({t.optional})</span>
            </label>
            <div className="flex items-center gap-2 p-3 border rounded-xl"
              style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}>
              <span className="text-sm" style={{ color: 'var(--db-text-3)' }}>irychat.com/l/</span>
              <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                placeholder="my-link"
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: 'var(--db-text-h)' }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 text-sm font-medium rounded-xl transition-all border"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {t.cancel}
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--db-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={16} />{t.create}</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function LinkCard({ link, appUrl, onDelete, onToggle, t, lang, index }) {
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const cfg = TYPES[link.type] || TYPES.direct_link
  const Icon = cfg.icon
  const fullUrl = `${appUrl}/l/${link.slug}`

  const copy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handleShowQR = async () => {
    if (!qrUrl) { const url = await generateQR(fullUrl); setQrUrl(url) }
    setShowQR(!showQR)
  }

  const typeLabels = {
    ar: { direct_link: 'رابط مباشر', qr_code: 'QR Code', comment_to_dm: 'تعليق → DM' },
    en: { direct_link: 'Direct Link', qr_code: 'QR Code', comment_to_dm: 'Comment → DM' }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-2xl transition-all"
      style={{ backgroundColor: 'var(--db-surface)', border: `1px solid ${link.is_active ? cfg.color : 'var(--db-border)'}`, boxShadow: 'var(--db-shadow)' }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
              <Icon size={18} style={{ color: cfg.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm" style={{ color: 'var(--db-text-h)' }}>{link.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                  style={{ backgroundColor: cfg.bg, borderColor: cfg.color, color: cfg.color }}>
                  {typeLabels[lang][link.type]}
                </span>
                {!link.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: 'var(--db-icon-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-3)' }}>
                    {t.paused}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono truncate" style={{ color: 'var(--db-primary)' }}>{fullUrl}</span>
                <button onClick={copy} className="transition-colors flex-shrink-0" style={{ color: 'var(--db-text-3)' }}>
                  {copied ? <CheckCircle2 size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--db-text-3)' }}>
                <span className="flex items-center gap-1"><MousePointer size={10} />{link.clicks} {t.clicks}</span>
                <span className="flex items-center gap-1"><Users size={10} />{link.conversions} {t.conversions}</span>
                <span className="flex items-center gap-1"><TrendingUp size={10} />{link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0}% CVR</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleShowQR} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: showQR ? '#F5F3FF' : 'var(--db-icon-bg)', color: showQR ? '#9333EA' : 'var(--db-text-2)' }}>
              <QrCode size={15} />
            </button>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: 'var(--db-icon-bg)', color: 'var(--db-text-2)' }}>
              <ExternalLink size={15} />
            </a>
            <button onClick={() => onToggle(link.id, link.is_active)} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: link.is_active ? '#F0FDF4' : 'var(--db-icon-bg)', color: link.is_active ? '#16A34A' : 'var(--db-text-3)' }}>
              {link.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </button>
            <button onClick={() => onDelete(link.id)} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showQR && qrUrl && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t flex flex-col items-center gap-3 p-4" style={{ borderColor: 'var(--db-border)' }}>
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}>
              <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
            </div>
            <a href={qrUrl} download={`${link.name}-qr.png`}
              className="text-xs transition-colors" style={{ color: 'var(--db-primary)' }}>
              {t.downloadQR}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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
      title: 'أدوات النمو', desc: 'روابط مباشرة، QR Codes، وأتمتة التعليقات',
      newLink: 'أداة جديدة', linkName: 'اسم الرابط', linkNamePlaceholder: 'مثال: رابط انستجرام الرئيسي',
      linkType: 'نوع الأداة', account: 'الحساب', selectAccount: 'اختر حساباً',
      welcomeMessage: 'رسالة الترحيب', welcomePlaceholder: 'مرحباً! شكراً على تواصلك معنا 👋',
      customSlug: 'رابط مخصص', optional: 'اختياري', cancel: 'إلغاء', create: 'إنشاء',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة', clicks: 'نقرة', conversions: 'تحويل',
      paused: 'متوقف', downloadQR: 'تحميل QR Code', confirmDelete: 'هل أنت متأكد من حذف هذا الرابط؟',
      empty: 'لا توجد أدوات بعد', emptyDesc: 'أنشئ رابطاً مباشراً أو QR Code لجذب المزيد من المشتركين.',
      loading: 'جاري التحميل...', totalLinks: 'إجمالي الأدوات', totalClicks: 'إجمالي النقرات',
      totalConversions: 'إجمالي التحويلات',
      tipTitle: '💡 كيف تستخدم أدوات النمو؟',
      tip1: 'ضع الرابط المباشر في Bio انستجرام لجذب متابعيك للشات',
      tip2: 'استخدم QR Code في المواد التسويقية والمطبوعات',
      tip3: 'فعّل Comment to DM لتحويل كل تعليق لمحادثة تلقائية',
    },
    en: {
      title: 'Growth Tools', desc: 'Direct links, QR Codes, and comment automation',
      newLink: 'New Tool', linkName: 'Link Name', linkNamePlaceholder: 'e.g. Instagram Main Link',
      linkType: 'Tool Type', account: 'Account', selectAccount: 'Select an account',
      welcomeMessage: 'Welcome Message', welcomePlaceholder: 'Hi! Thanks for reaching out 👋',
      customSlug: 'Custom Slug', optional: 'optional', cancel: 'Cancel', create: 'Create',
      fillRequired: 'Please fill all required fields', clicks: 'clicks', conversions: 'conversions',
      paused: 'Paused', downloadQR: 'Download QR Code', confirmDelete: 'Are you sure you want to delete this link?',
      empty: 'No growth tools yet', emptyDesc: 'Create a direct link or QR Code to attract more subscribers.',
      loading: 'Loading...', totalLinks: 'Total Tools', totalClicks: 'Total Clicks',
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
    setLinks(linksData || []); setAccounts(accsData || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (data) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newLink } = await supabase.from('growth_links').insert({
      user_id: user.id, account_id: data.account_id || null,
      name: data.name, type: data.type, slug: data.slug,
      welcome_message: data.welcome_message || null, is_active: true,
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-3 animate-pulse" style={{ color: 'var(--db-primary)' }}>
        <Link2 className="w-6 h-6" /> <span className="text-sm font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {showModal && <NewLinkModal accounts={accounts} onClose={() => setShowModal(false)} onCreate={handleCreate} t={t} lang={lang} />}
      </AnimatePresence>

      <main className="p-6 md:p-8 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
            <p className="text-sm" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl text-sm transition-all"
            style={{ backgroundColor: 'var(--db-primary)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
            <Plus size={18} /> {t.newLink}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.totalLinks,       value: links.length,    color: 'var(--db-text-h)' },
            { label: t.totalClicks,      value: totalClicks,     color: 'var(--db-primary)' },
            { label: t.totalConversions, value: totalConversions, color: '#16A34A' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <div className="rounded-2xl p-4 mb-8"
          style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--db-primary)' }}>{t.tipTitle}</p>
          <ul className="space-y-1">
            {[t.tip1, t.tip2, t.tip3].map((tip, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--db-text-2)' }}>
                <Zap size={11} style={{ color: 'var(--db-primary)', marginTop: 2, flexShrink: 0 }} /> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Empty */}
        {links.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            <div className="inline-flex p-6 rounded-full mb-6" style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Link2 size={48} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--db-text-h)' }}>{t.empty}</h3>
            <p className="max-w-md mx-auto mb-8 text-sm" style={{ color: 'var(--db-text-2)' }}>{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={18} /> {t.newLink}
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          {links.map((link, i) => (
            <LinkCard key={link.id} link={link} appUrl={appUrl} onDelete={handleDelete} onToggle={handleToggle} t={t} lang={lang} index={i} />
          ))}
        </div>
      </main>
    </>
  )
}
