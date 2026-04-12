'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Link as LinkIcon, Trash2, Plus, Grid, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function AccountsContent() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const content = {
    en: {
      connectAccounts: "Connected Accounts",
      connectAccountsDesc: "Manage your Instagram Business and Facebook Pages to enable automation.",
      successConnect: "Account connected successfully!",
      errorConnect: "Failed to connect account. Please try again.",
      connectMetaBtn: "Connect Meta Account (Instagram/Facebook)",
      noAccounts: "No Connected Accounts",
      noAccountsDesc: "Connect your Instagram or Facebook account to start automating interactions.",
      connected: "Connected",
      disconnect: "Disconnect",
      dashboard: "Dashboard",
      automations: "Automations",
      loading: "Loading...",
      back: "Back",
    },
    ar: {
      connectAccounts: "الحسابات المتصلة",
      connectAccountsDesc: "إدارة حسابات انستجرام للنشاط التجاري وصفحات فيسبوك لتفعيل الأتمتة.",
      successConnect: "تم ربط الحساب بنجاح!",
      errorConnect: "فشل ربط الحساب. يرجى المحاولة مرة أخرى.",
      connectMetaBtn: "ربط حساب ميتا (انستجرام/فيسبوك)",
      noAccounts: "لا توجد حسابات متصلة",
      noAccountsDesc: "قم بربط حساب انستجرام أو فيسبوك لبدء أتمتة التفاعلات.",
      connected: "متصل",
      disconnect: "فصل",
      dashboard: "لوحة التحكم",
      automations: "الأتمتات",
      loading: "جاري التحميل...",
      back: "رجوع",
    }
  }

  const t = content[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('connected_accounts').select('*').eq('user_id', user.id)
      setAccounts(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const connectMeta = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID,
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/meta/callback',
      scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,pages_messaging',
      response_type: 'code',
    })
    window.location.href = 'https://www.facebook.com/dialog/oauth?' + params
  }

  const disconnect = async (id) => {
    const supabase = createClient()
    await supabase.from('connected_accounts').delete().eq('id', id)
    setAccounts(accounts.filter(a => a.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
        <Grid className="w-6 h-6" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.connectAccounts}</h1>
            <p className="text-gray-400">{t.connectAccountsDesc}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              {t.back}
            </Link>
            <Link 
              href="/dashboard/flows" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
            >
              <Grid size={18} />
              {t.automations}
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3 text-green-400">
            <CheckCircle2 size={20} />
            {t.successConnect}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            {t.errorConnect}
          </div>
        )}

        {/* Connect Button */}
        <div className="mb-10">
          <button onClick={connectMeta} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/20">
            <Plus size={20} />
            {t.connectMetaBtn}
          </button>
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-gray-400 mb-4">
              <LinkIcon size={48} />
            </div>
            <div className="text-2xl font-bold text-white mb-2">{t.noAccounts}</div>
            <div className="text-gray-400 max-w-md mx-auto">{t.noAccountsDesc}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {accounts.map(account => (
              <div key={account.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-white/20">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    account.account_type === 'instagram' 
                      ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' 
                      : 'bg-blue-600'
                  }`}>
                    {account.account_type === 'instagram' ? '📸' : '📘'}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{account.account_name}</div>
                    <div className="text-gray-400 text-sm">
                      {account.account_type === 'instagram' ? 'Instagram Business' : 'Facebook Page'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 size={12} />
                    {t.connected}
                  </span>
                  <button 
                    onClick={() => disconnect(account.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">{t.disconnect}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
  )
}

export default function AccountsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <AccountsContent />
    </Suspense>
  )
}