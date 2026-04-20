'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  ArrowLeft, ArrowRight, Plus, X,
  Image as ImageIcon, Save, Loader2, Check,
  MessageCircle, Heart, Bookmark, Send
} from 'lucide-react'
import Link from 'next/link'

// ============================================================
// TEMPLATE DEFAULTS — مع قيم افتراضية لكل لغة
// ============================================================
const TEMPLATE_DEFAULTS = {
  comment_dm_link: {
    nameAr: 'روابط الرسائل من التعليقات',
    nameEn: 'Auto-DM links from comments',
    openingDM: {
      ar: 'مرحباً! شكراً على اهتمامك 😊\nاضغط على الزر وسأرسل لك الرابط فوراً ✨',
      en: "Hey there! I'm so happy you're here, thanks so much for your interest 😊\nClick below and I'll send you the link in just a sec ✨"
    },
    openingButton: { ar: 'أرسل لي الرابط', en: 'Send me the link' },
    finalDM: { ar: 'إليك الرابط الذي طلبته 👇', en: "Here's the link you requested 👇" },
  },
  welcome_followers: {
    nameAr: 'الترحيب بالمتابعين الجدد',
    nameEn: 'Say hi to new followers',
    openingDM: {
      ar: 'أهلاً {{first_name}}! 👋\nشكراً على متابعتك. سعيدون بوجودك معنا!',
      en: "Hey {{first_name}}! 👋\nThanks for following! So glad to have you here!"
    },
    openingButton: { ar: 'ابدأ الآن', en: 'Get started' },
    finalDM: { ar: 'إليك هديتنا الترحيبية 🎁', en: "Here's your welcome gift 🎁" },
  },
  story_leads: {
    nameAr: 'جذب العملاء من القصص',
    nameEn: 'Generate leads with stories',
    openingDM: {
      ar: 'مرحباً! رأيت ردك على قصتي 😊\nهل تريد معرفة المزيد عن العرض؟',
      en: "Hey! Saw your reply to my story 😊\nWant to know more about the offer?"
    },
    openingButton: { ar: 'نعم، أخبرني', en: 'Yes, tell me more' },
    finalDM: { ar: 'رائع! إليك كل التفاصيل 👇', en: "Awesome! Here are all the details 👇" },
  },
  default: {
    nameAr: 'أتمتة جديدة',
    nameEn: 'New Automation',
    openingDM: {
      ar: 'أهلاً! شكراً على تواصلك معنا 😊\nكيف يمكنني مساعدتك اليوم؟',
      en: "Hey! Thanks for reaching out 😊\nHow can I help you today?"
    },
    openingButton: { ar: 'ابدأ', en: 'Get started' },
    finalDM: { ar: 'إليك ما طلبته 👇', en: "Here's what you asked for 👇" },
  }
}

// ============================================================
// EXAMPLES DATA — localized, clickable
// ============================================================
const EXAMPLES = {
  keywords: {
    ar: ['سعر', 'رابط', 'تفاصيل', 'معلومات', 'عرض', 'اشتراك'],
    en: ['price', 'link', 'info', 'details', 'offer', 'join'],
  },
  commentReply: {
    ar: [
      'شكراً! تفقد رسائلك الخاصة 📩',
      'تم إرسال التفاصيل على رسائلك ✅',
      'أرسلت لك الرابط في الرسائل الخاصة 🔗',
    ],
    en: [
      'Thanks! Check your DMs 📩',
      'Sent you the details via DM ✅',
      'Check your messages for the link 🔗',
    ],
  },
  openingDM: {
    ar: [
      'مرحباً! شكراً على تواصلك 😊',
      'أهلاً {{first_name}}! سعيدون بك 👋',
      'شكراً على اهتمامك بعرضنا ✨',
    ],
    en: [
      "Hey! Thanks for reaching out 😊",
      "Hi {{first_name}}! So happy you're here 👋",
      "Thanks for your interest in our offer ✨",
    ],
  },
  finalDM: {
    ar: [
      'إليك الرابط الذي طلبته 👇',
      'هنا تجد كل التفاصيل 📋',
      'رائع! هذا هو الرابط الخاص بك 🔗',
    ],
    en: [
      "Here's the link you requested 👇",
      "Here are all the details 📋",
      "Awesome! Here's your personal link 🔗",
    ],
  },
  linkLabel: {
    ar: ['اضغط هنا', 'افتح الرابط', 'تسوق الآن', 'احصل على العرض'],
    en: ['Click here', 'Open link', 'Shop now', 'Get the offer'],
  },
}

// ============================================================
// CLICKABLE EXAMPLES COMPONENT
// ============================================================
function ExampleChips({ examples, onSelect, lang }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {examples.map(ex => (
        <button
          key={ex}
          type="button"
          onClick={() => onSelect(ex)}
          className="px-2.5 py-1 bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-[#333] border border-gray-200 dark:border-[#333] rounded-lg text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
        >
          {ex}
        </button>
      ))}
    </div>
  )
}

// ============================================================
// LIVE PREVIEW — Fixed Instagram-accurate UI
// ============================================================
function LivePreview({ activeTab, form, lang }) {
  const isAr = lang === 'ar'
  const keyword = form.keywords?.[0] || (isAr ? 'سعر' : 'price')
  const commentReply = form.commentReplies?.[0] || ''

  return (
    <div style={{
      width: 260, height: 530, flexShrink: 0,
      borderRadius: 44, background: '#000',
      boxShadow: '0 0 0 2px #1a1a1a, 0 0 0 3.5px #2a2a2a, 0 30px 80px rgba(0,0,0,0.55)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Status bar */}
      <div style={{ background: '#000', padding: '10px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>12:22</span>
        <div style={{ width: 60, height: 14, background: '#000', borderRadius: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 10 }}>
            {[3, 5, 7, 9].map(h => <div key={h} style={{ width: 2, height: h, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />)}
          </div>
          <div style={{ width: 10, height: 7, border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: 2, marginLeft: 2 }}>
            <div style={{ width: 5, height: 3, background: 'rgba(255,255,255,0.7)', borderRadius: 1, margin: '1px' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* ── POST ── */}
        {activeTab === 'post' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #222', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <ArrowLeft size={13} color="#fff" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 7, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>USERNAME</div>
                <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Posts</div>
              </div>
              <div style={{ width: 13 }} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 4px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 2, flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
                </div>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>username</span>
                <div style={{ marginLeft: 'auto', color: '#fff', fontSize: 16, opacity: 0.7 }}>···</div>
              </div>
              <div style={{ background: '#111', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ opacity: 0.2, textAlign: 'center' }}>
                  <ImageIcon size={22} color="#aaa" />
                </div>
              </div>
              <div style={{ padding: '6px 10px 2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Heart size={14} color="#fff" />
                  <MessageCircle size={14} color="#fff" />
                  <Send size={14} color="#fff" />
                </div>
                <Bookmark size={14} color="#fff" />
              </div>
              <div style={{ padding: '2px 10px 8px' }}>
                <div style={{ color: '#fff', fontSize: 9, fontWeight: 600 }}>500 {isAr ? 'إعجاب' : 'likes'}</div>
                <div style={{ color: '#fff', fontSize: 9, marginTop: 2 }}>
                  <span style={{ fontWeight: 700 }}>username</span>{' '}
                  <span style={{ color: '#999' }}>{isAr ? 'الكابشن هنا...' : 'Caption here...'}</span>
                </div>
                <div style={{ color: '#666', fontSize: 8, marginTop: 3 }}>{isAr ? 'عرض جميع التعليقات' : 'View all comments'}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #222', padding: '6px 10px', display: 'flex', justifyContent: 'space-around' }}>
              {['🏠', '🔍', '➕', '🎬', '👤'].map((icon, i) => (
                <span key={i} style={{ fontSize: 14, opacity: i === 4 ? 1 : 0.4 }}>{icon}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── COMMENTS — Fix 5: proper nested reply ── */}
        {activeTab === 'comments' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
              <div style={{ width: 32, height: 3, background: '#444', borderRadius: 2 }} />
            </div>
            <div style={{ borderBottom: '1px solid #222', padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Comments</span>
              <Send size={12} color="rgba(255,255,255,0.5)" />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {/* Parent comment */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#555', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>U</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{isAr ? 'اسم_المستخدم' : 'username'}</span>
                    <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'الآن' : 'Now'}</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: 10 }}>{keyword}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'رد' : 'Reply'}</span>
                    <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'ترجمة' : 'Translate'}</span>
                  </div>

                  {/* Fix 5: Nested threaded reply - directly under parent */}
                  {form.replyToComment && commentReply && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 1.5, flexShrink: 0 }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'center' }}>
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>username</span>
                          <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'الآن' : 'Now'}</span>
                        </div>
                        <div style={{ color: '#fff', fontSize: 10 }}>{commentReply}</div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'رد' : 'Reply'}</span>
                        </div>
                      </div>
                      <Heart size={10} color="#444" style={{ marginTop: 2, flexShrink: 0 }} />
                    </div>
                  )}
                </div>
                <Heart size={10} color="#444" style={{ marginTop: 2, flexShrink: 0 }} />
              </div>
            </div>
            <div style={{ borderTop: '1px solid #222', padding: '8px 12px' }}>
              <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map((e, i) => (
                  <span key={i} style={{ fontSize: 11 }}>{e}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 1.5, flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
                </div>
                <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 20, padding: '5px 10px' }}>
                  <span style={{ color: '#555', fontSize: 8 }}>{isAr ? 'أضف تعليقاً...' : 'Add a comment...'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DM — Fix 6: CTA button style, Fix 7: text wrapping ── */}
        {activeTab === 'dm' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #222', padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <ArrowLeft size={13} color="#fff" />
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 2, flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>username</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12 }}>📞</span>
                <span style={{ color: '#fff', fontSize: 12 }}>📹</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>

              {/* Bot message card — Fix 6: visible CTA button, Fix 7: word-wrap */}
              {form.openingDM && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 2, flexShrink: 0 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
                  </div>
                  {/* Unified card with text wrapping fix */}
                  <div style={{
                    maxWidth: '78%', background: '#262626',
                    borderRadius: '16px 16px 16px 4px', overflow: 'hidden',
                    // Fix 7: ensure container doesn't overflow
                    minWidth: 0,
                  }}>
                    <div style={{ padding: '9px 11px' }}>
                      <p style={{
                        color: '#fff', fontSize: 9, lineHeight: 1.55, margin: 0,
                        // Fix 7: proper text wrapping
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}>
                        {form.openingDM}
                      </p>
                    </div>
                    {/* Fix 6: CTA button with distinct background */}
                    {form.openingButton && (
                      <div style={{
                        margin: '0 8px 8px',
                        background: 'rgba(55, 151, 240, 0.15)',
                        border: '1px solid rgba(55, 151, 240, 0.35)',
                        borderRadius: 10,
                        padding: '6px 10px',
                        textAlign: 'center',
                      }}>
                        <span style={{ color: '#3797F0', fontSize: 9, fontWeight: 700 }}>
                          {form.openingButton}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User reply */}
              {form.openingButton && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: '#3797F0', borderRadius: '16px 16px 4px 16px',
                    padding: '7px 11px', maxWidth: '65%',
                    wordBreak: 'break-word', overflowWrap: 'break-word',
                  }}>
                    <span style={{ color: '#fff', fontSize: 9, fontWeight: 500 }}>{form.openingButton}</span>
                  </div>
                </div>
              )}

              {/* Final DM */}
              {form.finalDM && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)', padding: 2, flexShrink: 0 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }} />
                  </div>
                  <div style={{ maxWidth: '78%', background: '#262626', borderRadius: '16px 16px 16px 4px', overflow: 'hidden', minWidth: 0 }}>
                    <div style={{ padding: '9px 11px' }}>
                      <p style={{
                        color: '#fff', fontSize: 9, lineHeight: 1.55, margin: 0,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                      }}>
                        {form.finalDM}
                      </p>
                      {form.finalLink && (
                        <div style={{ marginTop: 6, background: 'rgba(55,151,240,0.12)', border: '1px solid rgba(55,151,240,0.25)', borderRadius: 8, padding: '6px 8px' }}>
                          <div style={{ color: '#3797F0', fontSize: 8, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {form.finalLinkLabel || form.finalLink}
                          </div>
                          <div style={{ color: '#555', fontSize: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                            {form.finalLink}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #222', padding: '7px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: 20, padding: '5px 12px' }}>
                <span style={{ color: '#555', fontSize: 8 }}>Message...</span>
              </div>
              <div style={{ display: 'flex', gap: 8, opacity: 0.4 }}>
                <ImageIcon size={12} color="#fff" />
                <span style={{ color: '#fff', fontSize: 11 }}>⊞</span>
                <span style={{ color: '#fff', fontSize: 11 }}>⊕</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TOGGLE — Fix 2: correct direction ──────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: value ? '#3b82f6' : '#d1d5db',
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s', border: 'none', cursor: 'pointer',
        padding: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        // Fix 2: correct direction — right when ON, left when OFF
        left: value ? 20 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

// ── SECTION CARD ───────────────────────────────────────────────
function SectionCard({ step, title, children }) {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#27272a] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-[#1f1f1f]">
        <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
          <span className="text-white dark:text-gray-900 text-[10px] font-bold">{step}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────
function AutomationBuilderInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  // Fix 1: read template param correctly
  const templateId = searchParams.get('template') || 'default'
  const tmpl = TEMPLATE_DEFAULTS[templateId] || TEMPLATE_DEFAULTS.default

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [activePreview, setActivePreview] = useState('post')

  // Fix 3 & 4: initialize with localized default values (not empty)
  const [form, setForm] = useState({
    name: isRTL ? tmpl.nameAr : tmpl.nameEn,
    accountId: '',
    keywords: [],
    anyWord: false,
    replyToComment: false,
    commentReplies: [isRTL ? 'شكراً! تفقد رسائلك الخاصة 📩' : 'Thanks! Check your DMs 📩'],
    openingDM: isRTL ? tmpl.openingDM.ar : tmpl.openingDM.en,
    openingButton: isRTL ? tmpl.openingButton.ar : tmpl.openingButton.en,
    requireFollow: false,
    requireEmail: false,
    finalDM: isRTL ? tmpl.finalDM.ar : tmpl.finalDM.en,
    finalLink: '',
    finalLinkLabel: isRTL ? 'اضغط هنا' : 'Click here',
  })

  // Fix 4: localized text
  const t = {
    ar: {
      draft: 'مسودة', goLive: 'نشر', saving: 'جاري الحفظ...', saved: 'تم ✓', saveDraft: 'حفظ مسودة',
      account: 'الحساب', selectAccount: 'اختر حساباً',
      step1: 'الكلمات المفتاحية',
      specificWords: 'كلمة أو كلمات محددة', anyWord: 'أي كلمة',
      addKeyword: 'اكتب كلمة واضغط Enter',
      kwHint: 'أمثلة (اضغط للإضافة):',
      replyComment: 'الرد على التعليق تلقائياً',
      addReply: 'أضف رداً آخر',
      step2: 'الرسالة الافتتاحية',
      msgLabel: 'نص الرسالة', msgPlaceholder: 'اكتب رسالتك الافتتاحية...',
      btnLabel: 'نص زر الإجراء (CTA)',
      step2Hint: 'أمثلة على الرسائل (اضغط للاستخدام):',
      requireFollow: 'طلب متابعة الحساب أولاً',
      requireEmail: 'طلب البريد الإلكتروني',
      step3: 'الرسالة النهائية',
      finalPlaceholder: 'اكتب الرسالة النهائية...',
      finalHint: 'أمثلة (اضغط للاستخدام):',
      linkLabel: 'نص زر الرابط', linkUrl: 'رابط (https://...)',
      linkLabelHint: 'أمثلة:',
      saveDraftBtn: 'حفظ مسودة',
      errName: 'أدخل اسم الأتمتة',
      errKw: 'أضف كلمة مفتاحية أو اختر "أي كلمة"',
      errDM: 'أدخل رسالة افتتاحية',
    },
    en: {
      draft: 'Draft', goLive: 'Go Live', saving: 'Saving...', saved: 'Saved ✓', saveDraft: 'Save Draft',
      account: 'Account', selectAccount: 'Select an account',
      step1: 'Trigger Keywords',
      specificWords: 'A specific word or words', anyWord: 'Any word',
      addKeyword: 'Type a word and press Enter',
      kwHint: 'Examples (click to add):',
      replyComment: 'Reply to their comment automatically',
      addReply: 'Add another reply',
      step2: 'Opening DM',
      msgLabel: 'Message text', msgPlaceholder: 'Write your opening message...',
      btnLabel: 'CTA Button label',
      step2Hint: 'Message examples (click to use):',
      requireFollow: 'Ask to follow before sending',
      requireEmail: 'Ask for their email',
      step3: 'Final DM',
      finalPlaceholder: 'Write the final message...',
      finalHint: 'Examples (click to use):',
      linkLabel: 'Link button label', linkUrl: 'Link (https://...)',
      linkLabelHint: 'Examples:',
      saveDraftBtn: 'Save Draft',
      errName: 'Enter automation name',
      errKw: 'Add a keyword or select "Any word"',
      errDM: 'Enter an opening message',
    },
  }[lang]

  // Localized examples
  const ex = {
    keywords: EXAMPLES.keywords[lang] || EXAMPLES.keywords.en,
    commentReply: EXAMPLES.commentReply[lang] || EXAMPLES.commentReply.en,
    openingDM: EXAMPLES.openingDM[lang] || EXAMPLES.openingDM.en,
    finalDM: EXAMPLES.finalDM[lang] || EXAMPLES.finalDM.en,
    linkLabel: EXAMPLES.linkLabel[lang] || EXAMPLES.linkLabel.en,
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('connected_accounts').select('*').eq('user_id', user.id)
      setAccounts(data || [])
      if (data?.length) setForm(f => ({ ...f, accountId: data[0].id }))
    }
    load()
  }, [])

  const addKeyword = (kw) => {
    const word = (kw || keywordInput).trim()
    if (!word || form.keywords.includes(word)) return
    setForm(f => ({ ...f, keywords: [...f.keywords, word] }))
    if (!kw) setKeywordInput('')
  }

  const handleSave = async (isActive) => {
    setError('')
    if (!form.name.trim()) { setError(t.errName); return }
    if (!form.anyWord && !form.keywords.length) { setError(t.errKw); return }
    if (!form.openingDM.trim()) { setError(t.errDM); return }

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: e } = await supabase.from('automations').insert({
      user_id: user.id,
      account_id: form.accountId || null,
      name: form.name,
      trigger_keywords: form.anyWord ? [] : form.keywords,
      trigger_keyword: form.anyWord ? '' : (form.keywords[0] || ''),
      comment_replies: form.replyToComment ? form.commentReplies.filter(r => r.trim()) : [],
      comment_reply: form.replyToComment ? (form.commentReplies[0] || '') : '',
      dm_messages: [form.openingDM],
      dm_message: form.openingDM,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })

    if (e) { setError(e.message); setSaving(false); return }
    setSaving(false); setSaved(true)
    setTimeout(() => router.push('/dashboard/automations'), 800)
  }

  const inp = `w-full px-3 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-[#525252] transition-colors placeholder-gray-400 dark:placeholder-gray-600 resize-none`

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* TOP BAR */}
      <div className="flex-shrink-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#27272a] z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/automations" className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#27272a] rounded-lg transition-colors">
              {isRTL ? <ArrowRight size={17} className="text-gray-500" /> : <ArrowLeft size={17} className="text-gray-500" />}
            </Link>
            <div className="h-4 w-px bg-gray-200 dark:bg-[#27272a]" />
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:bg-gray-100 dark:focus:bg-[#27272a] px-2 py-1 rounded-lg transition-colors min-w-[160px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">{t.draft}</span>
            <button onClick={() => handleSave(false)} disabled={saving || saved}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-[#27272a] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} className="text-green-500" /> : <Save size={13} />}
              {saving ? t.saving : saved ? t.saved : t.saveDraft}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving || saved}
              className="px-4 py-1.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              {t.goLive}
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-6 py-6 flex gap-8 overflow-hidden">

          {/* LEFT — scrollable */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-8" style={{ maxWidth: 500 }}>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400">
                <X size={13} className="flex-shrink-0" /> {error}
              </div>
            )}

            {/* Account */}
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#27272a] rounded-2xl p-5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t.account}</label>
              <select value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))} className={inp}>
                <option value="">{t.selectAccount}</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>@{acc.account_name} ({acc.account_type})</option>
                ))}
              </select>
            </div>

            {/* STEP 1 — Keywords */}
            <SectionCard step="1" title={t.step1}>
              {/* Radio: specific */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setForm(f => ({ ...f, anyWord: false })); setActivePreview('comments') }}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${!form.anyWord ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {!form.anyWord && <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.specificWords}</span>
              </div>

              {!form.anyWord && (
                <div className="ms-7 space-y-2">
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {form.keywords.map(kw => (
                      <span key={kw} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-[#27272a] rounded-lg text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {kw}
                        <button type="button" onClick={() => setForm(f => ({ ...f, keywords: f.keywords.filter(k => k !== kw) }))} className="text-gray-400 hover:text-red-500"><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addKeyword()}
                    onFocus={() => setActivePreview('comments')}
                    placeholder={t.addKeyword}
                    className={inp}
                  />
                  {/* Fix 3: clickable examples */}
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">{t.kwHint}</p>
                    <ExampleChips examples={ex.keywords} onSelect={addKeyword} lang={lang} />
                  </div>
                </div>
              )}

              {/* Radio: any word */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setForm(f => ({ ...f, anyWord: true })); setActivePreview('comments') }}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${form.anyWord ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {form.anyWord && <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.anyWord}</span>
              </div>

              {/* Reply toggle */}
              <div className="pt-3 border-t border-gray-100 dark:border-[#1f1f1f]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t.replyComment}</span>
                  <Toggle value={form.replyToComment} onChange={v => { setForm(f => ({ ...f, replyToComment: v })); setActivePreview('comments') }} />
                </div>
                {form.replyToComment && (
                  <div className="mt-3 space-y-2">
                    {form.commentReplies.map((reply, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={reply}
                          onChange={e => { const a = [...form.commentReplies]; a[i] = e.target.value; setForm(f => ({ ...f, commentReplies: a })) }}
                          onFocus={() => setActivePreview('comments')}
                          placeholder={isRTL ? `رد ${i + 1}...` : `Reply ${i + 1}...`}
                          className={inp + ' flex-1'}
                        />
                        {form.commentReplies.length > 1 && (
                          <button type="button" onClick={() => setForm(f => ({ ...f, commentReplies: f.commentReplies.filter((_, idx) => idx !== i) }))} className="p-2 text-gray-400 hover:text-red-500 flex-shrink-0"><X size={13} /></button>
                        )}
                      </div>
                    ))}
                    {/* Fix 3: clickable reply examples */}
                    <ExampleChips
                      examples={ex.commentReply}
                      onSelect={ex => {
                        const a = [...form.commentReplies]
                        a[0] = ex
                        setForm(f => ({ ...f, commentReplies: a }))
                      }}
                      lang={lang}
                    />
                    <button type="button" onClick={() => setForm(f => ({ ...f, commentReplies: [...f.commentReplies, ''] }))} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mt-1">
                      <Plus size={12} /> {t.addReply}
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* STEP 2 — Opening DM */}
            <SectionCard step="2" title={t.step2}>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.msgLabel}</label>
                <textarea
                  value={form.openingDM}
                  onChange={e => setForm(f => ({ ...f, openingDM: e.target.value }))}
                  onFocus={() => setActivePreview('dm')}
                  rows={4}
                  placeholder={t.msgPlaceholder}
                  className={inp}
                />
                {/* Fix 3 & 4: localized clickable examples */}
                <div className="mt-1">
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">{t.step2Hint}</p>
                  <ExampleChips examples={ex.openingDM} onSelect={v => setForm(f => ({ ...f, openingDM: v }))} lang={lang} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.btnLabel}</label>
                <input
                  value={form.openingButton}
                  onChange={e => setForm(f => ({ ...f, openingButton: e.target.value }))}
                  onFocus={() => setActivePreview('dm')}
                  placeholder={isRTL ? 'مثال: أرسل لي الرابط' : 'e.g. Send me the link'}
                  className={inp}
                />
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-[#1f1f1f] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{t.requireFollow}</span>
                  <Toggle value={form.requireFollow} onChange={v => setForm(f => ({ ...f, requireFollow: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{t.requireEmail}</span>
                  <Toggle value={form.requireEmail} onChange={v => setForm(f => ({ ...f, requireEmail: v }))} />
                </div>
              </div>
            </SectionCard>

            {/* STEP 3 — Final DM */}
            <SectionCard step="3" title={t.step3}>
              <div>
                <textarea
                  value={form.finalDM}
                  onChange={e => setForm(f => ({ ...f, finalDM: e.target.value }))}
                  onFocus={() => setActivePreview('dm')}
                  rows={3}
                  placeholder={t.finalPlaceholder}
                  className={inp}
                />
                <div className="mt-1">
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">{t.finalHint}</p>
                  <ExampleChips examples={ex.finalDM} onSelect={v => setForm(f => ({ ...f, finalDM: v }))} lang={lang} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.linkLabel}</label>
                <input
                  value={form.finalLinkLabel}
                  onChange={e => setForm(f => ({ ...f, finalLinkLabel: e.target.value }))}
                  onFocus={() => setActivePreview('dm')}
                  placeholder={isRTL ? 'مثال: اضغط هنا' : 'e.g. Click here'}
                  className={inp}
                />
                <div className="mt-1">
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">{t.linkLabelHint}</p>
                  <ExampleChips examples={ex.linkLabel} onSelect={v => setForm(f => ({ ...f, finalLinkLabel: v }))} lang={lang} />
                </div>
              </div>
              <input
                value={form.finalLink}
                onChange={e => setForm(f => ({ ...f, finalLink: e.target.value }))}
                onFocus={() => setActivePreview('dm')}
                placeholder={t.linkUrl}
                className={inp}
              />
            </SectionCard>

            {/* Buttons */}
            <div className="flex gap-3 pb-4">
              <button type="button" onClick={() => handleSave(false)} disabled={saving || saved}
                className="flex-1 py-3 border border-gray-200 dark:border-[#27272a] text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">
                {saving ? t.saving : saved ? t.saved : t.saveDraftBtn}
              </button>
              <button type="button" onClick={() => handleSave(true)} disabled={saving || saved}
                className="flex-1 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                {t.goLive}
              </button>
            </div>
          </div>

          {/* RIGHT — fixed preview */}
          <div className="hidden lg:flex flex-col items-center flex-shrink-0 overflow-hidden" style={{ width: 300 }}>
            {/* Tab pills */}
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full p-1 mb-5 border border-gray-300 dark:border-[#27272a] flex-shrink-0">
              {[
                { id: 'post', label: isRTL ? 'منشور' : 'Post' },
                { id: 'comments', label: isRTL ? 'تعليقات' : 'Comments' },
                { id: 'dm', label: 'DM' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActivePreview(tab.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${activePreview === tab.id ? 'bg-white dark:bg-[#27272a] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <LivePreview activeTab={activePreview} form={form} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AutomationBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={24} /></div>}>
      <AutomationBuilderInner />
    </Suspense>
  )
}