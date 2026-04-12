'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import {
  MessageSquare, Send, ArrowLeft, ArrowRight,
  Search, Circle, CheckCircle2, X, User,
  Instagram, Facebook, Clock, Bot, UserCheck,
  StickyNote, RefreshCw, Inbox, ChevronDown,
  Lock, Unlock, Filter
} from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────
function timeAgo(date, lang) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return lang === 'ar' ? 'الآن' : 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return lang === 'ar' ? `${minutes}د` : `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return lang === 'ar' ? `${hours}س` : `${hours}h`
  const days = Math.floor(hours / 24)
  return lang === 'ar' ? `${days}ي` : `${days}d`
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Conversation List Item ─────────────────────────────────
function ConvItem({ conv, selected, onClick, lang }) {
  const isAr = lang === 'ar'
  return (
    <button
      onClick={onClick}
      className={`w-full text-start p-4 border-b border-white/5 transition-all hover:bg-white/5 ${selected ? 'bg-white/10 border-s-2 border-s-cyan-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {initials(conv.platform_name)}
          </div>
          {!conv.is_read && (
            <div className="absolute -top-0.5 -end-0.5 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className={`text-sm font-semibold truncate ${conv.is_read ? 'text-gray-300' : 'text-white'}`}>
              {conv.platform_name || conv.platform_user_id?.slice(0, 12) || '—'}
            </span>
            <span className="text-gray-600 text-xs flex-shrink-0 ms-2">
              {timeAgo(conv.last_message_at, lang)}
            </span>
          </div>
          <p className={`text-xs truncate ${conv.is_read ? 'text-gray-600' : 'text-gray-400'}`}>
            {conv.last_message || '—'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {conv.account?.account_type === 'instagram'
              ? <Instagram size={10} className="text-pink-500" />
              : <Facebook size={10} className="text-blue-500" />
            }
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${conv.is_open ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
              {conv.is_open ? (isAr ? 'مفتوحة' : 'Open') : (isAr ? 'مغلقة' : 'Closed')}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Message Bubble ─────────────────────────────────────────
function MessageBubble({ msg, isRTL }) {
  const isBot = msg.is_bot
  const isAgent = msg.sender === 'agent'
  const isUser = !isBot && !isAgent

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? (isRTL ? 'justify-end' : 'justify-start') : (isRTL ? 'justify-start' : 'justify-end')}`}>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          <User size={13} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-white/10 text-gray-200 rounded-bs-sm'
          : isBot
          ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-be-sm'
          : 'bg-purple-500/10 border border-purple-500/20 text-purple-200 rounded-be-sm'
      }`}>
        {(isBot || isAgent) && (
          <div className="flex items-center gap-1 mb-1 opacity-60">
            {isBot ? <Bot size={11} /> : <UserCheck size={11} />}
            <span className="text-xs">{isBot ? 'Bot' : 'Agent'}</span>
          </div>
        )}
        <p>{msg.message}</p>
        <p className="text-xs opacity-40 mt-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {(isBot || isAgent) && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`}>
          {isBot ? <Bot size={13} className="text-cyan-400" /> : <UserCheck size={13} className="text-purple-400" />}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
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
  const [filter, setFilter] = useState('all') // all | open | closed | unread
  const [showNotes, setShowNotes] = useState(false)
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const t = {
    ar: {
      title: 'صندوق الوارد',
      desc: 'المحادثات المباشرة مع جمهورك',
      search: 'ابحث عن محادثة...',
      all: 'الكل',
      open: 'مفتوحة',
      closed: 'مغلقة',
      unread: 'غير مقروءة',
      noConversations: 'لا توجد محادثات بعد',
      noConversationsDesc: 'المحادثات ستظهر هنا عندما يتفاعل المشتركون مع أتمتاتك.',
      selectConversation: 'اختر محادثة',
      selectConversationDesc: 'اختر محادثة من القائمة لعرضها',
      typeReply: 'اكتب رداً...',
      send: 'إرسال',
      markRead: 'تعيين كمقروء',
      close: 'إغلاق المحادثة',
      reopen: 'إعادة الفتح',
      notes: 'ملاحظات داخلية',
      notesPlaceholder: 'أضف ملاحظة داخلية...',
      saveNote: 'حفظ',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      noMessages: 'لا توجد رسائل في هذه المحادثة',
      sendNote: 'إرسال للمستخدم',
      agentReply: 'رد الوكيل',
      platform: 'المنصة',
      joined: 'انضم في',
      conversations: 'محادثة',
      refresh: 'تحديث',
    },
    en: {
      title: 'Inbox',
      desc: 'Live conversations with your audience',
      search: 'Search conversations...',
      all: 'All',
      open: 'Open',
      closed: 'Closed',
      unread: 'Unread',
      noConversations: 'No conversations yet',
      noConversationsDesc: 'Conversations will appear here when subscribers interact with your automations.',
      selectConversation: 'Select a conversation',
      selectConversationDesc: 'Choose a conversation from the list to view it',
      typeReply: 'Type a reply...',
      send: 'Send',
      markRead: 'Mark as read',
      close: 'Close conversation',
      reopen: 'Reopen',
      notes: 'Internal Notes',
      notesPlaceholder: 'Add an internal note...',
      saveNote: 'Save',
      back: 'Back',
      loading: 'Loading...',
      noMessages: 'No messages in this conversation',
      sendNote: 'Send to user',
      agentReply: 'Agent Reply',
      platform: 'Platform',
      joined: 'Joined',
      conversations: 'conversations',
      refresh: 'Refresh',
    }
  }[lang]

  // ── Load conversations
  const loadConversations = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data } = await supabase
      .from('conversations')
      .select('*, account:connected_accounts(account_name, account_type)')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false })

    setConversations(data || [])
    setLoading(false)
  }, [router])

  useEffect(() => { loadConversations() }, [loadConversations])

  // ── Load messages for selected conversation
  const loadMessages = useCallback(async (convId) => {
    setMsgLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })

    setMessages(data || [])
    setMsgLoading(false)

    // Mark as read
    await supabase.from('conversations').update({ is_read: true }).eq('id', convId)
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, is_read: true } : c))
  }, [])

  useEffect(() => {
    if (selected) {
      loadMessages(selected.id)
      setNote(selected.notes || '')
    }
  }, [selected, loadMessages])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send reply
  const handleSend = async () => {
    if (!replyText.trim() || !selected) return
    setSending(true)
    const supabase = createClient()

    const newMsg = {
      conversation_id: selected.id,
      sender: 'agent',
      message: replyText,
      is_bot: false,
    }

    const { data: inserted } = await supabase
      .from('conversation_messages')
      .insert(newMsg)
      .select()
      .single()

    if (inserted) {
      setMessages(prev => [...prev, inserted])
      await supabase.from('conversations').update({
        last_message: replyText,
        last_message_at: new Date().toISOString(),
      }).eq('id', selected.id)
      setConversations(prev => prev.map(c =>
        c.id === selected.id
          ? { ...c, last_message: replyText, last_message_at: new Date().toISOString() }
          : c
      ))
    }

    setReplyText('')
    setSending(false)
  }

  // ── Toggle open/close
  const handleToggleOpen = async () => {
    if (!selected) return
    const supabase = createClient()
    const newStatus = !selected.is_open
    await supabase.from('conversations').update({ is_open: newStatus }).eq('id', selected.id)
    setSelected(prev => ({ ...prev, is_open: newStatus }))
    setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, is_open: newStatus } : c))
  }

  // ── Save note
  const handleSaveNote = async () => {
    if (!selected) return
    setSavingNote(true)
    const supabase = createClient()
    await supabase.from('conversations').update({ notes: note }).eq('id', selected.id)
    setSelected(prev => ({ ...prev, notes: note }))
    setSavingNote(false)
  }

  // ── Filter conversations
  const filtered = conversations.filter(c => {
    const matchSearch = !search ||
      (c.platform_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.last_message || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'open' ? c.is_open :
      filter === 'closed' ? !c.is_open :
      filter === 'unread' ? !c.is_read : true
    return matchSearch && matchFilter
  })

  const unreadCount = conversations.filter(c => !c.is_read).length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <MessageSquare className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
      <main className="pt-20 pb-0 px-0 h-screen flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all">
              {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
              {t.back}
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {t.title}
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-500 text-black text-xs font-bold rounded-full">{unreadCount}</span>
                )}
              </h1>
              <p className="text-gray-500 text-xs">{filtered.length} {t.conversations}</p>
            </div>
          </div>
          <button onClick={loadConversations} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Conversation List */}
          <div className={`w-full md:w-80 lg:w-96 border-e border-white/10 flex flex-col flex-shrink-0 ${selected ? 'hidden md:flex' : 'flex'}`}>

            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <div className="relative mb-2">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.search}
                  className="w-full ps-8 pe-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              {/* Filter tabs */}
              <div className="flex gap-1">
                {[
                  { key: 'all', label: t.all },
                  { key: 'open', label: t.open },
                  { key: 'unread', label: t.unread },
                  { key: 'closed', label: t.closed },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex-1 py-1 text-xs rounded-lg transition-all ${filter === f.key ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <Inbox size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{t.noConversations}</p>
                  <p className="text-gray-700 text-xs mt-1">{t.noConversationsDesc}</p>
                </div>
              ) : (
                filtered.map(conv => (
                  <ConvItem
                    key={conv.id}
                    conv={conv}
                    selected={selected?.id === conv.id}
                    onClick={() => setSelected(conv)}
                    lang={lang}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── Right: Chat Window */}
          <div className={`flex-1 flex flex-col ${!selected ? 'hidden md:flex' : 'flex'}`}>

            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={56} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">{t.selectConversation}</p>
                  <p className="text-gray-600 text-sm mt-1">{t.selectConversationDesc}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Back on mobile */}
                    <button onClick={() => setSelected(null)} className="md:hidden p-1 text-gray-400 hover:text-white">
                      {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {initials(selected.platform_name)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{selected.platform_name || selected.platform_user_id}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {selected.account?.account_type === 'instagram'
                          ? <Instagram size={10} className="text-pink-500" />
                          : <Facebook size={10} className="text-blue-500" />
                        }
                        {selected.account?.account_name}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className={`p-2 rounded-lg transition-all ${showNotes ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                      title={t.notes}
                    >
                      <StickyNote size={16} />
                    </button>
                    <button
                      onClick={handleToggleOpen}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selected.is_open
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {selected.is_open ? <Lock size={13} /> : <Unlock size={13} />}
                      {selected.is_open ? t.close : t.reopen}
                    </button>
                  </div>
                </div>

                {/* Notes panel */}
                <AnimatePresence>
                  {showNotes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-b border-white/10 overflow-hidden"
                    >
                      <div className="p-3 flex gap-2">
                        <textarea
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          placeholder={t.notesPlaceholder}
                          rows={2}
                          className="flex-1 p-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-yellow-100 placeholder-yellow-900 text-sm focus:outline-none focus:border-yellow-500 resize-none"
                        />
                        <button
                          onClick={handleSaveNote}
                          disabled={savingNote}
                          className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-bold transition-all self-end"
                        >
                          {savingNote ? '...' : t.saveNote}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {msgLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-600 text-sm">{t.noMessages}</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble key={msg.id || i} msg={msg} isRTL={isRTL} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Reply box */}
                <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
                  {!selected.is_open ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-gray-500 text-sm">
                      <Lock size={14} />
                      {lang === 'ar' ? 'المحادثة مغلقة — أعد الفتح للرد' : 'Conversation closed — reopen to reply'}
                    </div>
                  ) : (
                    <div className="flex gap-3 items-end">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder={t.typeReply}
                        rows={2}
                        className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 resize-none transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={sending || !replyText.trim()}
                        className="p-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all disabled:opacity-40 flex-shrink-0"
                      >
                        {sending
                          ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          : <Send size={18} className={isRTL ? 'rotate-180' : ''} />
                        }
                      </motion.button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
  )
}