'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  MessageSquare, Send, ArrowLeft, ArrowRight,
  Search, Instagram, Facebook, Bot, UserCheck,
  StickyNote, RefreshCw, Inbox, Lock, Unlock
} from 'lucide-react'

function timeAgo(date, lang) {
  const s = Math.floor((new Date() - new Date(date)) / 1000)
  if (s < 60) return lang === 'ar' ? 'الآن' : 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return lang === 'ar' ? `${m}د` : `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return lang === 'ar' ? `${h}س` : `${h}h`
  return lang === 'ar' ? `${Math.floor(h/24)}ي` : `${Math.floor(h/24)}d`
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function ConvItem({ conv, selected, onClick, lang }) {
  return (
    <button onClick={onClick}
      className="w-full text-start flex items-start gap-3 px-4 py-3 border-b transition-colors"
      style={{
        borderColor: 'var(--db-border)',
        backgroundColor: selected ? 'var(--db-active-bg)' : 'transparent',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = 'transparent' }}>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {initials(conv.platform_name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold truncate" style={{ color: conv.is_read ? 'var(--db-text-2)' : 'var(--db-text-h)' }}>
            {conv.platform_name || conv.platform_user_id || '—'}
          </span>
          <span className="text-[10px] flex-shrink-0 ms-2" style={{ color: 'var(--db-text-3)' }}>
            {conv.last_message_at ? timeAgo(conv.last_message_at, lang) : ''}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: conv.is_read ? 'var(--db-text-3)' : 'var(--db-text-2)' }}>
          {conv.last_message || '—'}
        </p>
        {!conv.is_read && <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--db-primary)' }} />}
      </div>
    </button>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.sender === 'user'
  const isBot = msg.is_bot
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'justify-start' : 'justify-end'}`}>
      {isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--db-icon-bg)' }}>
          <span className="text-[10px] font-bold" style={{ color: 'var(--db-text-2)' }}>U</span>
        </div>
      )}
      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
        isUser ? 'rounded-bl-sm' : isBot ? 'rounded-br-sm' : 'rounded-br-sm'
      }`}
        style={{
          backgroundColor: isUser ? 'var(--db-active-bg)' : isBot ? 'var(--db-primary)' : 'var(--db-text-h)',
          color: isUser ? 'var(--db-text-h)' : '#ffffff',
        }}>
        {(isBot || msg.sender === 'agent') && (
          <div className="flex items-center gap-1 mb-1 opacity-60">
            {isBot ? <Bot size={9} /> : <UserCheck size={9} />}
            <span className="text-[9px] font-medium">{isBot ? 'Bot' : 'Agent'}</span>
          </div>
        )}
        <p>{msg.message}</p>
        <p className="text-[9px] opacity-50 mt-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isBot ? 'var(--db-primary-bg)' : 'var(--db-icon-bg)' }}>
          {isBot
            ? <Bot size={12} style={{ color: 'var(--db-primary)' }} />
            : <UserCheck size={12} style={{ color: 'var(--db-text-2)' }} />
          }
        </div>
      )}
    </div>
  )
}

export default function InboxPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'
  const messagesEndRef = useRef(null)

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showNotes, setShowNotes] = useState(false)
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const t = {
    ar: {
      title: 'صندوق الوارد', desc: 'المحادثات المباشرة مع جمهورك',
      search: 'ابحث عن محادثة...', all: 'الكل', open: 'مفتوحة', closed: 'مغلقة', unread: 'غير مقروءة',
      noConversations: 'لا توجد محادثات بعد',
      noConversationsDesc: 'المحادثات ستظهر هنا عندما يتفاعل المشتركون مع أتمتاتك.',
      selectConversation: 'اختر محادثة', selectConversationDesc: 'اختر محادثة من القائمة لعرضها',
      typeReply: 'اكتب رداً...', close: 'إغلاق', reopen: 'إعادة الفتح',
      notesPlaceholder: 'أضف ملاحظة...', saveNote: 'حفظ',
      loading: 'جاري التحميل...', noMessages: 'لا توجد رسائل', conversations: 'محادثة',
    },
    en: {
      title: 'Inbox', desc: 'Live conversations with your audience',
      search: 'Search conversations...', all: 'All', open: 'Open', closed: 'Closed', unread: 'Unread',
      noConversations: 'No conversations yet',
      noConversationsDesc: 'Conversations will appear here when subscribers interact with your automations.',
      selectConversation: 'Select a conversation', selectConversationDesc: 'Choose a conversation from the list',
      typeReply: 'Type a reply...', close: 'Close', reopen: 'Reopen',
      notesPlaceholder: 'Add an internal note...', saveNote: 'Save',
      loading: 'Loading...', noMessages: 'No messages', conversations: 'conversations',
    }
  }[lang]

  const loadConversations = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('conversations').select('*, account:connected_accounts(account_name, account_type)').eq('user_id', user.id).order('last_message_at', { ascending: false })
    setConversations(data || [])
    setLoading(false)
  }, [router])

  useEffect(() => { loadConversations() }, [loadConversations])

  const loadMessages = useCallback(async (convId) => {
    setMsgLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('conversation_messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    setMessages(data || [])
    setMsgLoading(false)
    await supabase.from('conversations').update({ is_read: true }).eq('id', convId)
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, is_read: true } : c))
  }, [])

  useEffect(() => { if (selected) { loadMessages(selected.id); setNote(selected.notes || '') } }, [selected, loadMessages])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!replyText.trim() || !selected) return
    setSending(true)
    const supabase = createClient()
    const { data: inserted } = await supabase.from('conversation_messages').insert({ conversation_id: selected.id, sender: 'agent', message: replyText, is_bot: false }).select().single()
    if (inserted) {
      setMessages(prev => [...prev, inserted])
      await supabase.from('conversations').update({ last_message: replyText, last_message_at: new Date().toISOString() }).eq('id', selected.id)
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, last_message: replyText } : c))
    }
    setReplyText('')
    setSending(false)
  }

  const handleToggleOpen = async () => {
    if (!selected) return
    const supabase = createClient()
    const newStatus = !selected.is_open
    await supabase.from('conversations').update({ is_open: newStatus }).eq('id', selected.id)
    setSelected(prev => ({ ...prev, is_open: newStatus }))
    setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, is_open: newStatus } : c))
  }

  const handleSaveNote = async () => {
    if (!selected) return
    setSavingNote(true)
    const supabase = createClient()
    await supabase.from('conversations').update({ notes: note }).eq('id', selected.id)
    setSelected(prev => ({ ...prev, notes: note }))
    setSavingNote(false)
  }

  const filtered = conversations.filter(c => {
    const ms = !search || (c.platform_name || '').toLowerCase().includes(search.toLowerCase()) || (c.last_message || '').toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'all' ? true : filter === 'open' ? c.is_open : filter === 'closed' ? !c.is_open : !c.is_read
    return ms && mf
  })

  const unreadCount = conversations.filter(c => !c.is_read).length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm animate-pulse" style={{ color: 'var(--db-text-3)' }}>
        <MessageSquare className="w-4 h-4" style={{ color: 'var(--db-primary)' }} /> {t.loading}
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'var(--db-border)' }}>
        <div>
          <h1 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--db-text-h)' }}>
            {t.title}
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full"
                style={{ backgroundColor: 'var(--db-primary)' }}>{unreadCount}</span>
            )}
          </h1>
          <p className="text-xs" style={{ color: 'var(--db-text-2)' }}>{filtered.length} {t.conversations}</p>
        </div>
        <button onClick={loadConversations} className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--db-text-2)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-hover-bg)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className={`w-full md:w-72 border-e flex flex-col flex-shrink-0 ${selected ? 'hidden md:flex' : 'flex'}`}
          style={{ borderColor: 'var(--db-border)' }}>
          <div className="p-3 border-b space-y-2" style={{ borderColor: 'var(--db-border)' }}>
            <div className="relative">
              <Search size={13} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`}
                style={{ color: 'var(--db-text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search}
                className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-2 border rounded-lg text-sm focus:outline-none`}
                style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
            </div>
            <div className="flex gap-1">
              {[{k:'all',l:t.all},{k:'open',l:t.open},{k:'unread',l:t.unread},{k:'closed',l:t.closed}].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)}
                  className="flex-1 py-1 text-[10px] rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: filter === f.k ? 'var(--db-primary)' : 'var(--db-icon-bg)',
                    color: filter === f.k ? '#ffffff' : 'var(--db-text-2)',
                  }}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox size={32} className="mx-auto mb-3" style={{ color: 'var(--db-border-2)' }} />
                <p className="text-sm" style={{ color: 'var(--db-text-2)' }}>{t.noConversations}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--db-text-3)' }}>{t.noConversationsDesc}</p>
              </div>
            ) : filtered.map(conv => (
              <ConvItem key={conv.id} conv={conv} selected={selected?.id === conv.id} onClick={() => setSelected(conv)} lang={lang} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className={`flex-1 flex flex-col ${!selected ? 'hidden md:flex' : 'flex'}`}
          style={{ backgroundColor: 'var(--db-bg)' }}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-3" style={{ color: 'var(--db-border-2)' }} />
                <p className="text-sm" style={{ color: 'var(--db-text-2)' }}>{t.selectConversation}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--db-text-3)' }}>{t.selectConversationDesc}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Conv header */}
              <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
                style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-bg)' }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelected(null)} className="md:hidden p-1" style={{ color: 'var(--db-text-2)' }}>
                    {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials(selected.platform_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>
                      {selected.platform_name || selected.platform_user_id}
                    </p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--db-text-3)' }}>
                      {selected.account?.account_type === 'instagram'
                        ? <Instagram size={9} className="text-pink-500" />
                        : <Facebook size={9} className="text-blue-500" />
                      }
                      {selected.account?.account_name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowNotes(!showNotes)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: showNotes ? '#FFFBEB' : 'transparent',
                      color: showNotes ? '#D97706' : 'var(--db-text-2)',
                    }}>
                    <StickyNote size={14} />
                  </button>
                  <button onClick={handleToggleOpen}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: selected.is_open ? '#FEF2F2' : '#F0FDF4',
                      color: selected.is_open ? '#DC2626' : '#16A34A',
                    }}>
                    {selected.is_open ? <Lock size={11} /> : <Unlock size={11} />}
                    {selected.is_open ? t.close : t.reopen}
                  </button>
                </div>
              </div>

              {/* Notes panel */}
              <AnimatePresence>
                {showNotes && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-b overflow-hidden" style={{ borderColor: 'var(--db-border)', backgroundColor: '#FFFBEB' }}>
                    <div className="p-3 flex gap-2">
                      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t.notesPlaceholder} rows={2}
                        className="flex-1 p-2 border rounded-lg text-sm focus:outline-none resize-none"
                        style={{ backgroundColor: 'var(--db-surface)', borderColor: '#FCD34D', color: 'var(--db-text-h)' }} />
                      <button onClick={handleSaveNote} disabled={savingNote}
                        className="px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-colors self-end disabled:opacity-50"
                        style={{ backgroundColor: '#D97706' }}>
                        {savingNote ? '...' : t.saveNote}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {msgLoading
                  ? <div className="flex items-center justify-center h-full">
                      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--db-primary)', borderTopColor: 'transparent' }} />
                    </div>
                  : messages.length === 0
                    ? <div className="flex items-center justify-center h-full">
                        <p className="text-sm" style={{ color: 'var(--db-text-3)' }}>{t.noMessages}</p>
                      </div>
                    : <>{messages.map((msg, i) => <MessageBubble key={msg.id || i} msg={msg} />)}<div ref={messagesEndRef} /></>
                }
              </div>

              {/* Reply bar */}
              <div className="px-4 py-3 border-t flex-shrink-0"
                style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-bg)' }}>
                {!selected.is_open ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
                    <Lock size={13} /> {lang === 'ar' ? 'المحادثة مغلقة' : 'Conversation closed'}
                  </div>
                ) : (
                  <div className="flex gap-2 items-end">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      placeholder={t.typeReply} rows={2}
                      className="flex-1 p-3 border rounded-xl text-sm focus:outline-none resize-none"
                      style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
                    <button onClick={handleSend} disabled={sending || !replyText.trim()}
                      className="p-3 rounded-xl transition-colors disabled:opacity-40 flex-shrink-0 text-white"
                      style={{ backgroundColor: 'var(--db-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
                      {sending
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Send size={16} className={isRTL ? 'rotate-180' : ''} />
                      }
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
