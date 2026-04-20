'use client'

import { useState, useRef } from 'react'
import {
  X, Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Type, Image, MousePointerClick, MessageSquare, Link2,
  Zap, Eye, Settings, Variable, Check
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// ============================================================
// CARD TYPE REGISTRY — أضف أنواع جديدة هنا بسهولة
// ============================================================
const CARD_TYPES = {
  text: {
    id: 'text',
    labelAr: 'نص',
    labelEn: 'Text',
    icon: Type,
    color: '#6366f1',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
    borderColor: 'border-indigo-200 dark:border-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    defaultData: { text: '', typingIndicator: false, delay: 0 },
  },
  image: {
    id: 'image',
    labelAr: 'صورة',
    labelEn: 'Image',
    icon: Image,
    color: '#0ea5e9',
    bgColor: 'bg-sky-50 dark:bg-sky-500/10',
    borderColor: 'border-sky-200 dark:border-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    defaultData: { url: '', caption: '' },
  },
  buttons: {
    id: 'buttons',
    labelAr: 'أزرار',
    labelEn: 'Buttons',
    icon: MousePointerClick,
    color: '#f59e0b',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    borderColor: 'border-amber-200 dark:border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    defaultData: { buttons: [{ id: `btn-${Date.now()}`, label: '', action: 'none', value: '' }] },
  },
  quickReply: {
    id: 'quickReply',
    labelAr: 'ردود سريعة',
    labelEn: 'Quick Replies',
    icon: MessageSquare,
    color: '#10b981',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    defaultData: { replies: [{ id: `qr-${Date.now()}`, label: '' }] },
  },
  link: {
    id: 'link',
    labelAr: 'رابط',
    labelEn: 'Link',
    icon: Link2,
    color: '#8b5cf6',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    borderColor: 'border-violet-200 dark:border-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    defaultData: { url: '', title: '', description: '' },
  },
}

// ============================================================
// VARIABLES SYSTEM
// ============================================================
const VARIABLES = [
  { key: '{{first_name}}', labelAr: 'الاسم الأول', labelEn: 'First Name' },
  { key: '{{last_name}}', labelAr: 'الاسم الأخير', labelEn: 'Last Name' },
  { key: '{{username}}', labelAr: 'اسم المستخدم', labelEn: 'Username' },
  { key: '{{page_name}}', labelAr: 'اسم الصفحة', labelEn: 'Page Name' },
]

// ============================================================
// CARD EDITORS
// ============================================================

function TextCardEditor({ data, onChange, lang }) {
  const [showVars, setShowVars] = useState(false)
  const textareaRef = useRef(null)

  const insertVariable = (varKey) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newText = data.text.slice(0, start) + varKey + data.text.slice(end)
    onChange({ ...data, text: newText })
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + varKey.length, start + varKey.length)
    }, 0)
    setShowVars(false)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={data.text}
          onChange={e => onChange({ ...data, text: e.target.value })}
          rows={3}
          placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 resize-none transition-colors placeholder-gray-400 dark:placeholder-gray-600"
        />
        <button
          onClick={() => setShowVars(!showVars)}
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#27272a] border border-gray-200 dark:border-[#3f3f46] rounded text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <Variable size={10} />
          {lang === 'ar' ? 'متغير' : 'Variable'}
        </button>
      </div>
      {showVars && (
        <div className="flex flex-wrap gap-1.5">
          {VARIABLES.map(v => (
            <button
              key={v.key}
              onClick={() => insertVariable(v.key)}
              className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors font-mono"
            >
              {lang === 'ar' ? v.labelAr : v.labelEn}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => onChange({ ...data, typingIndicator: !data.typingIndicator })}
            className={`w-8 h-4 rounded-full transition-colors relative ${data.typingIndicator ? 'bg-blue-500' : 'bg-gray-200 dark:bg-[#3f3f46]'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${data.typingIndicator ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {lang === 'ar' ? 'مؤشر الكتابة' : 'Typing indicator'}
          </span>
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{lang === 'ar' ? 'تأخير' : 'Delay'}</span>
          <input
            type="number"
            value={data.delay || 0}
            onChange={e => onChange({ ...data, delay: parseInt(e.target.value) || 0 })}
            min={0} max={30}
            className="w-12 px-1 py-0.5 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded text-xs text-center text-gray-900 dark:text-white focus:outline-none"
          />
          <span className="text-xs text-gray-400">{lang === 'ar' ? 'ث' : 's'}</span>
        </div>
      </div>
    </div>
  )
}

function ImageCardEditor({ data, onChange, lang }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
          {lang === 'ar' ? 'رابط الصورة' : 'Image URL'}
        </label>
        <input
          type="text"
          value={data.url}
          onChange={e => onChange({ ...data, url: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
        />
      </div>
      {data.url && (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#27272a] aspect-video bg-gray-100 dark:bg-black/30">
          <img src={data.url} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
        </div>
      )}
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
          {lang === 'ar' ? 'التعليق (اختياري)' : 'Caption (optional)'}
        </label>
        <input
          type="text"
          value={data.caption}
          onChange={e => onChange({ ...data, caption: e.target.value })}
          placeholder={lang === 'ar' ? 'أضف تعليقاً...' : 'Add caption...'}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  )
}

function ButtonsCardEditor({ data, onChange, lang }) {
  const addButton = () => {
    if (data.buttons.length >= 3) return
    onChange({
      ...data,
      buttons: [...data.buttons, { id: `btn-${Date.now()}`, label: '', action: 'none', value: '' }]
    })
  }

  const removeButton = (id) => onChange({ ...data, buttons: data.buttons.filter(b => b.id !== id) })

  const updateButton = (id, field, value) => onChange({
    ...data,
    buttons: data.buttons.map(b => b.id === id ? { ...b, [field]: value } : b)
  })

  return (
    <div className="space-y-3">
      {data.buttons.map((btn, i) => (
        <div key={btn.id} className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-[#27272a] rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {lang === 'ar' ? `زر ${i + 1}` : `Button ${i + 1}`}
            </span>
            {data.buttons.length > 1 && (
              <button onClick={() => removeButton(btn.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <input
            type="text"
            value={btn.label}
            onChange={e => updateButton(btn.id, 'label', e.target.value)}
            placeholder={lang === 'ar' ? 'نص الزر...' : 'Button label...'}
            className="w-full px-2 py-1.5 bg-white dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <select
            value={btn.action}
            onChange={e => updateButton(btn.id, 'action', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="none">{lang === 'ar' ? 'بدون إجراء' : 'No action'}</option>
            <option value="url">{lang === 'ar' ? 'فتح رابط' : 'Open URL'}</option>
            <option value="flow">{lang === 'ar' ? 'تشغيل فلو' : 'Trigger Flow'}</option>
            <option value="call">{lang === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}</option>
          </select>
          {btn.action !== 'none' && (
            <input
              type="text"
              value={btn.value}
              onChange={e => updateButton(btn.id, 'value', e.target.value)}
              placeholder={btn.action === 'url' ? 'https://...' : btn.action === 'call' ? '+20...' : lang === 'ar' ? 'معرف الفلو...' : 'Flow ID...'}
              className="w-full px-2 py-1.5 bg-white dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          )}
        </div>
      ))}
      {data.buttons.length < 3 && (
        <button
          onClick={addButton}
          className="w-full py-2 border border-dashed border-gray-300 dark:border-[#3f3f46] rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-[#525252] transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={12} />
          {lang === 'ar' ? 'إضافة زر' : 'Add button'}
          <span className="opacity-50">({data.buttons.length}/3)</span>
        </button>
      )}
    </div>
  )
}

function QuickReplyCardEditor({ data, onChange, lang }) {
  const addReply = () => {
    if (data.replies.length >= 11) return
    onChange({ ...data, replies: [...data.replies, { id: `qr-${Date.now()}`, label: '' }] })
  }

  const removeReply = (id) => onChange({ ...data, replies: data.replies.filter(r => r.id !== id) })

  const updateReply = (id, value) => onChange({
    ...data,
    replies: data.replies.map(r => r.id === id ? { ...r, label: value } : r)
  })

  return (
    <div className="space-y-2">
      {data.replies.map((reply, i) => (
        <div key={reply.id} className="flex items-center gap-2">
          <input
            type="text"
            value={reply.label}
            onChange={e => updateReply(reply.id, e.target.value)}
            placeholder={lang === 'ar' ? `رد سريع ${i + 1}...` : `Quick reply ${i + 1}...`}
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          {data.replies.length > 1 && (
            <button onClick={() => removeReply(reply.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {data.replies.length < 11 && (
        <button
          onClick={addReply}
          className="w-full py-2 border border-dashed border-gray-300 dark:border-[#3f3f46] rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={12} />
          {lang === 'ar' ? 'إضافة رد سريع' : 'Add quick reply'}
        </button>
      )}
    </div>
  )
}

function LinkCardEditor({ data, onChange, lang }) {
  return (
    <div className="space-y-3">
      {[
        { field: 'url', labelAr: 'الرابط', labelEn: 'URL', placeholder: 'https://...' },
        { field: 'title', labelAr: 'العنوان', labelEn: 'Title', placeholder: lang === 'ar' ? 'عنوان الرابط...' : 'Link title...' },
        { field: 'description', labelAr: 'الوصف', labelEn: 'Description', placeholder: lang === 'ar' ? 'وصف مختصر...' : 'Short description...' },
      ].map(({ field, labelAr, labelEn, placeholder }) => (
        <div key={field}>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {lang === 'ar' ? labelAr : labelEn}
          </label>
          <input
            type="text"
            value={data[field] || ''}
            onChange={e => onChange({ ...data, [field]: e.target.value })}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      ))}
    </div>
  )
}

const CARD_EDITORS = {
  text: TextCardEditor,
  image: ImageCardEditor,
  buttons: ButtonsCardEditor,
  quickReply: QuickReplyCardEditor,
  link: LinkCardEditor,
}

// ============================================================
// LIVE PREVIEW
// ============================================================
function LivePreview({ cards, lang }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-xs">
        {lang === 'ar' ? 'أضف كروت لمعاينة الرسالة' : 'Add cards to preview'}
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3 bg-gray-50 dark:bg-black/20 rounded-xl min-h-[80px]">
      {cards.map(card => {
        const def = CARD_TYPES[card.type]
        if (!def) return null

        return (
          <div key={card.id} className="flex gap-2 items-end">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px]">🤖</span>
            </div>
            <div className="max-w-[85%]">
              {card.type === 'text' && card.data.text && (
                <div className="bg-white dark:bg-[#27272a] rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-[#3f3f46]">
                  {card.data.text}
                </div>
              )}
              {card.type === 'image' && card.data.url && (
                <div className="rounded-2xl rounded-bl-sm overflow-hidden w-40 shadow-sm">
                  <img src={card.data.url} alt="" className="w-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  {card.data.caption && (
                    <div className="bg-white dark:bg-[#27272a] px-2 py-1 text-[10px] text-gray-600 dark:text-gray-400">
                      {card.data.caption}
                    </div>
                  )}
                </div>
              )}
              {card.type === 'buttons' && (
                <div className="space-y-1">
                  <div className="bg-white dark:bg-[#27272a] rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-[#3f3f46]">
                    {lang === 'ar' ? 'اختر خياراً:' : 'Choose an option:'}
                  </div>
                  {card.data.buttons?.map(btn => btn.label && (
                    <div key={btn.id} className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                      {btn.label}
                    </div>
                  ))}
                </div>
              )}
              {card.type === 'quickReply' && (
                <div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.data.replies?.map(r => r.label && (
                      <div key={r.id} className="bg-white dark:bg-[#27272a] border border-gray-200 dark:border-[#3f3f46] rounded-full px-2 py-0.5 text-[10px] text-gray-700 dark:text-gray-300 cursor-pointer hover:border-blue-400 transition-colors">
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {card.type === 'link' && card.data.url && (
                <div className="bg-white dark:bg-[#27272a] rounded-2xl rounded-bl-sm overflow-hidden shadow-sm border border-gray-100 dark:border-[#3f3f46] w-48">
                  <div className="h-1 bg-blue-500" />
                  <div className="p-2">
                    <div className="text-[10px] font-medium text-gray-800 dark:text-gray-200 truncate">{card.data.title || card.data.url}</div>
                    {card.data.description && (
                      <div className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{card.data.description}</div>
                    )}
                    <div className="text-[9px] text-blue-500 mt-1 truncate">{card.data.url}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// SINGLE CARD COMPONENT
// ============================================================
function CardItem({ card, index, total, onUpdate, onDelete, onMoveUp, onMoveDown, lang, dragHandleProps }) {
  const [collapsed, setCollapsed] = useState(false)
  const def = CARD_TYPES[card.type]
  if (!def) return null

  const CardIcon = def.icon
  const Editor = CARD_EDITORS[card.type]

  return (
    <div className={`border ${def.borderColor} rounded-xl overflow-hidden transition-all duration-200`}>
      {/* Card Header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 ${def.bgColor}`}>
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 flex-shrink-0"
        >
          <GripVertical size={14} />
        </div>
        <div className={`${def.iconColor} flex-shrink-0`}>
          <CardIcon size={13} />
        </div>
        <span className={`text-xs font-semibold ${def.iconColor} flex-1`}>
          {lang === 'ar' ? def.labelAr : def.labelEn}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-0.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-0.5"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      {!collapsed && (
        <div className="p-3 bg-white dark:bg-[#171717]">
          <Editor
            data={card.data}
            onChange={(newData) => onUpdate(card.id, newData)}
            lang={lang}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADD CARD MENU
// ============================================================
function AddCardMenu({ onAdd, lang }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-[#27272a] rounded-xl text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-[#3f3f46] transition-all flex items-center justify-center gap-1.5 group"
      >
        <Plus size={13} className="group-hover:rotate-90 transition-transform duration-200" />
        {lang === 'ar' ? 'إضافة كارت' : 'Add card'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-xl overflow-hidden">
            {Object.values(CARD_TYPES).map(def => {
              const Icon = def.icon
              return (
                <button
                  key={def.id}
                  onClick={() => { onAdd(def.id); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-lg ${def.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={13} className={def.iconColor} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {lang === 'ar' ? def.labelAr : def.labelEn}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// TRIGGER SETTINGS PANEL
// ============================================================
function TriggerSettings({ data, onChange, lang }) {
  const t = {
    ar: { label: 'الاسم', triggerType: 'نوع المشغّل', keyword: 'الكلمة المفتاحية', keywordHint: 'الكلمة التي تُشغّل هذه الأتمتة' },
    en: { label: 'Label', triggerType: 'Trigger Type', keyword: 'Keyword', keywordHint: 'The word that triggers this automation' },
  }[lang]

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.label}</label>
        <input
          type="text"
          value={data.label || ''}
          onChange={e => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.triggerType}</label>
        <select
          value={data.triggerType || ''}
          onChange={e => onChange({ ...data, triggerType: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="New Comment">{lang === 'ar' ? 'تعليق جديد' : 'New Comment'}</option>
          <option value="New DM">{lang === 'ar' ? 'رسالة مباشرة' : 'New DM'}</option>
          <option value="New Mention">{lang === 'ar' ? 'إشارة جديدة' : 'New Mention'}</option>
          <option value="Story Reply">{lang === 'ar' ? 'رد على ستوري' : 'Story Reply'}</option>
          <option value="Post Reaction">{lang === 'ar' ? 'تفاعل على منشور' : 'Post Reaction'}</option>
        </select>
      </div>
      {(data.triggerType === 'New Comment' || data.triggerType === 'New DM') && (
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.keyword}</label>
          <input
            type="text"
            value={data.keyword || ''}
            onChange={e => onChange({ ...data, keyword: e.target.value })}
            placeholder={lang === 'ar' ? 'مثال: سعر، معلومات...' : 'e.g., price, info...'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{t.keywordHint}</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// CONDITION SETTINGS PANEL
// ============================================================
function ConditionSettings({ data, onChange, lang }) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          {lang === 'ar' ? 'الاسم' : 'Label'}
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={e => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          {lang === 'ar' ? 'الشرط' : 'Condition'}
        </label>
        <select
          value={data.conditionType || 'contains'}
          onChange={e => onChange({ ...data, conditionType: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors mb-2"
        >
          <option value="contains">{lang === 'ar' ? 'يحتوي على' : 'Contains'}</option>
          <option value="equals">{lang === 'ar' ? 'يساوي' : 'Equals'}</option>
          <option value="starts_with">{lang === 'ar' ? 'يبدأ بـ' : 'Starts with'}</option>
          <option value="ends_with">{lang === 'ar' ? 'ينتهي بـ' : 'Ends with'}</option>
          <option value="is_subscribed">{lang === 'ar' ? 'مشترك' : 'Is subscribed'}</option>
        </select>
        {!['is_subscribed'].includes(data.conditionType) && (
          <input
            type="text"
            value={data.condition || ''}
            onChange={e => onChange({ ...data, condition: e.target.value })}
            placeholder={lang === 'ar' ? 'القيمة...' : 'Value...'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        )}
      </div>
    </div>
  )
}

// ============================================================
// ACTION SETTINGS — CARDS SYSTEM
// ============================================================
function ActionSettings({ data, onChange, lang }) {
  const cards = data.cards || []

  const addCard = (type) => {
    const def = CARD_TYPES[type]
    if (!def) return
    const newCard = {
      id: `card-${Date.now()}`,
      type,
      data: { ...def.defaultData },
    }
    onChange({ ...data, cards: [...cards, newCard] })
  }

  const updateCard = (cardId, newCardData) => {
    onChange({
      ...data,
      cards: cards.map(c => c.id === cardId ? { ...c, data: newCardData } : c)
    })
  }

  const deleteCard = (cardId) => {
    onChange({ ...data, cards: cards.filter(c => c.id !== cardId) })
  }

  const moveCard = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= cards.length) return
    const newCards = [...cards]
    const [moved] = newCards.splice(fromIndex, 1)
    newCards.splice(toIndex, 0, moved)
    onChange({ ...data, cards: newCards })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Label */}
      <div className="p-4 border-b border-gray-100 dark:border-[#27272a]">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          {lang === 'ar' ? 'اسم الإجراء' : 'Action name'}
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={e => onChange({ ...data, label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#27272a] rounded-xl flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {lang === 'ar' ? 'لا توجد كروت بعد' : 'No cards yet'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              {lang === 'ar' ? 'أضف كارت لبناء رسالتك' : 'Add a card to build your message'}
            </p>
          </div>
        )}
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            total={cards.length}
            onUpdate={updateCard}
            onDelete={deleteCard}
            onMoveUp={(i) => moveCard(i, i - 1)}
            onMoveDown={(i) => moveCard(i, i + 1)}
            lang={lang}
            dragHandleProps={{}}
          />
        ))}
        <AddCardMenu onAdd={addCard} lang={lang} />
      </div>
    </div>
  )
}

// ============================================================
// MAIN PANEL
// ============================================================
export default function NodeConfigPanel({ node, onClose, onUpdate }) {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('settings')

  if (!node || !node.data) return null

  const handleChange = (newData) => {
    onUpdate(node.id, newData)
  }

  const isAction = node.data.type === 'action'
  const isTrigger = node.data.type === 'trigger'
  const isCondition = node.data.type === 'condition'

  const title = {
    ar: { trigger: 'إعدادات المشغّل', action: 'إعدادات الإجراء', condition: 'إعدادات الشرط', node: 'إعدادات العنصر' },
    en: { trigger: 'Trigger Settings', action: 'Action Settings', condition: 'Condition Settings', node: 'Node Settings' },
  }[lang][node.data.type] || (lang === 'ar' ? 'إعدادات العنصر' : 'Node Settings')

  return (
    <div
      className="w-80 border-l border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#171717] flex flex-col h-full shadow-xl"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#27272a] flex-shrink-0">
        <div className="flex items-center gap-2">
          {isTrigger && <Zap size={14} className="text-blue-500" />}
          {isAction && <MessageSquare size={14} className="text-purple-500" />}
          {isCondition && <Settings size={14} className="text-orange-500" />}
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#27272a] rounded-lg transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs — فقط للـ Action */}
      {isAction && (
        <div className="flex border-b border-gray-200 dark:border-[#27272a] flex-shrink-0">
          {[
            { id: 'settings', labelAr: 'الكروت', labelEn: 'Cards', icon: MessageSquare },
            { id: 'preview', labelAr: 'معاينة', labelEn: 'Preview', icon: Eye },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={12} />
                {lang === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isTrigger && <TriggerSettings data={node.data} onChange={handleChange} lang={lang} />}
        {isCondition && <ConditionSettings data={node.data} onChange={handleChange} lang={lang} />}
        {isAction && activeTab === 'settings' && (
          <ActionSettings data={node.data} onChange={handleChange} lang={lang} />
        )}
        {isAction && activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-3">
              {lang === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
            </p>
            <LivePreview cards={node.data.cards || []} lang={lang} />
          </div>
        )}
        {!isTrigger && !isCondition && !isAction && (
          <div className="p-4 space-y-3">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              {lang === 'ar' ? 'الاسم' : 'Label'}
            </label>
            <input
              type="text"
              value={node.data.label || ''}
              onChange={e => handleChange({ ...node.data, label: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#27272a] flex-shrink-0">
        <p className="text-[10px] text-gray-400 dark:text-gray-600">
          ID: {node.id} · {node.data.type}
        </p>
      </div>
    </div>
  )
}