'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Send, Plus, Trash2, ArrowLeft, ArrowRight,
  Users, Clock, CheckCircle2, XCircle, Radio,
  Calendar, MessageSquare, ChevronDown, AlertCircle,
  Play, FileText, Zap
} from 'lucide-react'

// ─── Status Badge ───────────────────────────────────────────
function StatusBadge({ status, t }) {
  const map = {
    draft:  { color: 'bg-gray-500/10 border-gray-500/20 text-gray-400',   icon: FileText,     label: t.draft },
    sending:{ color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', icon: Radio,    label: t.sending },
    sent:   { color: 'bg-green-500/10 border-green-500/20 text-green-400',  icon: CheckCircle2, label: t.sent },
    failed: { color: 'bg-red-500/10 border-red-500/20 text-red-400',        icon: XCircle,     label: t.failed },
    scheduled:{ color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',   icon: Calendar,    label: t.scheduled },
  }
  const s = map[status] || map.draft
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.color}`}>
      <Icon size={11} />
      {s.label}
    </span>
  )
}

// ─── New Broadcast Modal ────────────────────────────────────
function NewBroadcastModal({ accounts, subscribers, onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({
    name: '',
    account_id: '',
    message: '',
    filter_tag: '',
    scheduled_at: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  // Get unique tags from subscribers
  const allTags = [...new Set(subscribers.flatMap(s => s.tags || []))]

  // Filter subscribers based on selected account + tag
  const filteredSubs = subscribers.filter(s => {
    const accountMatch = !form.account_id || s.account_id === form.account_id
    const tagMatch = !form.filter_tag || (s.tags || []).includes(form.filter_tag)
    return accountMatch && tagMatch && !s.is_blocked
  })

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.message) {
      setError(t.fillRequired)
      return
    }
    if (filteredSubs.length === 0) {
      setError(t.noRecipients)
      return
    }
    setLoading(true)
    setError('')
    await onCreate({
      ...form,
      total_recipients: filteredSubs.length,
      recipient_ids: filteredSubs.map(s => s.platform_user_id),
      status: form.scheduled_at ? 'scheduled' : 'draft',
    })
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{t.newBroadcast}</h2>
            <p className="text-gray-400 text-sm mt-1">{t.newBroadcastDesc}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-cyan-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.broadcastName} *</label>
            <input
              value={form.name}
              onChange={e => { setForm({...form, name: e.target.value}); setStep(Math.max(step, 1)) }}
              placeholder={t.broadcastNamePlaceholder}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm transition-all"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.account} *</label>
            <select
              value={form.account_id}
              onChange={e => { setForm({...form, account_id: e.target.value}); setStep(Math.max(step, 2)) }}
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

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.filterByTag}
              <span className="text-gray-600 font-normal ms-2">({t.optional})</span>
            </label>
            <select
              value={form.filter_tag}
              onChange={e => setForm({...form, filter_tag: e.target.value})}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm cursor-pointer"
            >
              <option value="">{t.allSubscribers}</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Recipients preview */}
            <div className={`mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${filteredSubs.length > 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
              <Users size={12} />
              {filteredSubs.length > 0
                ? `${filteredSubs.length} ${t.recipientsWillReceive}`
                : t.noSubscribersFound
              }
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.message} *</label>
            <textarea
              value={form.message}
              onChange={e => { setForm({...form, message: e.target.value}); setStep(Math.max(step, 3)) }}
              placeholder={t.messagePlaceholder}
              rows={5}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none transition-all"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{t.supportsEmoji}</span>
              <span>{form.message.length}/1000</span>
            </div>
          </div>

          {/* Schedule (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.scheduleFor}
              <span className="text-gray-600 font-normal ms-2">({t.optional})</span>
            </label>
            <input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={e => setForm({...form, scheduled_at: e.target.value})}
              className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm transition-all"
            />
            <p className="text-gray-600 text-xs mt-1.5">{t.scheduleHint}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-sm font-medium transition-all"
            >
              {t.cancel}
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>{form.scheduled_at ? <Calendar size={16} /> : <Send size={16} />}
                {form.scheduled_at ? t.schedule : t.createDraft}</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function BroadcastPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [broadcasts, setBroadcasts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(null)

  const content = {
    ar: {
      title: 'البث الجماعي',
      desc: 'أرسل رسائل جماعية لمشتركيك',
      newBroadcast: 'بث جديد',
      newBroadcastDesc: 'أرسل رسالة لجزء أو كل مشتركيك',
      broadcastName: 'اسم البث',
      broadcastNamePlaceholder: 'مثال: عرض الجمعة البيضاء',
      account: 'الحساب',
      selectAccount: 'اختر حساباً',
      filterByTag: 'فلترة بالتاج',
      optional: 'اختياري',
      allSubscribers: 'كل المشتركين',
      recipientsWillReceive: 'مشترك سيستقبل الرسالة',
      noSubscribersFound: 'لا يوجد مشتركون مطابقون',
      message: 'الرسالة',
      messagePlaceholder: 'اكتب رسالتك هنا... يمكنك استخدام الإيموجي 🎉',
      supportsEmoji: 'يدعم الإيموجي والعربي',
      scheduleFor: 'جدولة الإرسال',
      scheduleHint: 'اتركه فارغاً لحفظه كـ Draft',
      cancel: 'إلغاء',
      createDraft: 'حفظ كـ Draft',
      schedule: 'جدولة',
      send: 'إرسال الآن',
      sending: 'جاري الإرسال...',
      sent: 'تم الإرسال',
      draft: 'مسودة',
      failed: 'فشل',
      scheduled: 'مجدول',
      delete: 'حذف',
      sendNow: 'إرسال الآن',
      recipients: 'مستقبل',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      noRecipients: 'لا يوجد مشتركون لإرسال الرسالة إليهم',
      empty: 'لا توجد رسائل بث بعد',
      emptyDesc: 'أنشئ أول رسالة بث جماعي لمشتركيك.',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      confirmSend: 'هل أنت متأكد من إرسال هذه الرسالة؟',
      confirmDelete: 'هل أنت متأكد من حذف هذا البث؟',
      sendSuccess: 'تم الإرسال بنجاح!',
      noAccountsWarning: 'يجب ربط حساب أولاً',
      noSubscribersWarning: 'يجب وجود مشتركين أولاً',
      createdAt: 'أُنشئ في',
      totalRecipients: 'المستقبلون',
      sentCount: 'تم الإرسال',
    },
    en: {
      title: 'Broadcast',
      desc: 'Send bulk messages to your subscribers',
      newBroadcast: 'New Broadcast',
      newBroadcastDesc: 'Send a message to some or all of your subscribers',
      broadcastName: 'Broadcast Name',
      broadcastNamePlaceholder: 'e.g. Black Friday Offer',
      account: 'Account',
      selectAccount: 'Select an account',
      filterByTag: 'Filter by Tag',
      optional: 'optional',
      allSubscribers: 'All Subscribers',
      recipientsWillReceive: 'subscribers will receive this',
      noSubscribersFound: 'No matching subscribers found',
      message: 'Message',
      messagePlaceholder: 'Write your message here... Emojis are supported 🎉',
      supportsEmoji: 'Supports emoji and Arabic',
      scheduleFor: 'Schedule for',
      scheduleHint: 'Leave empty to save as Draft',
      cancel: 'Cancel',
      createDraft: 'Save as Draft',
      schedule: 'Schedule',
      send: 'Send Now',
      sending: 'Sending...',
      sent: 'Sent',
      draft: 'Draft',
      failed: 'Failed',
      scheduled: 'Scheduled',
      delete: 'Delete',
      sendNow: 'Send Now',
      recipients: 'recipients',
      fillRequired: 'Please fill all required fields',
      noRecipients: 'No subscribers to send to',
      empty: 'No broadcasts yet',
      emptyDesc: 'Create your first broadcast message to your subscribers.',
      back: 'Back',
      loading: 'Loading...',
      confirmSend: 'Are you sure you want to send this broadcast?',
      confirmDelete: 'Are you sure you want to delete this broadcast?',
      sendSuccess: 'Sent successfully!',
      noAccountsWarning: 'You need to connect an account first',
      noSubscribersWarning: 'You need subscribers first',
      createdAt: 'Created',
      totalRecipients: 'Recipients',
      sentCount: 'Sent',
    }
  }

  const t = content[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: broads }, { data: accs }, { data: subs }] = await Promise.all([
      supabase.from('broadcasts').select('*, connected_accounts(account_name, account_type)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('connected_accounts').select('*').eq('user_id', user.id).eq('is_active', true),
      supabase.from('subscribers').select('*').eq('user_id', user.id).eq('is_blocked', false),
    ])

    setBroadcasts(broads || [])
    setAccounts(accs || [])
    setSubscribers(subs || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (data) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newBroadcast } = await supabase.from('broadcasts').insert({
      user_id: user.id,
      account_id: data.account_id || null,
      name: data.name,
      message: data.message,
      status: data.status,
      scheduled_at: data.scheduled_at || null,
      total_recipients: data.total_recipients,
    }).select('*, connected_accounts(account_name, account_type)').single()

    if (newBroadcast) {
      setBroadcasts(prev => [newBroadcast, ...prev])
    }
    setShowModal(false)
  }

  const handleSendNow = async (broadcast) => {
    if (!confirm(t.confirmSend)) return
    setSending(broadcast.id)
    const supabase = createClient()

    // Update status to sending
    await supabase.from('broadcasts').update({
      status: 'sending',
      sent_at: new Date().toISOString(),
    }).eq('id', broadcast.id)

    setBroadcasts(prev => prev.map(b => b.id === broadcast.id ? { ...b, status: 'sending' } : b))

    // NOTE: Real sending happens via a Supabase Edge Function or API route
    // For now we mark as sent after a short delay (wire up real sending later)
    setTimeout(async () => {
      await supabase.from('broadcasts').update({
        status: 'sent',
        sent_count: broadcast.total_recipients,
      }).eq('id', broadcast.id)

      setBroadcasts(prev => prev.map(b =>
        b.id === broadcast.id
          ? { ...b, status: 'sent', sent_count: b.total_recipients }
          : b
      ))
      setSending(null)
    }, 2000)
  }

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return
    const supabase = createClient()
    await supabase.from('broadcasts').delete().eq('id', id)
    setBroadcasts(prev => prev.filter(b => b.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Radio className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>

      <AnimatePresence>
        {showModal && (
          <NewBroadcastModal
            accounts={accounts}
            subscribers={subscribers}
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
            t={t}
            lang={lang}
          />
        )}
      </AnimatePresence>

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{t.title}</h1>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {t.back}
            </Link>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (accounts.length === 0) { alert(t.noAccountsWarning); return }
                if (subscribers.length === 0) { alert(t.noSubscribersWarning); return }
                setShowModal(true)
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <Plus size={18} />
              {t.newBroadcast}
            </motion.button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: lang === 'ar' ? 'إجمالي البث' : 'Total', value: broadcasts.length, color: 'text-white' },
            { label: lang === 'ar' ? 'تم الإرسال' : 'Sent', value: broadcasts.filter(b => b.status === 'sent').length, color: 'text-green-400' },
            { label: lang === 'ar' ? 'مسودات' : 'Drafts', value: broadcasts.filter(b => b.status === 'draft').length, color: 'text-gray-400' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
            >
              <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {broadcasts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-500 mb-6">
              <Radio size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.empty}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">{t.emptyDesc}</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all"
            >
              <Plus size={18} />
              {t.newBroadcast}
            </button>
          </motion.div>
        )}

        {/* Broadcasts List */}
        <div className="space-y-4">
          {broadcasts.map((broadcast, i) => (
            <motion.div
              key={broadcast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                {/* Left */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    broadcast.status === 'sent' ? 'bg-green-500/10 text-green-400' :
                    broadcast.status === 'sending' ? 'bg-yellow-500/10 text-yellow-400' :
                    broadcast.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-white/5 text-gray-400'
                  }`}>
                    {broadcast.status === 'sending' && sending === broadcast.id
                      ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      : <Radio size={22} />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-white font-semibold">{broadcast.name}</span>
                      <StatusBadge status={broadcast.status} t={t} />
                    </div>

                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{broadcast.message}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      {broadcast.connected_accounts && (
                        <span className="flex items-center gap-1">
                          {broadcast.connected_accounts.account_type === 'instagram' ? '📸' : '📘'}
                          {broadcast.connected_accounts.account_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {broadcast.total_recipients} {t.recipients}
                      </span>
                      {broadcast.status === 'sent' && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 size={11} />
                          {broadcast.sent_count} {t.sentCount}
                        </span>
                      )}
                      {broadcast.scheduled_at && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <Calendar size={11} />
                          {new Date(broadcast.scheduled_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(broadcast.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {(broadcast.status === 'draft' || broadcast.status === 'scheduled') && (
                    <button
                      onClick={() => handleSendNow(broadcast)}
                      disabled={sending === broadcast.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                      <Send size={14} />
                      {sending === broadcast.id ? t.sending : t.sendNow}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(broadcast.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    title={t.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </>
  )
}