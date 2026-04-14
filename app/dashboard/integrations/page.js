'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Webhook, Plus, Trash2, X, AlertCircle, CheckCircle2,
  ToggleLeft, ToggleRight, Zap, Send, Copy, Eye, EyeOff,
  Clock, Activity, ChevronDown, ChevronUp, RefreshCw,
  Globe, Shield, Info
} from 'lucide-react'

// ─── Event Config ───────────────────────────────────────────
const ALL_EVENTS = [
  { key: 'new_subscriber',       icon: '👤', color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  { key: 'comment_received',     icon: '💬', color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
  { key: 'dm_received',          icon: '✉️',  color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  { key: 'automation_triggered', icon: '⚡',  color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { key: 'broadcast_sent',       icon: '📢', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
]

const EVENT_LABELS = {
  ar: {
    new_subscriber:       'مشترك جديد',
    comment_received:     'تعليق جديد',
    dm_received:          'رسالة مباشرة',
    automation_triggered: 'أتمتة اشتغلت',
    broadcast_sent:       'بث جماعي أُرسل',
  },
  en: {
    new_subscriber:       'New Subscriber',
    comment_received:     'Comment Received',
    dm_received:          'DM Received',
    automation_triggered: 'Automation Triggered',
    broadcast_sent:       'Broadcast Sent',
  }
}

// ─── Sample Payload ─────────────────────────────────────────
const SAMPLE_PAYLOAD = {
  event: 'new_subscriber',
  timestamp: new Date().toISOString(),
  account: 'My Instagram Page',
  data: {
    subscriber_id: 'sub_abc123',
    name: 'أحمد محمد',
    platform: 'instagram',
    source: 'comment',
  }
}

// ─── New Webhook Modal ──────────────────────────────────────
function NewWebhookModal({ onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({ name: '', url: '', events: [], secret: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const eventLabels = EVENT_LABELS[lang]

  const toggleEvent = (key) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(key) ? f.events.filter(e => e !== key) : [...f.events, key]
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError(t.errorName); return }
    if (!form.url.trim()) { setError(t.errorUrl); return }
    if (!form.url.startsWith('http')) { setError(t.errorUrlFormat); return }
    if (form.events.length === 0) { setError(t.errorEvents); return }
    setLoading(true)
    setError('')
    await onCreate(form)
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
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Webhook size={18} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{t.newWebhook}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.webhookName} *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder={t.webhookNamePlaceholder}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.endpointUrl} *</label>
            <div className="relative">
              <Globe size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                placeholder="https://your-server.com/webhook"
                className="w-full ps-9 pe-4 p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors"
              />
            </div>
          </div>

          {/* Events */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">{t.selectEvents} *</label>
            <div className="space-y-2">
              {ALL_EVENTS.map(ev => (
                <button
                  key={ev.key}
                  onClick={() => toggleEvent(ev.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${
                    form.events.includes(ev.key)
                      ? `${ev.bg} ${ev.border} ${ev.color}`
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{ev.icon}</span>
                    <span className="font-medium">{eventLabels[ev.key]}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    form.events.includes(ev.key) ? 'border-current bg-current' : 'border-gray-600'
                  }`}>
                    {form.events.includes(ev.key) && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t.secretKey}
              <span className="text-gray-600 font-normal ms-2">({t.optional})</span>
            </label>
            <p className="text-gray-600 text-xs mb-2">{t.secretDesc}</p>
            <div className="relative">
              <Shield size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showSecret ? 'text' : 'password'}
                value={form.secret}
                onChange={e => setForm({ ...form, secret: e.target.value })}
                placeholder="my-secret-key"
                className="w-full ps-9 pe-10 p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
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

// ─── Webhook Card ───────────────────────────────────────────
function WebhookCard({ webhook, onDelete, onToggle, onTest, t, lang, index }) {
  const [expanded, setExpanded] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const eventLabels = EVENT_LABELS[lang]

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    const result = await onTest(webhook)
    setTestResult(result)
    setTesting(false)
    setTimeout(() => setTestResult(null), 5000)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(webhook.url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const activeEvents = ALL_EVENTS.filter(e => webhook.events?.includes(e.key))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
        webhook.is_active ? 'border-cyan-500/20' : 'border-white/10'
      }`}
    >
      {/* Main Row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              webhook.is_active ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-white/10'
            }`}>
              <Webhook size={18} className={webhook.is_active ? 'text-cyan-400' : 'text-gray-500'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-semibold text-sm">{webhook.name}</span>
                {!webhook.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-500">
                    {t.paused}
                  </span>
                )}
                {webhook.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {t.active}
                  </span>
                )}
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 text-xs font-mono truncate">{webhook.url}</span>
                <button onClick={copyUrl} className="text-gray-600 hover:text-cyan-400 transition-colors flex-shrink-0">
                  {copiedUrl ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Events pills */}
              <div className="flex flex-wrap gap-1.5">
                {activeEvents.map(ev => (
                  <span key={ev.key} className={`text-xs px-2 py-0.5 rounded-full border ${ev.bg} ${ev.border} ${ev.color} flex items-center gap-1`}>
                    <span className="text-xs">{ev.icon}</span>
                    {eventLabels[ev.key]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Test */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded-xl text-xs font-medium transition-all disabled:opacity-60"
            >
              {testing
                ? <RefreshCw size={12} className="animate-spin" />
                : <Send size={12} />
              }
              {t.test}
            </motion.button>

            {/* Toggle */}
            <button
              onClick={() => onToggle(webhook.id, webhook.is_active)}
              className={`p-2 rounded-xl transition-all ${
                webhook.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'
              }`}
            >
              {webhook.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(webhook.id)}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={15} />
            </button>

            {/* Expand */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Activity size={10} />
            {webhook.total_triggers || 0} {t.triggers}
          </span>
          {webhook.last_triggered_at && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {t.lastTriggered}: {new Date(webhook.last_triggered_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
          )}
          {webhook.secret && (
            <span className="flex items-center gap-1 text-yellow-600">
              <Shield size={10} />
              {t.secured}
            </span>
          )}
        </div>

        {/* Test result */}
        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {testResult.success
                ? <><CheckCircle2 size={13} /> {t.testSuccess} (HTTP {testResult.status})</>
                : <><AlertCircle size={13} /> {t.testFailed}: {testResult.error}</>
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded — Payload Preview */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-5 bg-black/20">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{t.samplePayload}</p>
              <pre className="text-xs text-green-400 font-mono bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto leading-relaxed">
                {JSON.stringify(SAMPLE_PAYLOAD, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function IntegrationsPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [webhooks, setWebhooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const t = {
    ar: {
      title: 'التكاملات',
      desc: 'ربط IryChat مع أدواتك الخارجية عبر Webhooks',
      newWebhook: 'Webhook جديد',
      webhookName: 'اسم الـ Webhook',
      webhookNamePlaceholder: 'مثال: إرسال لـ Zapier',
      endpointUrl: 'رابط الاستقبال (Endpoint URL)',
      selectEvents: 'اختر الأحداث',
      secretKey: 'مفتاح السرية',
      secretDesc: 'يُضاف كـ header في كل request للتحقق من المصدر',
      optional: 'اختياري',
      cancel: 'إلغاء',
      create: 'إنشاء',
      test: 'اختبار',
      active: 'نشط',
      paused: 'متوقف',
      triggers: 'تشغيلة',
      lastTriggered: 'آخر تشغيل',
      secured: 'مؤمّن',
      samplePayload: 'مثال على البيانات المُرسلة',
      testSuccess: 'تم الاتصال بنجاح',
      testFailed: 'فشل الاتصال',
      confirmDelete: 'هل أنت متأكد من حذف هذا الـ Webhook؟',
      errorName: 'أدخل اسماً للـ Webhook',
      errorUrl: 'أدخل رابط الاستقبال',
      errorUrlFormat: 'الرابط يجب أن يبدأ بـ http أو https',
      errorEvents: 'اختر حدثاً واحداً على الأقل',
      empty: 'لا توجد Webhooks بعد',
      emptyDesc: 'أنشئ Webhook لربط IryChat مع Zapier أو Make أو نظامك الداخلي.',
      loading: 'جاري التحميل...',
      totalWebhooks: 'إجمالي الـ Webhooks',
      activeWebhooks: 'نشطة',
      totalTriggers: 'إجمالي التشغيلات',
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
      title: 'Integrations',
      desc: 'Connect IryChat with your external tools via Webhooks',
      newWebhook: 'New Webhook',
      webhookName: 'Webhook Name',
      webhookNamePlaceholder: 'e.g. Send to Zapier',
      endpointUrl: 'Endpoint URL',
      selectEvents: 'Select Events',
      secretKey: 'Secret Key',
      secretDesc: 'Added as a header in every request to verify the source',
      optional: 'optional',
      cancel: 'Cancel',
      create: 'Create',
      test: 'Test',
      active: 'Active',
      paused: 'Paused',
      triggers: 'triggers',
      lastTriggered: 'Last triggered',
      secured: 'Secured',
      samplePayload: 'Sample Payload',
      testSuccess: 'Connection successful',
      testFailed: 'Connection failed',
      confirmDelete: 'Are you sure you want to delete this Webhook?',
      errorName: 'Enter a name for the Webhook',
      errorUrl: 'Enter the endpoint URL',
      errorUrlFormat: 'URL must start with http or https',
      errorEvents: 'Select at least one event',
      empty: 'No Webhooks yet',
      emptyDesc: 'Create a Webhook to connect IryChat with Zapier, Make, or your internal system.',
      loading: 'Loading...',
      totalWebhooks: 'Total Webhooks',
      activeWebhooks: 'Active',
      totalTriggers: 'Total Triggers',
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

    const { data } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setWebhooks(data || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (form) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newWh } = await supabase.from('webhooks').insert({
      user_id: user.id,
      name: form.name,
      url: form.url,
      events: form.events,
      secret: form.secret || null,
      is_active: true,
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
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookId: webhook.id, url: webhook.url, secret: webhook.secret }),
      })
      const data = await res.json()
      return { success: data.success, status: data.status, error: data.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const activeCount = webhooks.filter(w => w.is_active).length
  const totalTriggers = webhooks.reduce((a, w) => a + (w.total_triggers || 0), 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Webhook className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <NewWebhookModal
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
            {t.newWebhook}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.totalWebhooks, value: webhooks.length, color: 'text-white' },
            { label: t.activeWebhooks, value: activeCount, color: 'text-green-400' },
            { label: t.totalTriggers, value: totalTriggers, color: 'text-cyan-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
            >
              <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4">
            <p className="text-cyan-400 text-sm font-medium mb-2">{t.howTitle}</p>
            <ul className="space-y-1.5">
              {[t.how1, t.how2, t.how3].map((tip, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                  <span className="text-cyan-500 font-bold flex-shrink-0">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-4">
            <p className="text-purple-400 text-sm font-medium mb-2">{t.usecaseTitle}</p>
            <ul className="space-y-1.5">
              {[t.usecase1, t.usecase2, t.usecase3].map((tip, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                  <Zap size={10} className="text-purple-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Empty */}
        {webhooks.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-500 mb-6">
              <Webhook size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.empty}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all"
            >
              <Plus size={18} /> {t.newWebhook}
            </button>
          </motion.div>
        )}

        {/* Webhooks List */}
        <div className="space-y-4">
          {webhooks.map((webhook, i) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onTest={handleTest}
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