'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Trash2, Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function AccountsContent() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const t = {
    ar: {
      title: 'الحسابات المتصلة', desc: 'إدارة حسابات Instagram وFacebook لتفعيل الأتمتة.',
      successMsg: 'تم ربط الحساب بنجاح!', errorMsg: 'فشل ربط الحساب. يرجى المحاولة مرة أخرى.',
      connectBtn: 'ربط حساب Meta (Instagram / Facebook)',
      noAccounts: 'لا توجد حسابات متصلة', noAccountsDesc: 'قم بربط حساب Instagram أو Facebook لبدء الأتمتة.',
      connected: 'متصل', disconnect: 'فصل', loading: 'جاري التحميل...',
    },
    en: {
      title: 'Connected Accounts', desc: 'Manage your Instagram and Facebook accounts to enable automation.',
      successMsg: 'Account connected successfully!', errorMsg: 'Failed to connect account. Please try again.',
      connectBtn: 'Connect Meta Account (Instagram / Facebook)',
      noAccounts: 'No Connected Accounts', noAccountsDesc: 'Connect your Instagram or Facebook account to start automating.',
      connected: 'Connected', disconnect: 'Disconnect', loading: 'Loading...',
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--db-primary)' }} />
        {t.loading}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.desc}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 size={15} /> {t.successMsg}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={15} /> {t.errorMsg}
          </div>
        )}

        {/* Connect button */}
        <button onClick={connectMeta}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors text-sm"
          style={{ backgroundColor: 'var(--db-primary)', color: '#ffffff' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}
        >
          <Plus size={16} /> {t.connectBtn}
        </button>

        {/* Accounts list */}
        {accounts.length === 0 ? (
          <div className="rounded-2xl p-12 text-center border border-dashed" style={{ borderColor: 'var(--db-border)' }}>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.noAccounts}</p>
            <p className="text-sm" style={{ color: 'var(--db-text-3)' }}>{t.noAccountsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div key={account.id} className="flex items-center gap-4 p-4 rounded-2xl border"
                style={{ backgroundColor: 'var(--db-surface)', borderColor: 'var(--db-border)', boxShadow: 'var(--db-shadow)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  account.account_type === 'instagram'
                    ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
                    : 'bg-blue-600'
                }`}>
                  {account.account_type === 'instagram' ? '📸' : '📘'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{account.account_name}</p>
                  <p className="text-xs" style={{ color: 'var(--db-text-3)' }}>
                    {account.account_type === 'instagram' ? 'Instagram Business' : 'Facebook Page'}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  <CheckCircle2 size={11} /> {t.connected}
                </span>
                <button onClick={() => disconnect(account.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 border"
                  style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                >
                  <Trash2 size={12} /> {t.disconnect}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
        <Loader2 className="animate-spin" size={20} style={{ color: 'var(--db-primary)' }} />
      </div>
    }>
      <AccountsContent />
    </Suspense>
  )
}
