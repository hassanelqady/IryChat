'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

function AccountsContent() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')

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
    <div style={{minHeight:'100vh',background:'#05080f',display:'flex',alignItems:'center',justifyContent:'center',color:'#00d4ff'}}>
      جاري التحميل...
    </div>
  )

  return (
    <main style={{minHeight:'100vh',background:'#05080f',padding:'2rem'}}>
      <div style={{maxWidth:800,margin:'0 auto',paddingTop:'5rem'}}>
        <h1 style={{color:'#fff',fontSize:'1.8rem',marginBottom:'0.5rem'}}>ربط الحسابات</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'2rem'}}>اربط حساباتك على Instagram وFacebook</p>

        {success && (
          <div style={{background:'rgba(74,222,128,0.1)',border:'1px solid #4ade80',borderRadius:12,padding:'1rem',marginBottom:'1.5rem',color:'#4ade80'}}>
            ✅ تم ربط الحسابات بنجاح!
          </div>
        )}
        {error && (
          <div style={{background:'rgba(255,80,80,0.1)',border:'1px solid #ff5050',borderRadius:12,padding:'1rem',marginBottom:'1.5rem',color:'#ff5050'}}>
            ❌ حدث خطأ في الاتصال
          </div>
        )}

        <button onClick={connectMeta} style={{background:'linear-gradient(135deg,#0866ff,#1877f2)',color:'#fff',border:'none',borderRadius:12,padding:'0.9rem 2rem',fontSize:'1rem',cursor:'pointer',marginBottom:'2rem'}}>
          ربط حساب Facebook / Instagram
        </button>

        {accounts.length === 0 ? (
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'3rem',textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
            لا توجد حسابات مربوطة بعد
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {accounts.map(account => (
              <div key={account.id} style={{background:'rgba(255,255,255,0.035)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'1.2rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:account.account_type==='instagram'?'linear-gradient(135deg,#f09433,#dc2743,#bc1888)':'#1877f2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>
                    {account.account_type === 'instagram' ? '📸' : '📘'}
                  </div>
                  <div>
                    <div style={{color:'#fff',fontWeight:600}}>{account.account_name}</div>
                    <div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem'}}>{account.account_type === 'instagram' ? 'Instagram' : 'Facebook Page'}</div>
                  </div>
                </div>
                <button onClick={() => disconnect(account.id)} style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff5050',borderRadius:8,padding:'0.4rem 1rem',cursor:'pointer'}}>
                  فصل
                </button>
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
