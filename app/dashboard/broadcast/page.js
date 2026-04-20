'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Send, Plus, Trash2, Users, Clock, CheckCircle2,
  XCircle, Radio, Calendar, AlertCircle, FileText, Loader2, X
} from 'lucide-react'

function StatusBadge({ status, t }) {
  const map = {
    draft:     { cls: 'bg-gray-100 dark:bg-[#27272a] border-gray-200 dark:border-[#3f3f46] text-gray-500', icon: FileText },
    sending:   { cls: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400', icon: Radio },
    sent:      { cls: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400', icon: CheckCircle2 },
    failed:    { cls: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400', icon: XCircle },
    scheduled: { cls: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400', icon: Calendar },
  }
  const s = map[status] || map.draft
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
      <Icon size={10} /> {t[status] || status}
    </span>
  )
}

function NewBroadcastModal({ accounts, subscribers, onClose, onCreate, t, lang }) {
  const [form, setForm] = useState({ name: '', account_id: '', message: '', filter_tag: '', scheduled_at: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isRTL = lang === 'ar'

  const allTags = [...new Set(subscribers.flatMap(s => s.tags || []))]
  const filteredSubs = subscribers.filter(s => {
    const accountMatch = !form.account_id || s.account_id === form.account_id
    const tagMatch = !form.filter_tag || (s.tags || []).includes(form.filter_tag)
    return accountMatch && tagMatch && !s.is_blocked
  })

  const handleSubmit = async () => {
    if (!form.name || !form.account_id || !form.message) { setError(t.fillRequired); return }
    if (filteredSubs.length === 0) { setError(t.noRecipients); return }
    setLoading(true); setError('')
    await onCreate({ ...form, total_recipients: filteredSubs.length, status: form.scheduled_at ? 'scheduled' : 'draft' })
    setLoading(false)
  }

  const inp = `w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}
        dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--db-text-h)' }}>{t.newBroadcast}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--db-text-2)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          {[
            { label: `${t.broadcastName} *`, field: 'name', type: 'input', placeholder: t.broadcastNamePlaceholder },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{label}</label>
              <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={placeholder}
                className={inp}
                style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{t.account} *</label>
            <select value={form.account_id} onChange={e => setForm({ ...form, account_id: e.target.value })}
              className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }}>
              <option value="">{t.selectAccount}</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_type})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
              {t.filterByTag} <span style={{ color: 'var(--db-text-3)' }}>({t.optional})</span>
            </label>
            <select value={form.filter_tag} onChange={e => setForm({ ...form, filter_tag: e.target.value })}
              className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }}>
              <option value="">{t.allSubscribers}</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <div className={`mt-1.5 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${
              filteredSubs.length > 0 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
            }`}>
              <Users size={11} /> {filteredSubs.length > 0 ? `${filteredSubs.length} ${t.recipientsWillReceive}` : t.noSubscribersFound}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{t.message} *</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder={t.messagePlaceholder} rows={4}
              className={inp + ' resize-none'}
              style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            <div className="text-xs mt-1 text-end" style={{ color: 'var(--db-text-3)' }}>{form.message.length}/1000</div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>
              {t.scheduleFor} <span style={{ color: 'var(--db-text-3)' }}>({t.optional})</span>
            </label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
              className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors border"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {t.cancel}
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: 'var(--db-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : form.scheduled_at ? <Calendar size={14} /> : <Send size={14} />}
              {form.scheduled_at ? t.schedule : t.createDraft}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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

  const t = {
    ar: {
      title: 'البث الجماعي', desc: 'أرسل رسائل جماعية لمشتركيك',
      newBroadcast: 'بث جديد', broadcastName: 'اسم البث', broadcastNamePlaceholder: 'مثال: عرض الجمعة البيضاء',
      account: 'الحساب', selectAccount: 'اختر حساباً', filterByTag: 'فلترة بالتاج', optional: 'اختياري',
      allSubscribers: 'كل المشتركين', recipientsWillReceive: 'مشترك سيستقبل الرسالة', noSubscribersFound: 'لا يوجد مشتركون مطابقون',
      message: 'الرسالة', messagePlaceholder: 'اكتب رسالتك هنا... 🎉', scheduleFor: 'جدولة الإرسال',
      cancel: 'إلغاء', createDraft: 'حفظ كـ Draft', schedule: 'جدولة', sendNow: 'إرسال الآن',
      sent: 'تم الإرسال', draft: 'مسودة', failed: 'فشل', scheduled: 'مجدول',
      recipients: 'مستقبل', fillRequired: 'يرجى ملء جميع الحقول', noRecipients: 'لا يوجد مشتركون للإرسال إليهم',
      empty: 'لا توجد رسائل بث بعد', emptyDesc: 'أنشئ أول رسالة بث لمشتركيك.',
      loading: 'جاري التحميل...', confirmSend: 'هل أنت متأكد من الإرسال؟', confirmDelete: 'هل أنت متأكد من الحذف؟',
      noAccountsWarning: 'يجب ربط حساب أولاً', noSubscribersWarning: 'يجب وجود مشتركين أولاً',
      total: 'إجمالي', sentStat: 'مُرسل', drafts: 'مسودات',
    },
    en: {
      title: 'Broadcast', desc: 'Send bulk messages to your subscribers',
      newBroadcast: 'New Broadcast', broadcastName: 'Broadcast Name', broadcastNamePlaceholder: 'e.g. Black Friday Offer',
      account: 'Account', selectAccount: 'Select an account', filterByTag: 'Filter by Tag', optional: 'optional',
      allSubscribers: 'All Subscribers', recipientsWillReceive: 'subscribers will receive this', noSubscribersFound: 'No matching subscribers',
      message: 'Message', messagePlaceholder: 'Write your message here... 🎉', scheduleFor: 'Schedule for',
      cancel: 'Cancel', createDraft: 'Save as Draft', schedule: 'Schedule', sendNow: 'Send Now',
      sent: 'Sent', draft: 'Draft', failed: 'Failed', scheduled: 'Scheduled',
      recipients: 'recipients', fillRequired: 'Please fill all required fields', noRecipients: 'No subscribers to send to',
      empty: 'No broadcasts yet', emptyDesc: 'Create your first broadcast message.',
      loading: 'Loading...', confirmSend: 'Are you sure you want to send?', confirmDelete: 'Are you sure you want to delete?',
      noAccountsWarning: 'Connect an account first', noSubscribersWarning: 'You need subscribers first',
      total: 'Total', sentStat: 'Sent', drafts: 'Drafts',
    },
  }[lang]

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
    setBroadcasts(broads || []); setAccounts(accs || []); setSubscribers(subs || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async (data) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newB } = await supabase.from('broadcasts').insert({
      user_id: user.id, account_id: data.account_id || null,
      name: data.name, message: data.message, status: data.status,
      scheduled_at: data.scheduled_at || null, total_recipients: data.total_recipients,
    }).select('*, connected_accounts(account_name, account_type)').single()
    if (newB) setBroadcasts(prev => [newB, ...prev])
    setShowModal(false)
  }

  const handleSendNow = async (broadcast) => {
    if (!confirm(t.confirmSend)) return
    setSending(broadcast.id)
    const supabase = createClient()
    await supabase.from('broadcasts').update({ status: 'sending', sent_at: new Date().toISOString() }).eq('id', broadcast.id)
    setBroadcasts(prev => prev.map(b => b.id === broadcast.id ? { ...b, status: 'sending' } : b))
    setTimeout(async () => {
      await supabase.from('broadcasts').update({ status: 'sent', sent_count: broadcast.total_recipients }).eq('id', broadcast.id)
      setBroadcasts(prev => prev.map(b => b.id === broadcast.id ? { ...b, status: 'sent', sent_count: b.total_recipients } : b))
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--db-primary)' }} /> {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>
      {showModal && <NewBroadcastModal accounts={accounts} subscribers={subscribers} onClose={() => setShowModal(false)} onCreate={handleCreate} t={t} lang={lang} />}

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
          </div>
          <button onClick={() => { if (accounts.length === 0) { alert(t.noAccountsWarning); return } if (subscribers.length === 0) { alert(t.noSubscribersWarning); return } setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--db-primary)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
            <Plus size={15} /> {t.newBroadcast}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: t.total,    value: broadcasts.length,                                    color: 'var(--db-text-h)' },
            { label: t.sentStat, value: broadcasts.filter(b => b.status === 'sent').length,   color: '#16A34A' },
            { label: t.drafts,   value: broadcasts.filter(b => b.status === 'draft').length,  color: 'var(--db-text-2)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {broadcasts.length === 0 && (
          <div className="rounded-2xl p-16 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Radio size={24} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.empty}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--db-text-3)' }}>{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={15} /> {t.newBroadcast}
            </button>
          </div>
        )}

        {/* List */}
        {broadcasts.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            {broadcasts.map((broadcast) => (
              <div key={broadcast.id} className="flex items-center gap-4 px-5 py-4 border-b transition-colors group"
                style={{ borderColor: 'var(--db-border)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: broadcast.status === 'sent' ? '#F0FDF4' : broadcast.status === 'sending' ? '#FFFBEB' : 'var(--db-icon-bg)' }}>
                  {sending === broadcast.id
                    ? <Loader2 size={16} className="animate-spin text-amber-600" />
                    : <Radio size={16} style={{ color: broadcast.status === 'sent' ? '#16A34A' : 'var(--db-text-3)' }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{broadcast.name}</span>
                    <StatusBadge status={broadcast.status} t={t} />
                  </div>
                  <p className="text-xs truncate mb-1" style={{ color: 'var(--db-text-2)' }}>{broadcast.message}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--db-text-3)' }}>
                    <span className="flex items-center gap-1"><Users size={10} />{broadcast.total_recipients} {t.recipients}</span>
                    {broadcast.status === 'sent' && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={10} />{broadcast.sent_count}</span>}
                    <span className="flex items-center gap-1"><Clock size={10} />{new Date(broadcast.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(broadcast.status === 'draft' || broadcast.status === 'scheduled') && (
                    <button onClick={() => handleSendNow(broadcast)} disabled={!!sending}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'var(--db-primary)' }}>
                      <Send size={12} /> {t.sendNow}
                    </button>
                  )}
                  <button onClick={() => handleDelete(broadcast.id)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--db-text-3)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEF2F2' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--db-text-3)'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
