'use client'

import { useState } from 'react'
import { Zap, MessageSquare, Filter, Clock, Webhook, LayoutTemplate, ChevronRight, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// ============================================================
// TEMPLATES — قوالب جاهزة
// ============================================================
const TEMPLATES = {
  ar: [
    {
      id: 'welcome_dm',
      name: 'رسالة ترحيب',
      description: 'رد تلقائي على أول رسالة',
      icon: '👋',
      color: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-200 dark:border-blue-500/20',
      nodes: [
        {
          id: 't1', type: 'custom', position: { x: 250, y: 80 },
          data: {
            type: 'trigger', label: 'رسالة جديدة',
            triggerType: 'New DM', keyword: ''
          }
        },
        {
          id: 't2', type: 'custom', position: { x: 250, y: 260 },
          data: {
            type: 'action', label: 'رسالة الترحيب',
            cards: [
              {
                id: 'c1', type: 'text',
                data: { text: 'أهلاً {{first_name}}! 👋\nشكراً لتواصلك معنا. كيف يمكنني مساعدتك؟', typingIndicator: true, delay: 1 }
              },
              {
                id: 'c2', type: 'quickReply',
                data: { replies: [{ id: 'r1', label: 'الأسعار 💰' }, { id: 'r2', label: 'التواصل 📞' }, { id: 'r3', label: 'مزيد من المعلومات ℹ️' }] }
              }
            ]
          }
        },
      ],
      edges: [{ id: 'e1', source: 't1', target: 't2', animated: true, style: { stroke: '#9ca3af' } }]
    },
    {
      id: 'comment_reply',
      name: 'رد على التعليقات',
      description: 'رد تلقائي على تعليقات المنشور',
      icon: '💬',
      color: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-200 dark:border-purple-500/20',
      nodes: [
        {
          id: 't1', type: 'custom', position: { x: 250, y: 80 },
          data: {
            type: 'trigger', label: 'تعليق جديد',
            triggerType: 'New Comment', keyword: 'سعر'
          }
        },
        {
          id: 't2', type: 'custom', position: { x: 250, y: 260 },
          data: {
            type: 'action', label: 'الرد على التعليق',
            cards: [
              {
                id: 'c1', type: 'text',
                data: { text: 'شكراً على اهتمامك {{first_name}}! 🙏\nسنرسل لك تفاصيل الأسعار الآن.', typingIndicator: true, delay: 0 }
              }
            ]
          }
        },
        {
          id: 't3', type: 'custom', position: { x: 250, y: 440 },
          data: {
            type: 'action', label: 'رسالة خاصة',
            cards: [
              {
                id: 'c1', type: 'text',
                data: { text: 'مرحباً {{first_name}}!\nإليك قائمة أسعارنا الكاملة:', typingIndicator: true, delay: 1 }
              },
              {
                id: 'c2', type: 'buttons',
                data: {
                  buttons: [
                    { id: 'b1', label: 'عرض الأسعار 💰', action: 'url', value: 'https://example.com/pricing' },
                    { id: 'b2', label: 'تواصل معنا 📞', action: 'none', value: '' }
                  ]
                }
              }
            ]
          }
        },
      ],
      edges: [
        { id: 'e1', source: 't1', target: 't2', animated: true, style: { stroke: '#9ca3af' } },
        { id: 'e2', source: 't2', target: 't3', animated: true, style: { stroke: '#9ca3af' } }
      ]
    },
    {
      id: 'lead_capture',
      name: 'جمع العملاء المحتملين',
      description: 'بناء قائمة مشتركين تلقائياً',
      icon: '🎯',
      color: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      nodes: [
        {
          id: 't1', type: 'custom', position: { x: 250, y: 80 },
          data: { type: 'trigger', label: 'تعليق على المنشور', triggerType: 'New Comment', keyword: 'اشتراك' }
        },
        {
          id: 't2', type: 'custom', position: { x: 250, y: 260 },
          data: {
            type: 'action', label: 'رسالة ترحيب',
            cards: [
              { id: 'c1', type: 'text', data: { text: 'أهلاً {{first_name}}! 🎉\nشكراً على اهتمامك. هل تريد الاشتراك في قائمتنا؟', typingIndicator: true, delay: 0 } },
              { id: 'c2', type: 'quickReply', data: { replies: [{ id: 'r1', label: '✅ نعم، اشتركني' }, { id: 'r2', label: '❌ لا شكراً' }] } }
            ]
          }
        },
        {
          id: 't3', type: 'custom', position: { x: 100, y: 440 },
          data: { type: 'condition', label: 'اختار الاشتراك؟', conditionType: 'contains', condition: 'نعم' }
        },
        {
          id: 't4', type: 'custom', position: { x: 100, y: 620 },
          data: {
            type: 'action', label: 'تأكيد الاشتراك',
            cards: [
              { id: 'c1', type: 'text', data: { text: '🎉 رائع! تم تسجيلك بنجاح {{first_name}}!\nستصلك أحدث العروض والأخبار.', typingIndicator: true, delay: 0 } }
            ]
          }
        },
      ],
      edges: [
        { id: 'e1', source: 't1', target: 't2', animated: true, style: { stroke: '#9ca3af' } },
        { id: 'e2', source: 't2', target: 't3', animated: true, style: { stroke: '#9ca3af' } },
        { id: 'e3', source: 't3', target: 't4', animated: true, style: { stroke: '#9ca3af' } },
      ]
    },
  ],
  en: [
    {
      id: 'welcome_dm',
      name: 'Welcome Message',
      description: 'Auto-reply to first message',
      icon: '👋',
      color: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-200 dark:border-blue-500/20',
      nodes: [
        {
          id: 't1', type: 'custom', position: { x: 250, y: 80 },
          data: { type: 'trigger', label: 'New Message', triggerType: 'New DM', keyword: '' }
        },
        {
          id: 't2', type: 'custom', position: { x: 250, y: 260 },
          data: {
            type: 'action', label: 'Welcome Message',
            cards: [
              { id: 'c1', type: 'text', data: { text: 'Hey {{first_name}}! 👋\nThanks for reaching out. How can I help you?', typingIndicator: true, delay: 1 } },
              { id: 'c2', type: 'quickReply', data: { replies: [{ id: 'r1', label: 'Pricing 💰' }, { id: 'r2', label: 'Contact 📞' }, { id: 'r3', label: 'More Info ℹ️' }] } }
            ]
          }
        },
      ],
      edges: [{ id: 'e1', source: 't1', target: 't2', animated: true, style: { stroke: '#9ca3af' } }]
    },
  ]
}

// ============================================================
// NODE TYPES
// ============================================================
const getNodeTemplates = (lang) => [
  {
    type: 'trigger',
    labelAr: 'مشغّل', labelEn: 'Trigger',
    descAr: 'حدث يبدأ الفلو', descEn: 'Event that starts the flow',
    icon: Zap, color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20'
  },
  {
    type: 'action',
    labelAr: 'إجراء', labelEn: 'Action',
    descAr: 'إرسال رسالة أو كروت', descEn: 'Send messages or cards',
    icon: MessageSquare, color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-100 dark:border-purple-500/20'
  },
  {
    type: 'condition',
    labelAr: 'شرط', labelEn: 'Condition',
    descAr: 'تفرع بناءً على شرط', descEn: 'Branch based on condition',
    icon: Filter, color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-100 dark:border-orange-500/20'
  },
  {
    type: 'delay',
    labelAr: 'تأخير', labelEn: 'Delay',
    descAr: 'انتظر قبل الخطوة التالية', descEn: 'Wait before next step',
    icon: Clock, color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-100 dark:border-yellow-500/20'
  },
  {
    type: 'webhook',
    labelAr: 'Webhook', labelEn: 'Webhook',
    descAr: 'إرسال بيانات لـ URL خارجي', descEn: 'Send data to external URL',
    icon: Webhook, color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-100 dark:border-green-500/20'
  },
]

export default function FlowSidebar({ onLoadTemplate }) {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('elements')
  const nodeTemplates = getNodeTemplates(lang)
  const templates = TEMPLATES[lang] || TEMPLATES.en

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const t = {
    ar: {
      elements: 'العناصر', templates: 'القوالب',
      elementsSubtitle: 'اسحب إلى المساحة',
      templatesSubtitle: 'قوالب جاهزة للاستخدام',
      loadTemplate: 'استخدم القالب',
      footer: 'IryChat Flow Builder',
    },
    en: {
      elements: 'Elements', templates: 'Templates',
      elementsSubtitle: 'Drag to canvas',
      templatesSubtitle: 'Ready-to-use templates',
      loadTemplate: 'Use template',
      footer: 'IryChat Flow Builder',
    }
  }[lang]

  return (
    <div
      className="w-64 border-r border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#171717] flex flex-col h-full select-none transition-colors duration-200"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-[#27272a]">
        {[
          { id: 'elements', labelAr: 'العناصر', labelEn: 'Elements', icon: Zap },
          { id: 'templates', labelAr: 'قوالب', labelEn: 'Templates', icon: LayoutTemplate },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
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

      {/* ELEMENTS TAB */}
      {activeTab === 'elements' && (
        <>
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] text-gray-400 dark:text-gray-600">{t.elementsSubtitle}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {nodeTemplates.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${item.border} bg-white dark:bg-[#0a0a0a] cursor-grab hover:shadow-sm active:cursor-grabbing transition-all group`}
                >
                  <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
                    <Icon size={14} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${item.color}`}>
                      {lang === 'ar' ? item.labelAr : item.labelEn}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {lang === 'ar' ? item.descAr : item.descEn}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <>
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] text-gray-400 dark:text-gray-600">{t.templatesSubtitle}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border ${template.border} rounded-xl overflow-hidden bg-gradient-to-br ${template.color}`}
              >
                <div className="p-3">
                  <div className="flex items-start gap-2.5 mb-2">
                    <span className="text-xl leading-none">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{template.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2.5">
                    <span className="text-[9px] text-gray-400 dark:text-gray-500">
                      {template.nodes.length} {lang === 'ar' ? 'عناصر' : 'nodes'}
                    </span>
                    <span className="text-[9px] text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500">
                      {template.edges.length} {lang === 'ar' ? 'روابط' : 'connections'}
                    </span>
                  </div>
                  <button
                    onClick={() => onLoadTemplate && onLoadTemplate(template)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 border border-gray-200 dark:border-[#27272a] rounded-lg text-[11px] font-medium text-gray-700 dark:text-gray-300 transition-all group"
                  >
                    {t.loadTemplate}
                    <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-[#27272a] text-[10px] text-gray-400 dark:text-gray-600 text-center">
        {t.footer}
      </div>
    </div>
  )
}