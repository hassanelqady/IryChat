'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Link as LinkIcon, CheckCircle, Save, ExternalLink, Facebook, CreditCard, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({ name: '', email: '' })
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const t = {
    ar: {
      title: 'الإعدادات', subtitle: 'إدارة تفضيلات حسابك',
      profile: 'الملف الشخصي', connectedAccounts: 'الحسابات', billing: 'الفوترة',
      nameLabel: 'اسم العرض', emailLabel: 'البريد الإلكتروني',
      emailNote: 'البريد الإلكتروني مرتبط بحساب Meta ولا يمكن تغييره.',
      saveBtn: 'حفظ التغييرات', saved: 'تم الحفظ بنجاح!',
      loading: 'جاري التحميل...', manageAccountsDesc: 'أضف أو احذف الحسابات من صفحة الحسابات.',
      goToAccounts: 'إدارة الحسابات', noAccounts: 'لا توجد حسابات متصلة.',
      connectedAs: 'متصل عبر Meta', deleteAccount: 'حذف بياناتي',
      deleteAccountDesc: 'طلب حذف جميع بياناتك من IryChat.',
      deleteAccountLink: 'تقديم طلب الحذف', instagram: 'Instagram Business', facebook: 'Facebook Page',
    },
    en: {
      title: 'Settings', subtitle: 'Manage your account preferences',
      profile: 'Profile', connectedAccounts: 'Accounts', billing: 'Billing',
      nameLabel: 'Display Name', emailLabel: 'Email Address',
      emailNote: 'Email is managed by your Meta account and cannot be changed here.',
      saveBtn: 'Save Changes', saved: 'Changes saved successfully!',
      loading: 'Loading...', manageAccountsDesc: 'Add or remove your Instagram and Facebook accounts.',
      goToAccounts: 'Manage Accounts', noAccounts: 'No accounts connected yet.',
      connectedAs: 'Connected via Meta', deleteAccount: 'Delete My Data',
      deleteAccountDesc: 'Request deletion of all your data from IryChat.',
      deleteAccountLink: 'Submit Deletion Request', instagram: 'Instagram Business', facebook: 'Facebook Page',
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setProfile({ name: user.user_metadata?.full_name || user.user_metadata?.name || '', email: user.email || '' })
      const { data } = await supabase.from('connected_accounts').select('*').eq('user_id', user.id)
      setAccounts(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: profile.name } })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--db-text-3)' }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--db-primary)' }} /> {t.loading}
      </div>
    </div>
  )

  const tabs = [
    { id: 'profile',   label: t.profile,           icon: User },
    { id: 'accounts',  label: t.connectedAccounts,  icon: LinkIcon },
    { id: 'billing',   label: t.billing,            icon: CreditCard },
  ]

  const inp = `w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors`

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--db-bg)' }}>
      <div className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-xl font-bold" style={{ color: 'var(--db-text-h)' }}>{t.title}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--db-text-2)' }}>{t.subtitle}</p>
        </div>
        <div className="max-w-3xl mx-auto px-6 flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--db-primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--db-text-h)' : 'var(--db-text-2)',
              }}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">

        {activeTab === 'profile' && (
          <div className="space-y-4">
            {saved && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-sm text-green-700 dark:text-green-400">
                <CheckCircle size={15} /> {t.saved}
              </div>
            )}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
              <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl w-fit"
                style={{ backgroundColor: 'var(--db-primary-bg)', border: '1px solid var(--db-primary)' }}>
                <Facebook size={13} style={{ color: 'var(--db-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--db-primary)' }}>{t.connectedAs}</span>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{t.nameLabel}</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className={inp} style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--db-text-2)' }}>{t.emailLabel}</label>
                  <input type="email" value={profile.email} disabled
                    className={inp + ' opacity-50 cursor-not-allowed'}
                    style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)', color: 'var(--db-text-h)' }} />
                  <p className="text-xs mt-1" style={{ color: 'var(--db-text-3)' }}>{t.emailNote}</p>
                </div>
                <button type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--db-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--db-primary-h)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--db-primary)'}>
                  <Save size={14} /> {t.saveBtn}
                </button>
              </form>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--db-text-h)' }}>{t.deleteAccount}</h3>
              <p className="text-xs mb-3" style={{ color: 'var(--db-text-2)' }}>{t.deleteAccountDesc}</p>
              <Link href="/data-deletion"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: '#DC2626' }}>
                <ExternalLink size={13} /> {t.deleteAccountLink}
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
              <p className="text-sm mb-4" style={{ color: 'var(--db-text-2)' }}>{t.manageAccountsDesc}</p>
              {accounts.length === 0 ? (
                <p className="text-sm mb-4" style={{ color: 'var(--db-text-3)' }}>{t.noAccounts}</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {accounts.map(account => (
                    <div key={account.id} className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ backgroundColor: 'var(--db-bg)', borderColor: 'var(--db-border)' }}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${account.account_type === 'instagram' ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' : 'bg-blue-600'}`}>
                        {account.account_type === 'instagram' ? '📸' : '📘'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--db-text-h)' }}>{account.account_name}</p>
                        <p className="text-xs" style={{ color: 'var(--db-text-3)' }}>{account.account_type === 'instagram' ? t.instagram : t.facebook}</p>
                      </div>
                      <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-2 py-0.5 rounded-full font-medium">✓</span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/dashboard/accounts"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--db-primary)' }}>
                <ExternalLink size={14} /> {t.goToAccounts}
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--db-surface)', border: '1px solid var(--db-border)' }}>
            <Link href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--db-primary)' }}>
              <CreditCard size={14} /> {lang === 'ar' ? 'إدارة الاشتراك' : 'Manage Subscription'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
