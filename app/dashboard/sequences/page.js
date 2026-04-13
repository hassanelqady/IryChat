'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  Repeat, Plus, Trash2, ArrowLeft, ArrowRight,
  Play, Pause, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, Clock, Users, MessageSquare, X,
  GripVertical, Zap, Calendar
} from 'lucide-react'

// ─── Step Card (inside sequence) ───────────────────────────
function StepCard({ step, index, onRemove, isRTL }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3"
    >
      {/* Day bubble */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
          {step.day_number}
        </div>
        {index < 99 && <div className="w-px h-4 bg-white/10 mt-1" />}
      </div>
      {/* Message */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 mb-2">
        <div className="flex justify-between items-start gap-2">
          <p className="text-gray-300 text-sm leading-relaxed flex-1">{step.message}</p>
          {onRemove && (
            <button onClick={() => onRemove(index)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── New Sequence Modal ─────────────────────────────────────
function NewSequenceModal({ subscribers, onClose, onCreate, t, lang, isRTL }) {
  const [name, setName] = useState('')
  const [steps, setSteps] = useState([{ day_number: 1, message: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addStep = () => {
    const nextDay = (steps[steps.length - 1]?.day_number || 0) + 1
    setSteps([...steps, { day_number: nextDay, message: '' }])
  }

  const removeStep = (index) => {
    if (steps.length === 1) return
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index, field, value) => {
    setSteps(steps.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const handleSubmit = async () => {
    if (!name.trim()) { setError(t.fillName); return }
    const invalidSteps = steps.filter(s => !s.message.trim())
    if (invalidSteps.length > 0) { setError(t.fillAllMessages); return }
    setLoading(true)
    setError('')
    await onCreate({ name, steps })
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{t.newSequence}</h2>
            <p className="text-gray-400 text-sm mt-1">{t.newSequenceDesc}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Sequence Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t.sequenceName} *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t.sequenceNamePlaceholder}
            className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm transition-all"
          />
        </div>

        {/* Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-400">{t.steps} *</label>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/20 transition-all"
            >
              <Plus size={13} />
              {t.addStep}
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-400 text-xs font-bold">{step.day_number}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-xs text-gray-500">{t.dayLabel}:</label>
                      <input
                        type="number"
                        min={1}
                        value={step.day_number}
                        onChange={e => updateStep(i, 'day_number', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button onClick={() => removeStep(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={step.message}
                    onChange={e => updateStep(i, 'message', e.target.value)}
                    placeholder={t.messagePlaceholder}
                    rows={3}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none transition-all"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-blue-300 text-xs leading-relaxed">
          💡 {t.sequenceInfo}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-sm font-medium transition-all">
            {t.cancel}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              : <><CheckCircle2 size={16} />{t.createSequence}</>
            }
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Sequence Card ──────────────────────────────────────────
function SequenceCard({ sequence, steps, subscriberCount, onToggle, onDelete, onExpand, expanded, t, lang, isRTL, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`bg-white/5 backdrop-blur-md border rounded-2xl overflow-hidden transition-all ${sequence.is_active ? 'border-cyan-500/20' : 'border-white/10'}`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${sequence.is_active ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>
              <Repeat size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-white font-semibold">{sequence.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sequence.is_active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                  {sequence.is_active ? t.active : t.inactive}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageSquare size={11} />
                  {steps.length} {t.stepsCount}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} />
                  {subscriberCount} {t.subscribers}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(sequence.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onToggle(sequence.id, sequence.is_active)}
              className={`p-2 rounded-xl transition-all ${sequence.is_active ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
              title={sequence.is_active ? t.pause : t.activate}
            >
              {sequence.is_active ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => onDelete(sequence.id)}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => onExpand(sequence.id)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 px-5 py-4"
          >
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-medium">{t.stepsTimeline}</p>
            {steps.length === 0 ? (
              <p className="text-gray-600 text-sm">{t.noSteps}</p>
            ) : (
              <div className="space-y-1">
                {steps
                  .sort((a, b) => a.day_number - b.day_number)
                  .map((step, i) => (
                    <StepCard key={step.id} step={step} index={i} isRTL={isRTL} />
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function SequencesPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const [sequences, setSequences] = useState([])
  const [steps, setSteps] = useState({})           // { sequenceId: [steps] }
  const [subCounts, setSubCounts] = useState({})   // { sequenceId: count }
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const content = {
    ar: {
      title: 'التسلسلات',
      desc: 'رسائل متسلسلة تُرسل تلقائياً على مدار أيام',
      newSequence: 'تسلسل جديد',
      newSequenceDesc: 'صمّم سلسلة رسائل تلقائية تُرسل على مدار أيام',
      sequenceName: 'اسم التسلسل',
      sequenceNamePlaceholder: 'مثال: سلسلة الترحيب',
      steps: 'خطوات التسلسل',
      addStep: 'إضافة خطوة',
      dayLabel: 'اليوم',
      messagePlaceholder: 'اكتب رسالة هذه الخطوة...',
      sequenceInfo: 'سيتم إرسال كل رسالة في اليوم المحدد بعد انضمام المشترك للتسلسل. يتوقف التسلسل تلقائياً عند رد المشترك.',
      cancel: 'إلغاء',
      createSequence: 'إنشاء التسلسل',
      fillName: 'يرجى إدخال اسم التسلسل',
      fillAllMessages: 'يرجى ملء جميع رسائل الخطوات',
      active: 'نشط',
      inactive: 'متوقف',
      stepsCount: 'خطوات',
      subscribers: 'مشترك',
      stepsTimeline: 'الجدول الزمني',
      noSteps: 'لا توجد خطوات',
      pause: 'إيقاف',
      activate: 'تفعيل',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من حذف هذا التسلسل؟',
      empty: 'لا توجد تسلسلات بعد',
      emptyDesc: 'أنشئ تسلسلاً لإرسال رسائل متسلسلة لمشتركيك تلقائياً.',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      totalSequences: 'إجمالي التسلسلات',
      activeSequences: 'نشطة',
      totalEnrolled: 'مشتركون مسجلون',
    },
    en: {
      title: 'Sequences',
      desc: 'Automated message series sent over multiple days',
      newSequence: 'New Sequence',
      newSequenceDesc: 'Design a series of messages sent automatically over days',
      sequenceName: 'Sequence Name',
      sequenceNamePlaceholder: 'e.g. Welcome Series',
      steps: 'Sequence Steps',
      addStep: 'Add Step',
      dayLabel: 'Day',
      messagePlaceholder: 'Write the message for this step...',
      sequenceInfo: 'Each message will be sent on the specified day after a subscriber joins. The sequence stops automatically when the subscriber replies.',
      cancel: 'Cancel',
      createSequence: 'Create Sequence',
      fillName: 'Please enter a sequence name',
      fillAllMessages: 'Please fill all step messages',
      active: 'Active',
      inactive: 'Paused',
      stepsCount: 'steps',
      subscribers: 'enrolled',
      stepsTimeline: 'Timeline',
      noSteps: 'No steps yet',
      pause: 'Pause',
      activate: 'Activate',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this sequence?',
      empty: 'No sequences yet',
      emptyDesc: 'Create a sequence to send automated follow-up messages to your subscribers.',
      back: 'Back',
      loading: 'Loading...',
      totalSequences: 'Total Sequences',
      activeSequences: 'Active',
      totalEnrolled: 'Enrolled',
    }
  }

  const t = content[lang]

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: seqs } = await supabase
      .from('sequences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const seqList = seqs || []
    setSequences(seqList)

    // Load steps + subscriber counts for each sequence
    if (seqList.length > 0) {
      const ids = seqList.map(s => s.id)

      const [{ data: allSteps }, { data: allEnrolled }, { data: subs }] = await Promise.all([
        supabase.from('sequence_steps').select('*').in('sequence_id', ids),
        supabase.from('sequence_subscribers').select('sequence_id').in('sequence_id', ids),
        supabase.from('subscribers').select('id').eq('user_id', user.id),
      ])

      // Group steps by sequence
      const stepsMap = {}
      for (const step of allSteps || []) {
        if (!stepsMap[step.sequence_id]) stepsMap[step.sequence_id] = []
        stepsMap[step.sequence_id].push(step)
      }
      setSteps(stepsMap)

      // Count enrolled per sequence
      const countMap = {}
      for (const row of allEnrolled || []) {
        countMap[row.sequence_id] = (countMap[row.sequence_id] || 0) + 1
      }
      setSubCounts(countMap)
      setSubscribers(subs || [])
    }

    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  const handleCreate = async ({ name, steps: newSteps }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: seq } = await supabase
      .from('sequences')
      .insert({ user_id: user.id, name, is_active: true })
      .select()
      .single()

    if (!seq) return

    // Insert all steps
    const stepsToInsert = newSteps.map(s => ({
      sequence_id: seq.id,
      day_number: s.day_number,
      message: s.message,
    }))
    const { data: insertedSteps } = await supabase.from('sequence_steps').insert(stepsToInsert).select()

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
    setSteps(prev => { const n = {...prev}; delete n[id]; return n })
  }

  const handleExpand = (id) => setExpandedId(expandedId === id ? null : id)

  // Stats
  const totalEnrolled = Object.values(subCounts).reduce((a, b) => a + b, 0)
  const activeCount = sequences.filter(s => s.is_active).length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Repeat className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <NewSequenceModal
            subscribers={subscribers}
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
            t={t}
            lang={lang}
            isRTL={isRTL}
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
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Plus size={18} />
              {t.newSequence}
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.totalSequences, value: sequences.length, color: 'text-white' },
            { label: t.activeSequences, value: activeCount, color: 'text-green-400' },
            { label: t.totalEnrolled, value: totalEnrolled, color: 'text-cyan-400' },
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
        {sequences.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-500 mb-6">
              <Repeat size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.empty}</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">{t.emptyDesc}</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all"
            >
              <Plus size={18} />
              {t.newSequence}
            </button>
          </motion.div>
        )}

        {/* Sequences List */}
        <div className="space-y-4">
          {sequences.map((seq, i) => (
            <SequenceCard
              key={seq.id}
              sequence={seq}
              steps={steps[seq.id] || []}
              subscriberCount={subCounts[seq.id] || 0}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onExpand={handleExpand}
              expanded={expandedId === seq.id}
              t={t}
              lang={lang}
              isRTL={isRTL}
              index={i}
            />
          ))}
        </div>

           </main>
    </>
  )
}
