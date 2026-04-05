'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function AccountsContent() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const { t } = useLanguage()

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

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
    <div style={{ minHeight: '100vh', background: '#05080f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff' }}>
      {t('loading')}
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(110px)', top: '-200px', right: '-180px' }}></div>
        <div style={{ position: 'absolute', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(0,80,255,0.11)', filter: 'blur(110px)', bottom: '-150px', left: '-150px' }}></div>
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '0.85rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,0.75)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#00d4ff', textDecoration: 'none' }}>IryChat</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>{t('dashboard')}</Link>
          <Link href="/dashboard/accounts" style={{ color: '#00d4ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', background: 'rgba(0,212,255,0.1)' }}>{t('accounts')}</Link>
          <Link href="/dashboard/flows" style={{ color: '#eef2ff', textDecoration: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>{t('automations')}</Link>
          <LanguageSwitcher />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,212,255,0.05)', padding: '0.3rem 0.8rem 0.3rem 1rem', borderRadius: '99px', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff', fontSize: '0.85rem' }}>{user?.email?.split('@')[0]}</span>
            <button onClick={handleLogout} style={{ background: 'transparent', padding: '0.3rem 0.8rem', borderRadius: '99px', color: '#eef2ff', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>{t('logout')}</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '7rem 2rem 5rem', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t('connectAccounts')}</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>{t('connectAccountsDesc')}</p>

        {success && (
          <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade80', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#4ade80' }}>
            {t('successConnect')}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid #ff5050', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#ff5050' }}>
            {t('errorConnect')}
          </div>
        )}

        <button onClick={connectMeta} style={{ background: 'linear-gradient(135deg,#0866ff,#1877f2)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 2rem', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📘</span> {t('connectMetaBtn')}
        </button>

        {accounts.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>{t('noAccounts')}</div>
            <div style={{ fontSize: '0.85rem' }}>{t('noAccountsDesc')}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {accounts.map(account => (
              <div key={account.id} style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: account.account_type === 'instagram' ? 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)' : '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {account.account_type === 'instagram' ? '📸' : '📘'}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{account.account_name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      {account.account_type === 'instagram' ? 'Instagram Business' : 'Facebook Page'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '0.25rem 0.75rem', borderRadius: '99px', border: '1px solid rgba(74,222,128,0.3)' }}>{t('connected')}</span>
                  <button onClick={() => disconnect(account.id)} style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff5050', borderRadius: 8, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    {t('disconnect')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function AccountsPage() {
  return <Suspense><AccountsContent /></Suspense>
}
