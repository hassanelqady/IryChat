'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Repeat, Plus, Trash2, Play, Pause,
  ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, Clock, Users, MessageSquare, X, Loader2
} from 'lucide-react'

function StepCard({ step, index }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)', color: 'var(--db-primary)' }}>
          {step.day_number}
        </div>
        {index < 99 && <div className="w-px h-4 mt-1" style={{ backgroundColor: 'var(--db-border)' }} />}
      </div>
      <div className="flex-1 rounded-xl p-3 mb-2 border"
        style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--db-text-h)' }}>{step.message}</p>
      </div>
    </div>
  )
}

function NewSequenceModal({ onClose, onCreate, t, lang }) {
  const isRTL = lang === 'ar'
  const [name, setName] = useState('')
  const [steps, setSteps] = useState([{ day_number: 1, message: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addStep = () => setSteps([...steps, { day_number: (steps[steps.length - 1]?.day_number || 0) + 1, message: '' }])
  const removeStep = (i) => { if (steps.length === 1) return; setSteps(steps.filter((_, idx) => idx !== i)) }
  const updateStep = (i, field, value) => setSteps(steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s))

  const handleSubmit = async () => {
    if (!name.trim()) { setError(t.fillName); return }
    if (steps.some(s => !s.message.trim())) { setError(t.fillAllMessages); return }
    setLoading(true); setError('')
    await onCreate({ name, steps })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}
        dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--db-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--db-text-h)' }}>{t.newSequence}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.newSequenceDesc}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--db-text-2)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{t.sequenceName} *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.sequenceNamePlaceholder}
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium" style={{ color: 'var(--db-text-2)' }}>{t.steps} *</label>
              <button onClick={addStep}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)', color: 'var(--db-primary)' }}>
                <Plus size={12} /> {t.addStep}
              </button>
            </div>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="rounded-xl p-4 border"
                  style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)', color: 'var(--db-primary)' }}>
                      {step.day_number}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs" style={{ color: 'var(--db-text-2)' }}>{t.dayLabel}:</span>
                      <input type="number" min={1} value={step.day_number}
                        onChange={e => updateStep(i, 'day_number', parseInt(e.target.value) || 1)}
                        className="w-14 px-2 py-1 border rounded-lg text-xs focus:outline-none"
                        style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
                    </div>
                    {steps.length > 1 && (
                      <button onClick={() => removeStep(i)} style={{ color: 'var(--db-text-3)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--db-text-3)'}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <textarea value={step.message} onChange={e => updateStep(i, 'message', e.target.value)}
                    placeholder={t.messagePlaceholder} rows={3}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none resize-none transition-colors"
                    style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3 text-xs leading-relaxed"
            style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)', color: 'var(--db-primary)' }}>
            💡 {t.sequenceInfo}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors border"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-text-2)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {t.cancel}
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--db-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {t.createSequence}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SequenceCard({ sequence, steps, subscriberCount, onToggle, onDelete, onExpand, expanded, t, lang }) {
  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--db-surface)',
        border: `1px solid ${sequence.is_active ? 'var(--db-primary)' : 'var(--db-border)'}`,
        boxShadow: 'var(--db-shadow)',
      }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: sequence.is_active ? 'var(--db-primary-bg)' : 'var(--db-icon-bg)',
                color: sequence.is_active ? 'var(--db-primary)' : 'var(--db-text-3)',
              }}>
              <Repeat size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{sequence.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  sequence.is_active
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-[#27272a] border-gray-200 dark:border-[#3f3f46] text-gray-500'
                }`}>
                  {sequence.is_active ? t.active : t.inactive}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--db-text-3)' }}>
                <span className="flex items-center gap-1"><MessageSquare size={10} />{steps.length} {t.stepsCount}</span>
                <span className="flex items-center gap-1"><Users size={10} />{subscriberCount} {t.subscribers}</span>
                <span className="flex items-center gap-1"><Clock size={10} />{new Date(sequence.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => onToggle(sequence.id, sequence.is_active)}
              className="p-2 rounded-xl transition-colors"
              style={{
                backgroundColor: sequence.is_active ? '#FFFBEB' : '#F0FDF4',
                color: sequence.is_active ? '#D97706' : '#16A34A',
              }}>
              {sequence.is_active ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={() => onDelete(sequence.id)}
              className="p-2 rounded-xl transition-colors"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              <Trash2 size={14} />
            </button>
            <button onClick={() => onExpand(sequence.id)}
              className="p-2 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--db-icon-bg)', color: 'var(--db-text-2)' }}>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="px-5 py-4 overflow-hidden border-t" style={{ borderColor: 'var(--db-border)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--db-text-3)' }}>{t.stepsTimeline}</p>
            {steps.length === 0
              ? <p className="text-sm" style={{ color: 'var(--db-text-3)' }}>{t.noSteps}</p>
              : <div className="space-y-1">{steps.sort((a, b) => a.day_number - b.day_number).map((step, i) => <StepCard key={step.id} step={step} index={i} />)}</div>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SequencesPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const [sequences, setSequences] = useState([])
  const [steps, setSteps] = useState({})
  const [subCounts, setSubCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const t = {
    ar: {
      title: 'التسلسلات', desc: 'رسائل متسلسلة تُرسل تلقائياً على مدار أيام',
      newSequence: 'تسلسل جديد', newSequenceDesc: 'صمّم سلسلة رسائل تلقائية تُرسل على مدار أيام',
      sequenceName: 'اسم التسلسل', sequenceNamePlaceholder: 'مثال: سلسلة الترحيب',
      steps: 'خطوات التسلسل', addStep: 'إضافة خطوة', dayLabel: 'اليوم',
      messagePlaceholder: 'اكتب رسالة هذه الخطوة...',
      sequenceInfo: 'سيتم إرسال كل رسالة في اليوم المحدد بعد انضمام المشترك.',
      cancel: 'إلغاء', createSequence: 'إنشاء التسلسل',
      fillName: 'يرجى إدخال اسم التسلسل', fillAllMessages: 'يرجى ملء جميع رسائل الخطوات',
      active: 'نشط', inactive: 'متوقف', stepsCount: 'خطوات', subscribers: 'مشترك',
      stepsTimeline: 'الجدول الزمني', noSteps: 'لا توجد خطوات',
      confirmDelete: 'هل أنت متأكد من حذف هذا التسلسل؟',
      empty: 'لا توجد تسلسلات بعد', emptyDesc: 'أنشئ تسلسلاً لإرسال رسائل متسلسلة لمشتركيك.',
      loading: 'جاري التحميل...', totalSequences: 'إجمالي', activeSequences: 'نشطة', totalEnrolled: 'مسجلون',
    },
    en: {
      title: 'Sequences', desc: 'Automated message series sent over multiple days',
      newSequence: 'New Sequence', newSequenceDesc: 'Design a series of messages sent automatically over days',
      sequenceName: 'Sequence Name', sequenceNamePlaceholder: 'e.g. Welcome Series',
      steps: 'Sequence Steps', addStep: 'Add Step', dayLabel: 'Day',
      messagePlaceholder: 'Write the message for this step...',
      sequenceInfo: 'Each message will be sent on the specified day after a subscriber joins.',
      cancel: 'Cancel', createSequence: 'Create Sequence',
      fillName: 'Please enter a sequence name', fillAllMessages: 'Please fill all step messages',
      active: 'Active', inactive: 'Paused', stepsCount: 'steps', subscribers: 'enrolled',
      stepsTimeline: 'Timeline', noSteps: 'No steps yet',
      confirmDelete: 'Are you sure you want to delete this sequence?',
      empty: 'No sequences yet', emptyDesc: 'Create a sequence to send automated follow-up messages.',
      loading: 'Loading...', totalSequences: 'Total', activeSequences: 'Active', totalEnrolled: 'Enrolled',
    }
  }[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: seqs } = await supabase.from('sequences').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    const seqList = seqs || []
    setSequences(seqList)
    if (seqList.length > 0) {
      const ids = seqList.map(s => s.id)
      const [{ data: allSteps }, { data: allEnrolled }] = await Promise.all([
        supabase.from('sequence_steps').select('*').in('sequence_id', ids),
        supabase.from('sequence_subscribers').select('sequence_id').in('sequence_id', ids),
      ])
      const stepsMap = {}
      for (const step of allSteps || []) {
        if (!stepsMap[step.sequence_id]) stepsMap[step.sequence_id] = []
        stepsMap[step.sequence_id].push(step)
      }
      setSteps(stepsMap)
      const countMap = {}
      for (const row of allEnrolled || []) { countMap[row.sequence_id] = (countMap[row.sequence_id] || 0) + 1 }
      setSubCounts(countMap)
    }
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async ({ name, steps: newSteps }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: seq } = await supabase.from('sequences').insert({ user_id: user.id, name, is_active: true }).select().single()
    if (!seq) return
    const { data: insertedSteps } = await supabase.from('sequence_steps').insert(newSteps.map(s => ({ sequence_id: seq.id, day_number: s.day_number, message: s.message }))).select()
    setSequences(prev => [seq, ...prev])
    setSteps(prev => ({ ...prev, [seq.id]: insertedSteps || [] }))
    setSubCounts(prev => ({ ...prev, [seq.id]: 0 }))
    setShowModal(false)
  }

  const handleToggle = async (id, currentStatus) => {
    const supabase = createClient()
    await supabase.from('sequences').update({ is_active: !currentStatus }).eq('id', id)
    setSequences(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s))
  }

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return
    const supabase = createClient()
    await supabase.from('sequences').delete().eq('id', id)
    setSequences(prev => prev.filter(s => s.id !== id))
  }

  const totalEnrolled = Object.values(subCounts).reduce((a, b) => a + b, 0)
  const activeCount = sequences.filter(s => s.is_active).length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm animate-pulse" style={{ color: 'var(--db-text-3)' }}>
        <Repeat className="w-4 h-4" /> {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>
      {showModal && <NewSequenceModal onClose={() => setShowModal(false)} onCreate={handleCreate} t={t} lang={lang} />}

      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--db-primary)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
            <Plus size={15} /> {t.newSequence}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: t.totalSequences, value: sequences.length,   color: 'var(--db-text-h)' },
            { label: t.activeSequences, value: activeCount,       color: '#16A34A' },
            { label: t.totalEnrolled,   value: totalEnrolled,     color: 'var(--db-primary)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--db-text-2)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {sequences.length === 0 ? (
          <div className="rounded-2xl p-16 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--db-icon-bg)' }}>
              <Repeat size={24} style={{ color: 'var(--db-text-3)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.empty}</p>
            <p className="text-sm mb-5" style={{ color: 'var(--db-text-3)' }}>{t.emptyDesc}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <Plus size={15} /> {t.newSequence}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sequences.map(seq => (
              <SequenceCard key={seq.id} sequence={seq} steps={steps[seq.id] || []} subscriberCount={subCounts[seq.id] || 0}
                onToggle={handleToggle} onDelete={handleDelete}
                onExpand={id => setExpandedId(expandedId === id ? null : id)}
                expanded={expandedId === seq.id} t={t} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
