import { Handle, Position } from '@xyflow/react'
import { Zap, MessageSquare, Filter, Play, Clock, Webhook, Type, Image, MousePointerClick, Link2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const CARD_TYPE_ICONS = {
  text: Type,
  image: Image,
  buttons: MousePointerClick,
  quickReply: MessageSquare,
  link: Link2,
}

const getNodeDetails = (type, lang) => {
  const t = {
    ar: { trigger: 'مشغّل', action: 'إجراء', condition: 'شرط', delay: 'تأخير', webhook: 'Webhook', node: 'عنصر' },
    en: { trigger: 'Trigger', action: 'Action', condition: 'Condition', delay: 'Delay', webhook: 'Webhook', node: 'Node' }
  }
  const translation = t[lang] || t.en

  switch (type) {
    case 'trigger':
      return {
        icon: <Play size={14} />,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/30',
        accent: 'bg-blue-500',
        label: translation.trigger
      }
    case 'action':
      return {
        icon: <MessageSquare size={14} />,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        border: 'border-purple-200 dark:border-purple-500/30',
        accent: 'bg-purple-500',
        label: translation.action
      }
    case 'condition':
      return {
        icon: <Filter size={14} />,
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        border: 'border-orange-200 dark:border-orange-500/30',
        accent: 'bg-orange-500',
        label: translation.condition
      }
    case 'delay':
      return {
        icon: <Clock size={14} />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-500/10',
        border: 'border-yellow-200 dark:border-yellow-500/30',
        accent: 'bg-yellow-500',
        label: translation.delay
      }
    case 'webhook':
      return {
        icon: <Webhook size={14} />,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-500/10',
        border: 'border-green-200 dark:border-green-500/30',
        accent: 'bg-green-500',
        label: translation.webhook
      }
    default:
      return {
        icon: <Zap size={14} />,
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-100 dark:bg-gray-500/10',
        border: 'border-gray-200 dark:border-gray-500/30',
        accent: 'bg-gray-400',
        label: translation.node
      }
  }
}

export default function CustomNode({ data, selected }) {
  const { lang } = useLanguage()
  const details = getNodeDetails(data.type, lang)
  const cards = data.cards || []

  const uiText = {
    ar: {
      untitled: 'عنصر غير مسمى',
      cards: 'كرت',
      cardsPlural: 'كروت',
      noCards: 'لا توجد رسائل بعد',
      keyword: 'الكلمة المفتاحية',
      condition: 'الشرط',
      waiting: 'في انتظار الحدث...',
    },
    en: {
      untitled: 'Untitled Node',
      cards: 'card',
      cardsPlural: 'cards',
      noCards: 'No messages yet',
      keyword: 'Keyword',
      condition: 'Condition',
      waiting: 'Waiting for event...',
    }
  }[lang] || {}

  return (
    <div
      className={`
        relative min-w-[240px] max-w-[280px] rounded-xl transition-all duration-200
        border bg-white dark:bg-[#171717] shadow-sm
        ${selected
          ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10 border-transparent'
          : `${details.border} hover:shadow-md`
        }
      `}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Accent top bar */}
      <div className={`h-0.5 w-full rounded-t-xl ${details.accent} opacity-60`} />

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-300 dark:!bg-gray-600 !border-2 !border-white dark:!border-[#171717] !top-[-6px] hover:!bg-blue-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-gray-300 dark:!bg-gray-600 !border-2 !border-white dark:!border-[#171717] !bottom-[-6px] hover:!bg-blue-400 transition-colors"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 dark:border-[#27272a]">
        <div className={`p-1.5 rounded-lg ${details.bg} ${details.color} flex-shrink-0`}>
          {details.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold leading-none mb-0.5">
            {details.label}
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {data.label || uiText.untitled}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">

        {/* TRIGGER */}
        {data.type === 'trigger' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              <span className="truncate">{data.triggerType || uiText.waiting}</span>
            </div>
            {data.keyword && (
              <div className="flex items-center gap-1.5 text-[10px] bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg px-2 py-1">
                <span className="text-gray-400 dark:text-gray-500">{uiText.keyword}:</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold truncate">{data.keyword}</span>
              </div>
            )}
          </div>
        )}

        {/* ACTION — Cards Preview */}
        {data.type === 'action' && (
          <div className="space-y-1.5">
            {cards.length === 0 ? (
              <div className="text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-black/20 border border-dashed border-gray-200 dark:border-[#27272a] rounded-lg px-3 py-2 text-center">
                {uiText.noCards}
              </div>
            ) : (
              <>
                {/* Cards mini preview */}
                <div className="space-y-1">
                  {cards.slice(0, 3).map((card) => {
                    const IconComp = CARD_TYPE_ICONS[card.type]
                    const preview = card.type === 'text'
                      ? (card.data?.text || '').slice(0, 40) + ((card.data?.text || '').length > 40 ? '…' : '')
                      : card.type === 'image'
                        ? (card.data?.url ? (lang === 'ar' ? 'صورة' : 'Image') : (lang === 'ar' ? 'صورة فارغة' : 'Empty image'))
                        : card.type === 'buttons'
                          ? `${card.data?.buttons?.length || 0} ${lang === 'ar' ? 'أزرار' : 'buttons'}`
                          : card.type === 'quickReply'
                            ? `${card.data?.replies?.length || 0} ${lang === 'ar' ? 'ردود سريعة' : 'quick replies'}`
                            : card.data?.title || card.data?.url || ''

                    return (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-[#27272a] rounded-lg px-2 py-1.5"
                      >
                        {IconComp && <IconComp size={10} className="text-gray-400 dark:text-gray-600 flex-shrink-0" />}
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate flex-1">
                          {preview || (lang === 'ar' ? 'فارغ' : 'Empty')}
                        </span>
                      </div>
                    )
                  })}
                  {cards.length > 3 && (
                    <div className="text-[10px] text-gray-400 dark:text-gray-600 text-center py-0.5">
                      +{cards.length - 3} {lang === 'ar' ? 'كروت أخرى' : 'more cards'}
                    </div>
                  )}
                </div>

                {/* Cards count badge */}
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-600">
                    {cards.length} {cards.length === 1 ? uiText.cards : uiText.cardsPlural}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* CONDITION */}
        {data.type === 'condition' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg px-2 py-1.5">
              <span className="text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إذا' : 'If'}</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold truncate">
                {data.conditionType || 'contains'}
              </span>
              {data.condition && (
                <>
                  <span className="text-gray-400">:</span>
                  <span className="text-orange-700 dark:text-orange-300 font-semibold truncate">{data.condition}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* DELAY */}
        {data.type === 'delay' && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} className="text-yellow-500" />
            <span>{data.delayTime || '0'}{lang === 'ar' ? ' ثانية' : 's delay'}</span>
          </div>
        )}

        {/* WEBHOOK */}
        {data.type === 'webhook' && (
          <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-[#27272a] rounded-lg px-2 py-1.5 font-mono truncate">
            {data.webhookUrl || 'https://...'}
          </div>
        )}
      </div>
    </div>
  )
}