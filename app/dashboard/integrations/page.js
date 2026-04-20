'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Webhook, Plus, Trash2, X, AlertCircle, CheckCircle2,
  ToggleLeft, ToggleRight, Zap, Send, Copy, Eye, EyeOff,
  Clock, Activity, ChevronDown, ChevronUp, RefreshCw, Globe, Shield
} from 'lucide-react'

const ALL_EVENTS = [
  { key: 'new_subscriber',       icon: '👤', color: '#16A34A',           bg: '#F0FDF4' },
  { key: 'comment_received',     icon: '💬', color: 'var(--db-primary)', bg: 'var(--db-primary-bg)' },
  { key: 'dm_received',          icon: '✉️',  color: '#3B82F6',           bg: '#EFF6FF' },
  { key: 'automation_triggered', icon: '⚡',  color: '#D97706',           bg: '#FFFBEB' },
  { key: 'broadcast_sent',       icon: '📢', color: '#9333EA',           bg: '#F5F3FF' },
]

const EVENT_LABELS = {
  ar: { new_subscriber: 'مشترك جديد', comment_received: 'تعليق جديد', dm_received: 'رسالة مباشرة', automation_triggered: 'أتمتة اشتغلت', broadcast_sent: 'بث جماعي أُرسل' },
  en: { new_subscriber: 'New Subscriber', comment_received: 'Comment Received', dm_received: 'DM Received', automation_triggered: 'Automation Triggered', broadcast_sent: 'Broadcast Sent' }
}

const SAMPLE_PAYLOAD = {
  event: 'new_subscriber', timestamp: new Date().toISOString(), account: 'My Instagram Page',
  data: { subscriber_id: 'sub_abc123', name: 'أحمد محمد', platform: 'instagram', source: 'comment' }
}

function NewWebhookModal({ onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({ name: '', url: '', events: [], secret: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const eventLabels = EVENT_LABELS[lang]

  const toggleEvent = (key) => {
    setForm(f => ({ ...f, events: f.events.includes(key) ? f.events.filter(e => e !== key) : [...f.events, key] }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError(t.errorName); return }
    if (!form.url.trim()) { setError(t.errorUrl); return }
    if (!form.url.startsWith('http')) { setError(t.errorUrlFormat); return }
    if (form.events.length === 0) { setError(t.errorEvents); return }
    setLoading(true); setError('')
    await onCreate(form)
    setLoading(false)
  }

  const inp = `w-full border rounded-xl text-sm focus:outline-none transition-colors`

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--db-primary-bg)' }}>
              <Webhook size={18} style={{ color: 'var(--db-primary)' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.newWebhook}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all" style={{ color: 'var(--db-text-2)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {error && (
            <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>{t.webhookName} *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t.webhookNamePlaceholder}
              className={inp + ' px-3 py-3'} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--db-text-2)' }}>{t.endpointUrl} *</label>
            <div className="relative">
              <Globe size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--db-text-3)' }} />
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://your-server.com/webhook"
                className={inp + ' ps-9 pe-4 py-3 font-mono'} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--db-text-2)' }}>{t.selectEvents} *</label>
            <div className="space-y-2">
              {ALL_EVENTS.map(ev => (
                <button key={ev.key} onClick={() => toggleEvent(ev.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-sm"
                  style={{
                    backgroundColor: form.events.includes(ev.key) ? ev.bg : 'var(--db-bg)',
                    borderColor: form.events.includes(ev.key) ? ev.color : 'var(--db-border)',
                    color: form.events.includes(ev.key) ? ev.color : 'var(--db-text-2)',
                  }}>
                  <div className="flex items-center gap-2.5">
                    <span>{ev.icon}</span>
                    <span className="font-medium">{eventLabels[ev.key]}</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: form.events.includes(ev.key) ? ev.color : 'var(--db-border-2)', backgroundColor: form.events.includes(ev.key) ? ev.color : 'transparent' }}>
                    {form.events.includes(ev.key) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--db-text-2)' }}>
              {t.secretKey} <span style={{ color: 'var(--db-text-3)' }}>({t.optional})</span>
            </label>
            <p className="text-xs mb-2" style={{ color: 'var(--db-text-3)' }}>{t.secretDesc}</p>
            <div className="relative">
              <Shield size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--db-text-3)' }} />
              <input type={showSecret ? 'text' : 'password'} value={form.secret} onChange={e => setForm({ ...form, secret: e.target.value })} placeholder="my-secret-key"
                className={inp + ' ps-9 pe-10 py-3 font-mono'} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
              <button onClick={() => setShowSecret(!showSecret)} className="absolute end-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--db-text-3)' }}>
                {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
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

function WebhookCard({ webhook, onDelete, onToggle, onTest, t, lang, index }) {
  const [expanded, setExpanded] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const eventLabels = EVENT_LABELS[lang]
  const activeEvents = ALL_EVENTS.filter(e => webhook.events?.includes(e.key))

  const handleTest = async () => {
    setTesting(true); setTestResult(null)
    const result = await onTest(webhook)
    setTestResult(result); setTesting(false)
    setTimeout(() => setTestResult(null), 5000)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(webhook.url)
    setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden transition-all"
      style={{ backgroundColor: 'var(--db-surface)', border: `1px solid ${webhook.is_active ? 'var(--db-primary)' : 'var(--db-border)'}`, boxShadow: 'var(--db-shadow)' }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: webhook.is_active ? 'var(--db-primary-bg)' : 'var(--db-icon-bg)', border: `1px solid ${webhook.is_active ? 'var(--db-primary)' : 'var(--db-border)'}` }}>
              <Webhook size={18} style={{ color: webhook.is_active ? 'var(--db-primary)' : 'var(--db-text-3)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm" style={{ color: 'var(--db-text-h)' }}>{webhook.name}</span>
                {!webhook.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: 'var(--db-icon-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-3)' }}>
                    {t.paused}
                  </span>
                )}
                {webhook.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                    style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#16A34A' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {t.active}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono truncate" style={{ color: 'var(--db-text-3)' }}>{webhook.url}</span>
                <button onClick={copyUrl} className="transition-colors flex-shrink-0" style={{ color: 'var(--db-text-3)' }}>
                  {copiedUrl ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeEvents.map(ev => (
                  <span key={ev.key} className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                    style={{ backgroundColor: ev.bg, borderColor: ev.color, color: ev.color }}>
                    <span className="text-xs">{ev.icon}</span> {eventLabels[ev.key]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleTest} disabled={testing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-60"
              style={{ backgroundColor: '#F5F3FF', border: '1px solid #E9D5FF', color: '#9333EA' }}>
              {testing ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
              {t.test}
            </button>
            <button onClick={() => onToggle(webhook.id, webhook.is_active)} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: webhook.is_active ? '#F0FDF4' : 'var(--db-icon-bg)', color: webhook.is_active ? '#16A34A' : 'var(--db-text-3)' }}>
              {webhook.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </button>
            <button onClick={() => onDelete(webhook.id)} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              <Trash2 size={15} />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-xl transition-all"
              style={{ backgroundColor: 'var(--db-icon-bg)', color: 'var(--db-text-2)' }}>
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-3)' }}>
          <span className="flex items-center gap-1"><Activity size={10} />{webhook.total_triggers || 0} {t.triggers}</span>
          {webhook.last_triggered_at && (
            <span className="flex items-center gap-1">
              <Clock size={10} /> {t.lastTriggered}: {new Date(webhook.last_triggered_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
          )}
          {webhook.secret && (
            <span className="flex items-center gap-1" style={{ color: '#D97706' }}>
              <Shield size={10} /> {t.secured}
            </span>
          )}
        </div>

        <AnimatePresence>
          {testResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-xl text-xs flex items-center gap-2"
              style={{
                backgroundColor: testResult.success ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${testResult.success ? '#BBF7D0' : '#FECACA'}`,
                color: testResult.success ? '#16A34A' : '#DC2626',
              }}>
              {testResult.success
                ? <><CheckCircle2 size={13} /> {t.testSuccess} (HTTP {testResult.status})</>
                : <><AlertCircle size={13} /> {t.testFailed}: {testResult.error}</>
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t" style={{ borderColor: 'var(--db-border)' }}>
            <div className="p-5" style={{ backgroundColor: 'var(--db-bg)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--db-text-3)' }}>{t.samplePayload}</p>
              <pre className="text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed"
                style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', color: '#16A34A' }}>
                {JSON.stringify(SAMPLE_PAYLOAD, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function IntegrationsPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const [webhooks, setWebhooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const t = {
    ar: {
      title: 'التكاملات', desc: 'ربط IryChat مع أدواتك الخارجية عبر Webhooks',
      newWebhook: 'Webhook جديد', webhookName: 'اسم الـ Webhook', webhookNamePlaceholder: 'مثال: إرسال لـ Zapier',
      endpointUrl: 'رابط الاستقبال (Endpoint URL)', selectEvents: 'اختر الأحداث',
      secretKey: 'مفتاح السرية', secretDesc: 'يُضاف كـ header في كل request للتحقق من المصدر',
      optional: 'اختياري', cancel: 'إلغاء', create: 'إنشاء', test: 'اختبار',
      active: 'نشط', paused: 'متوقف', triggers: 'تشغيلة', lastTriggered: 'آخر تشغيل',
      secured: 'مؤمّن', samplePayload: 'مثال على البيانات المُرسلة',
      testSuccess: 'تم الاتصال بنجاح', testFailed: 'فشل الاتصال',
      confirmDelete: 'هل أنت متأكد من حذف هذا الـ Webhook؟',
      errorName: 'أدخل اسماً للـ Webhook', errorUrl: 'أدخل رابط الاستقبال',
      errorUrlFormat: 'الرابط يجب أن يبدأ بـ http أو https', errorEvents: 'اختر حدثاً واحداً على الأقل',
      empty: 'لا توجد Webhooks بعد', emptyDesc: 'أنشئ Webhook لربط IryChat مع Zapier أو Make أو نظامك الداخلي.',
      loading: 'جاري التحميل...', totalWebhooks: 'إجمالي', activeWebhooks: 'نشطة', totalTriggers: 'إجمالي التشغيلات',
      howTitle: '💡 كيف تستخدم Webhooks؟',
      how1: 'أنشئ Webhook وحدد الأحداث اللي تهمك',
      how2: 'الصقه في Zapier أو Make أو نظامك الداخلي',
      how3: 'كل حدث هيتبعت تلقائياً كـ POST request لرابطك',
      usecaseTitle: 'أمثلة على الاستخدام',
      usecase1: 'مشترك جديد → إضافة تلقائية في Google Sheets',
      usecase2: 'تعليق جديد → إشعار على Slack',
      usecase3: 'أتمتة اشتغلت → تسجيل في CRM',
    },
    en: {
      title: 'Integrations', desc: 'Connect IryChat with your external tools via Webhooks',
      newWebhook: 'New Webhook', webhookName: 'Webhook Name', webhookNamePlaceholder: 'e.g. Send to Zapier',
      endpointUrl: 'Endpoint URL', selectEvents: 'Select Events',
      secretKey: 'Secret Key', secretDesc: 'Added as a header in every request to verify the source',
      optional: 'optional', cancel: 'Cancel', create: 'Create', test: 'Test',
      active: 'Active', paused: 'Paused', triggers: 'triggers', lastTriggered: 'Last triggered',
      secured: 'Secured', samplePayload: 'Sample Payload',
      testSuccess: 'Connection successful', testFailed: 'Connection failed',
      confirmDelete: 'Are you sure you want to delete this Webhook?',
      errorName: 'Enter a name for the Webhook', errorUrl: 'Enter the endpoint URL',
      errorUrlFormat: 'URL must start with http or https', errorEvents: 'Select at least one event',
      empty: 'No Webhooks yet', emptyDesc: 'Create a Webhook to connect IryChat with Zapier, Make, or your internal system.',
      loading: 'Loading...', totalWebhooks: 'Total', activeWebhooks: 'Active', totalTriggers: 'Total Triggers',
      howTitle: '💡 How to use Webhooks?',
      how1: 'Create a Webhook and select the events you care about',
      how2: 'Paste the URL into Zapier, Make, or your internal system',
      how3: 'Every event will be sent automatically as a POST request to your URL',
      usecaseTitle: 'Use Case Examples',
      usecase1: 'New subscriber → Auto-add to Google Sheets',
      usecase2: 'New comment → Slack notification',
      usecase3: 'Automation triggered → Log in CRM',
    }
  }[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('webhooks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setWebhooks(data || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (form) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newWh } = await supabase.from('webhooks').insert({
      user_id: user.id, name: form.name, url: form.url, events: form.events, secret: form.secret || null, is_active: true,
    }).select().single()
    if (newWh) setWebhooks(prev => [newWh, ...prev])
    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return
    const supabase = createClient()
    await supabase.from('webhooks').delete().eq('id', id)
    setWebhooks(prev => prev.filter(w => w.id !== id))
  }

  const handleToggle = async (id, currentStatus) => {
    const supabase = createClient()
    await supabase.from('webhooks').update({ is_active: !currentStatus }).eq('id', id)
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, is_active: !currentStatus } : w))
  }

  const handleTest = async (webhook) => {
    try {
      const res = await fetch('/api/webhooks/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ webhookId: webhook.id, url: webhook.url, secret: webhook.secret }) })
      const data = await res.json()
      return { success: data.success, status: data.status, error: data.error }
    } catch (err) { return { success: false, error: err.message } }
  }

  const activeCount = webhooks.filter(w => w.is_active).length
  const totalTriggers = webhooks.reduce((a, w) => a + (w.total_triggers || 0), 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-3 animate-pulse" style={{ color: 'var(--db-primary)' }}>
        <Webhook className="w-6 h-6" /> <span className="text-sm font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {showModal && <NewWebhookModal onClose={() => setShowModal(false)} onCreate={handleCreate} t={t} lang={lang} />}
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
            <Plus size={18} /> {t.newWebhook}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.totalWebhooks, value: webhooks.length, color: 'var(--db-text-h)' },
            { label: t.activeWebhooks, value: activeCount,    color: '#16A34A' },
            { label: t.totalTriggers, value: totalTriggers,   color: 'var(--db-primary)' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--db-primary)' }}>{t.howTitle}</p>
            <ul className="space-y-1.5">
              {[t.how1, t.how2, t.how3].map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--db-text-2)' }}>
                  <span style={{ color: 'var(--db-primary)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#F5F3FF', border: '1px solid #E9D5FF' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#9333EA' }}>{t.usecaseTitle}</p>
            <ul className="space-y-1.5">
              {[t.usecase1, t.usecase2, t.usecase3].map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--db-text-2)' }}>
                  <Zap size={10} style={{ color: '#9333EA', marginTop: 2, flexShrink: 0 }} /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Empty */}
        {webhooks.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            <div className="inline-flex p-6 rounded-full mb-6" style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Webhook size={48} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--db-text-h)' }}>{t.empty}</h3>
            <p className="max-w-md mx-auto mb-8 text-sm" style={{ color: 'var(--db-text-2)' }}>{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={18} /> {t.newWebhook}
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          {webhooks.map((webhook, i) => (
            <WebhookCard key={webhook.id} webhook={webhook} onDelete={handleDelete} onToggle={handleToggle} onTest={handleTest} t={t} lang={lang} index={i} />
          ))}
        </div>
      </main>
    </>
  )
}
