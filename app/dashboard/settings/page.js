cat > app/forgot-password/page.js << 'EOF'
import { redirect } from 'next/navigation'

export default function ForgotPasswordPage() {
  redirect('/login')
}
EOF
cat > app/reset-password/page.js << 'EOF'
import { redirect } from 'next/navigation'

export default function ResetPasswordPage() {
  redirect('/login')
}
EOF
git add .
git commit -m "refactor: remove password auth, redirect to login"
git push
age } from '@/context/LanguageContext'
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

  const content = {
    en: {
      settings: "Settings",
      subtitle: "Manage your account preferences",
      profile: "Profile",
      connectedAccounts: "Connected Accounts",
      nameLabel: "Display Name",
      emailLabel: "Email Address",
      emailNote: "Email is managed by your Meta account and cannot be changed here.",
      saveBtn: "Save Changes",
      saved: "Changes saved successfully!",
      loading: "Loading...",
      manageAccounts: "Manage Connected Accounts",
      manageAccountsDesc: "Add or remove your Instagram and Facebook accounts from the Accounts page.",
      goToAccounts: "Go to Accounts",
      noAccounts: "No accounts connected yet.",
      connectedAs: "Connected via Meta",
      logout: "Logout",
      deleteAccount: "Delete My Data",
      deleteAccountDesc: "Request deletion of all your data from IryChat.",
      deleteAccountLink: "Submit Deletion Request",
      instagram: "Instagram Business",
      facebook: "Facebook Page",
    },
    ar: {
      settings: "الإعدادات",
      subtitle: "إدارة تفضيلات حسابك",
      profile: "الملف الشخصي",
      connectedAccounts: "الحسابات المتصلة",
      nameLabel: "اسم العرض",
      emailLabel: "البريد الإلكتروني",
      emailNote: "البريد الإلكتروني مرتبط بحساب Meta ولا يمكن تغييره من هنا.",
      saveBtn: "حفظ التغييرات",
      saved: "تم حفظ التغييرات بنجاح!",
      loading: "جاري التحميل...",
      manageAccounts: "إدارة الحسابات المتصلة",
      manageAccountsDesc: "أضف أو احذف حسابات إنستجرام وفيسبوك من صفحة الحسابات.",
      goToAccounts: "الذهاب للحسابات",
      noAccounts: "لا توجد حسابات متصلة بعد.",
      connectedAs: "متصل عبر Meta",
      logout: "تسجيل الخروج",
      deleteAccount: "حذف بياناتي",
      deleteAccountDesc: "طلب حذف جميع بياناتك من منصة IryChat.",
      deleteAccountLink: "تقديم طلب الحذف",
      instagram: "Instagram Business",
      facebook: "Facebook Page",
    }
  }

  const t = content[lang]

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setProfile({
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
      })
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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-cyan-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-xl font-medium">{t.loading}</span>
      </div>
    </div>
  )

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t.settings}</h1>
            <p className="text-gray-400">{t.subtitle}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium transition-all"
          >
            <LogOut size={18} />
            {t.logout}
          </button>
        </div>

        {/* Success Alert */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-green-400"
          >
            <CheckCircle size={20} />
            {t.saved}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8">
          {[
            { id: 'profile', label: t.profile, icon: User },
            { id: 'accounts', label: t.connectedAccounts, icon: LinkIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-6">

              {/* Meta badge */}
              <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-fit">
                <Facebook size={16} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">{t.connectedAs}</span>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.nameLabel}</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-600 mt-2">{t.emailNote}</p>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {t.saveBtn}
                </button>
              </form>
            </div>

            {/* Delete Data */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
              <h3 className="text-white font-bold mb-1">{t.deleteAccount}</h3>
              <p className="text-gray-500 text-sm mb-4">{t.deleteAccountDesc}</p>
              <Link
                href="/data-deletion"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                <ExternalLink size={14} />
                {t.deleteAccountLink}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Connected Accounts Tab */}
        {activeTab === 'accounts' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-6">
              <p className="text-gray-400 text-sm mb-6">{t.manageAccountsDesc}</p>

              {/* Accounts preview */}
              {accounts.length === 0 ? (
                <p className="text-gray-600 text-sm mb-6">{t.noAccounts}</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {accounts.map(account => (
                    <div key={account.id} className="flex items-center gap-3 p-4 bg-black/20 border border-white/10 rounded-2xl">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        account.account_type === 'instagram'
                          ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
                          : 'bg-blue-600'
                      }`}>
                        {account.account_type === 'instagram' ? '📸' : '📘'}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{account.account_name}</p>
                        <p className="text-gray-500 text-xs">
                          {account.account_type === 'instagram' ? t.instagram : t.facebook}
                        </p>
                      </div>
                      <div className="ms-auto">
                        <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                          ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/dashboard/accounts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all text-sm"
              >
                <ExternalLink size={16} />
                {t.goToAccounts}
              </Link>
            </div>
          </motion.div>
        )}

      </main>
    </PageLayoutWith3D>
  )
}
