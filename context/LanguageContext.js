'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  ar: {
    // Navbar
    accounts: 'الحسابات',
    automations: 'الأتمتة',
    logout: 'خروج',
    hello: 'مرحباً',

    // Dashboard
    dashboard: 'لوحة التحكم',
    dashboardSubtitle: 'إليك ملخص حسابك',
    activeAutomations: 'أتمتة نشطة',
    totalReplies: 'ردود تلقائية',
    connectedAccounts: 'حسابات مربوطة',
    fromTotal: 'من أصل',
    totalOps: 'إجمالي العمليات',
    noAccountWarning: 'لم تربط حسابك بعد',
    noAccountDesc: 'اربط حساب Instagram أو Facebook للبدء في استخدام الأتمتة',
    connectAccount: 'ربط الحساب',
    quickActions: 'إجراءات سريعة',
    newAutomation: 'أتمتة جديدة',
    allAutomations: 'كل الأتمتة',
    manageView: 'عرض وإدارة',
    connectIG: 'ربط Instagram / Facebook',
    autoReplyDM: 'رد تلقائي + DM',

    // Accounts
    connectAccounts: 'ربط الحسابات',
    connectAccountsDesc: 'اربط حساباتك على Instagram وFacebook',
    connectMetaBtn: 'ربط حساب Facebook / Instagram',
    noAccounts: 'لا توجد حسابات مربوطة بعد',
    noAccountsDesc: 'اضغط على الزر أعلاه لربط حسابك',
    connected: '● متصل',
    disconnect: 'فصل',
    successConnect: '✅ تم ربط الحسابات بنجاح!',
    errorConnect: '❌ حدث خطأ في الاتصال',

    // Automations
    automationsTitle: 'الأتمتة',
    automationsDesc: 'ردود تلقائية على التعليقات والرسائل',
    newAutomationBtn: '+ إنشاء أتمتة جديدة',
    noAutomations: 'لا توجد أتمتة بعد',
    noAutomationsDesc: 'أنشئ أول أتمتة للرد التلقائي على التعليقات وإرسال DM',
    active: '● نشط',
    inactive: '○ متوقف',
    stop: 'إيقاف',
    start: 'تشغيل',
    edit: 'تعديل',
    delete: 'حذف',
    keyword: 'كلمة',

    // New/Edit Automation
    newAutomationTitle: 'إنشاء أتمتة جديدة',
    newAutomationSubtitle: 'سيتم الرد تلقائياً عند كتابة الكلمة المحددة في التعليقات',
    editAutomationTitle: 'تعديل الأتمتة',
    editAutomationSubtitle: 'عدّل إعدادات الأتمتة الخاصة بك',
    basicInfo: '① المعلومات الأساسية',
    automationName: 'اسم الأتمتة *',
    automationNamePlaceholder: 'مثال: رد على طلبات السعر',
    linkedAccount: 'الحساب المرتبط *',
    selectAccount: 'اختر الحساب...',
    postUrl: 'رابط البوست (اختياري)',
    postUrlPlaceholder: 'https://www.instagram.com/p/...',
    postUrlHint: 'اتركه فارغاً للتطبيق على كل البوستات',
    noLinkedAccounts: '⚠️ لا توجد حسابات مربوطة —',
    linkFirst: 'اربط حسابك أولاً',
    triggerWord: '② كلمة التشغيل',
    triggerKeyword: 'الكلمة المحفزة *',
    triggerPlaceholder: 'مثال: سعر',
    triggerHint: 'عند كتابة أي متابع لهذه الكلمة في التعليقات، سيتم تشغيل الأتمتة تلقائياً',
    responses: '③ الردود التلقائية',
    commentReply: 'الرد على التعليق',
    commentReplyPlaceholder: 'مثال: شكراً! سنتواصل معك عبر الخاص 📩',
    dmMessage: 'رسالة DM التلقائية',
    dmPlaceholder: 'مثال: مرحباً! شكراً على اهتمامك...',
    createBtn: '✓ إنشاء الأتمتة',
    saveBtn: '✓ حفظ التغييرات',
    cancelBtn: 'إلغاء',
    saving: 'جاري الحفظ...',
    creating: 'جاري الإنشاء...',
    backToAutomations: '← العودة للأتمتة',
    fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
    addReply: 'يجب إضافة رد على التعليق أو رسالة DM على الأقل',

    // Auth
    login: 'تسجيل الدخول',
    loginSubtitle: 'مرحباً بعودتك! سجل دخولك للمتابعة',
    signup: 'إنشاء حساب',
    signupSubtitle: 'انضم إلى IryChat وابدأ رحلتك',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم كاملاً',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginBtn: 'دخول',
    signupBtn: 'إنشاء حساب',
    haveAccount: 'لديك حساب؟',
    noAccount: 'إنشاء حساب جديد',
    loading: 'جاري...',
    wrongCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    passwordMismatch: 'كلمة المرور غير متطابقة',
    passwordShort: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    alreadyRegistered: 'هذا البريد الإلكتروني مسجل مسبقاً',
    genericError: 'حدث خطأ، حاول مرة أخرى',
  },

  en: {
    // Navbar
    accounts: 'Accounts',
    automations: 'Automations',
    logout: 'Logout',
    hello: 'Hello',

    // Dashboard
    dashboard: 'Dashboard',
    dashboardSubtitle: "Here's your account summary",
    activeAutomations: 'Active Automations',
    totalReplies: 'Auto Replies',
    connectedAccounts: 'Connected Accounts',
    fromTotal: 'out of',
    totalOps: 'total operations',
    noAccountWarning: "You haven't connected an account yet",
    noAccountDesc: 'Connect an Instagram or Facebook account to start using automations',
    connectAccount: 'Connect Account',
    quickActions: 'Quick Actions',
    newAutomation: 'New Automation',
    allAutomations: 'All Automations',
    manageView: 'View & Manage',
    connectIG: 'Connect Instagram / Facebook',
    autoReplyDM: 'Auto Reply + DM',

    // Accounts
    connectAccounts: 'Connect Accounts',
    connectAccountsDesc: 'Connect your Instagram and Facebook accounts',
    connectMetaBtn: 'Connect Facebook / Instagram',
    noAccounts: 'No accounts connected yet',
    noAccountsDesc: 'Click the button above to connect your account',
    connected: '● Connected',
    disconnect: 'Disconnect',
    successConnect: '✅ Accounts connected successfully!',
    errorConnect: '❌ Connection failed',

    // Automations
    automationsTitle: 'Automations',
    automationsDesc: 'Auto replies to comments and messages',
    newAutomationBtn: '+ New Automation',
    noAutomations: 'No automations yet',
    noAutomationsDesc: 'Create your first automation to auto-reply to comments and send DMs',
    active: '● Active',
    inactive: '○ Paused',
    stop: 'Pause',
    start: 'Activate',
    edit: 'Edit',
    delete: 'Delete',
    keyword: 'Keyword',

    // New/Edit Automation
    newAutomationTitle: 'New Automation',
    newAutomationSubtitle: 'Auto-reply when a keyword is written in comments',
    editAutomationTitle: 'Edit Automation',
    editAutomationSubtitle: 'Update your automation settings',
    basicInfo: '① Basic Info',
    automationName: 'Automation Name *',
    automationNamePlaceholder: 'e.g. Reply to price requests',
    linkedAccount: 'Linked Account *',
    selectAccount: 'Select account...',
    postUrl: 'Post URL (optional)',
    postUrlPlaceholder: 'https://www.instagram.com/p/...',
    postUrlHint: 'Leave empty to apply to all posts',
    noLinkedAccounts: '⚠️ No accounts connected —',
    linkFirst: 'Connect your account first',
    triggerWord: '② Trigger Keyword',
    triggerKeyword: 'Trigger Keyword *',
    triggerPlaceholder: 'e.g. price',
    triggerHint: 'When any follower writes this word in comments, the automation will trigger',
    responses: '③ Auto Responses',
    commentReply: 'Comment Reply',
    commentReplyPlaceholder: 'e.g. Thanks! We\'ll message you shortly 📩',
    dmMessage: 'Auto DM Message',
    dmPlaceholder: 'e.g. Hi! Thanks for your interest...',
    createBtn: '✓ Create Automation',
    saveBtn: '✓ Save Changes',
    cancelBtn: 'Cancel',
    saving: 'Saving...',
    creating: 'Creating...',
    backToAutomations: '← Back to Automations',
    fillRequired: 'Please fill all required fields',
    addReply: 'Please add a comment reply or DM message',

    // Auth
    login: 'Sign In',
    loginSubtitle: 'Welcome back! Sign in to continue',
    signup: 'Create Account',
    signupSubtitle: 'Join IryChat and get started',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot password?',
    loginBtn: 'Sign In',
    signupBtn: 'Create Account',
    haveAccount: 'Already have an account?',
    noAccount: 'Create new account',
    loading: 'Loading...',
    wrongCredentials: 'Invalid email or password',
    passwordMismatch: 'Passwords do not match',
    passwordShort: 'Password must be at least 6 characters',
    alreadyRegistered: 'This email is already registered',
    genericError: 'Something went wrong, please try again',
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar')

  useEffect(() => {
    const saved = localStorage.getItem('irychat_lang')
    if (saved) setLang(saved)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar'
    setLang(newLang)
    localStorage.setItem('irychat_lang', newLang)
  }

  const t = (key) => translations[lang][key] || key

  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} style={{
        fontFamily: isRTL
          ? "'Cairo', 'Tajawal', sans-serif"
          : "'Inter', sans-serif"
      }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
