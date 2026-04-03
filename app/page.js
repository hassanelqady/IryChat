'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

// ── Animation Variants ──────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// ── Static Data ──────────────────────────────────────────────
const CHAT_MESSAGES = {
  ar: [
    { type: 'in',  text: 'كم سعر المنتج؟ 😍' },
    { type: 'out', text: '👋 أهلاً! عندنا عروض حلوة النهارده. تحب أبعتلك الكاتالوج؟' },
    { type: 'in',  text: 'أيوه طبعاً!' },
    { type: 'out', text: '✅ تم! وعندنا خصم 20% هذا الأسبوع فقط 🎁' },
    { type: 'in',  text: 'تمام، عايز أطلب' },
    { type: 'out', text: '🔥 ممتاز! اضغط هنا لإتمام الطلب 👇 IryChat.io/order' },
  ],
  en: [
    { type: 'in',  text: "What's the price? 😍" },
    { type: 'out', text: "👋 Hey! We have great offers today. Want me to send the catalog?" },
    { type: 'in',  text: "Yes please!" },
    { type: 'out', text: "✅ Sent! We also have 20% off this week only 🎁" },
    { type: 'in',  text: "Awesome, I want to order" },
    { type: 'out', text: "🔥 Great! Click here to complete your order 👇 IryChat.io/order" },
  ],
}

const FAQ_DATA = {
  ar: [
    { q: 'هل IryChat معتمد من ميتا وانستجرام؟',   a: 'أيوه 100%. بنستخدم Meta Graph API الرسمي ومتوافقون تماماً مع سياسات ميتا. حسابك في أمان.' },
    { q: 'هل محتاج خبرة تقنية؟',                   a: 'لأ خالص. الواجهة visual drag & drop بالكامل. لو تعرف تبعت DM على انستجرام تقدر تشغّل IryChat في أقل من 10 دقايق.' },
    { q: 'أقدر أجرب قبل ما أدفع؟',                 a: 'طبعاً! الخطة المجانية دايماً موجودة. والبرو فيها 14 يوم تجربة مجانية بدون كريدت كارد.' },
    { q: 'هل هيحس المتابع إنه بيكلم بوت؟',         a: 'ده بيرجع لإنت. تقدر تعمل ردود طبيعية جداً وبشرية. كتير من عملائنا بيقولوا إن متابعيهم مش بيلاحظوا الفرق.' },
    { q: 'أقدر ألغي الاشتراك وقت ما أنا عايز؟',   a: 'أيوه، في أي وقت بضغطة واحدة من الداشبورد. مفيش عقود ومفيش رسوم إلغاء.' },
  ],
  en: [
    { q: 'Is IryChat approved by Meta & Instagram?', a: 'Yes, 100%. We use the official Meta Graph API and are fully compliant with Meta & Instagram policies.' },
    { q: 'Do I need technical skills?',               a: 'Not at all. The interface is fully visual drag & drop. If you can send a DM on Instagram, you can run IryChat in under 10 minutes.' },
    { q: 'Can I try before paying?',                  a: 'Absolutely! The free plan is always available. Pro also comes with a 14-day free trial — no credit card required.' },
    { q: "Will followers know they're talking to a bot?", a: "That's entirely up to you. You can craft very natural, human-sounding replies. Many users say their followers don't notice the difference." },
    { q: 'Can I cancel anytime?',                     a: 'Yes, anytime with one click from your dashboard. No contracts, no cancellation fees whatsoever.' },
  ],
}

const TESTIMONIALS = {
  ar: [
    { name: 'نور محمد',  role: 'صاحبة متجر موضة',          stars: 5, text: '"زاد مبيعاتي 3 أضعاف في شهرين! كل ما حد يكتب \'اسعار\' في الكومنتات يوصله رسالة ويشتري."' },
    { name: 'علي خالد',  role: 'مدير تسويق — إيجنسي',      stars: 5, text: '"كنت بصرف على موظف بيرد على DMs. دلوقتي وفّرت ده كله. الـ ROI واضح من أول أسبوع."' },
    { name: 'سلمى علي',  role: 'كوتش تنمية بشرية',         stars: 5, text: '"في ساعة واحدة عملت flow كامل. البوت بيرد أسرع مني وأذكى. العملاء مش مصدقين إنه بوت!"' },
  ],
  en: [
    { name: 'Nour Mohamed', role: 'Fashion Store Owner',          stars: 5, text: '"My sales tripled in 2 months! Every time someone comments \'price\', they get an auto message and buy."' },
    { name: 'Ali Khaled',   role: 'Marketing Director — Agency',  stars: 5, text: '"I used to pay someone to reply to DMs. Now that budget is saved and ROI was clear from the first week."' },
    { name: 'Salma Ali',    role: 'Life & Business Coach',        stars: 5, text: "\"In one hour I had a complete flow running. The bot replies faster and smarter. Clients can't believe it's automated!\"" },
  ],
}

// ── Helpers ──────────────────────────────────────────────────
function setDocLang(lang) {
  document.documentElement.setAttribute('data-lang', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

// ── Sub-components ───────────────────────────────────────────
function StarRating({ count }) {
  return (
    <div className="stars">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </div>
  )
}

function StatItem({ number, labelAr, labelEn }) {
  return (
    <div className="stat">
      <div className="stat-number">{number}</div>
      <div className="stat-label">
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </div>
    </div>
  )
}

function HighlightCard({ icon, titleAr, titleEn, value, subAr, subEn }) {
  return (
    <motion.div variants={fadeUp} className="hcard gl">
      <div className="hci">{icon}</div>
      <div className="hct"><span className="ar">{titleAr}</span><span className="en">{titleEn}</span></div>
      <div className="hcv">{value}</div>
      <div className="hcs"><span className="ar">{subAr}</span><span className="en">{subEn}</span></div>
    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────────────
export default function Home() {
  const [lang, setLang]               = useState('ar')
  const [openFaq, setOpenFaq]         = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const chatBoxRef                    = useRef(null)

  // ── Language init ──
  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'ar'
    setLang(saved)
    setDocLang(saved)
  }, [])

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    setDocLang(newLang)
  }

  // ── Scroll helper ──
  const scrollTo = (id) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // ── Signup handler ──
  const handleSignup = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (email?.includes('@')) {
      alert(lang === 'ar'
        ? 'شكراً! سيصلك رابط التفعيل على بريدك الإلكتروني'
        : 'Thanks! You will receive an activation link via email')
      e.target.reset()
    } else {
      alert(lang === 'ar'
        ? 'الرجاء إدخال بريد إلكتروني صحيح'
        : 'Please enter a valid email')
    }
  }

  // ── Chat animation ──
  useEffect(() => {
    let chatIndex = 0
    const timeouts = []
    const messages = CHAT_MESSAGES[lang] ?? CHAT_MESSAGES.ar

    const addMessage = (msg) => {
      if (!chatBoxRef.current) return
      const el = document.createElement('div')
      el.className = msg.type === 'out' ? 'msg mout' : 'msg min gl'
      el.innerHTML = `${msg.text}<div class="msg-time">now</div>`
      chatBoxRef.current.appendChild(el)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }

    const next = () => {
      if (chatIndex >= messages.length) {
        timeouts.push(setTimeout(() => {
          if (chatBoxRef.current) chatBoxRef.current.innerHTML = ''
          chatIndex = 0
          next()
        }, 3500))
        return
      }

      const msg = messages[chatIndex]

      if (msg.type === 'out') {
        const typing = document.createElement('div')
        typing.className = 'typ gl'
        typing.innerHTML = '<div class="td"></div><div class="td"></div><div class="td"></div>'
        chatBoxRef.current?.appendChild(typing)
        chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)

        timeouts.push(setTimeout(() => {
          typing.remove()
          addMessage(msg)
          chatIndex++
          timeouts.push(setTimeout(next, 1700))
        }, 1000))
      } else {
        addMessage(msg)
        chatIndex++
        timeouts.push(setTimeout(next, 900))
      }
    }

    next()
    return () => timeouts.forEach(clearTimeout)
  }, [lang])

  // ── Derived data ──
  const currentFaq          = FAQ_DATA[lang]    ?? FAQ_DATA.ar
  const currentTestimonials = TESTIMONIALS[lang] ?? TESTIMONIALS.ar

  return (
    <main>

      {/* ── Background ── */}
      <div className="bg-mesh">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="bg-grid" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <Link href="/" className="logo">IryChat</Link>

        <ul className="nav-links">
          <li><button onClick={() => scrollTo('how')}><span className="ar">كيف يعمل</span><span className="en">How It Works</span></button></li>
          <li><button onClick={() => scrollTo('features')}><span className="ar">المميزات</span><span className="en">Features</span></button></li>
          <li><button onClick={() => scrollTo('pricing')}><span className="ar">الأسعار</span><span className="en">Pricing</span></button></li>
          <li><button onClick={() => scrollTo('faq')}>FAQ</button></li>
        </ul>

        <div className="nav-right">
          <div className="lang-toggle">
            <button className={lang === 'ar' ? 'active' : ''} onClick={() => changeLang('ar')}>AR</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
          </div>
          <Link href="/login" className="btn-login">
            <span className="ar">تسجيل دخول</span>
            <span className="en">Login</span>
          </Link>
          <button className="hamburger" onClick={() => setMobileMenuOpen(o => !o)}>
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button onClick={() => scrollTo('how')}><span className="ar">كيف يعمل</span><span className="en">How It Works</span></button>
        <button onClick={() => scrollTo('features')}><span className="ar">المميزات</span><span className="en">Features</span></button>
        <button onClick={() => scrollTo('pricing')}><span className="ar">الأسعار</span><span className="en">Pricing</span></button>
        <button onClick={() => scrollTo('faq')}>FAQ</button>
      </div>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="pill gl">
          <span className="pdot" />
          <span className="ar">أذكى حلول الأتمتة</span>
          <span className="en">The Smartest Automation Solution</span>
        </div>

        <h1>
          <span className="ar">استفد إلى أقصى حد من كل <span className="cy">محادثة</span></span>
          <span className="en">Make the most out of every <span className="cy">conversation</span></span>
        </h1>

        <p className="hero-sub">
          <span className="ar">قم بزيادة مبيعاتك، وعزز تفاعلك، ووسع جمهورك من خلال أتمتة قوية لمنصات إنستجرام وواتساب وتيك توك وماسنجر.</span>
          <span className="en">Sell more, engage better, and grow your audience with powerful automations for Instagram, WhatsApp, TikTok, and Messenger.</span>
        </p>

        <div className="hero-btns">
          <Link href="/login" className="btn-p">
            <span className="ar">ابدأ</span>
            <span className="en">GET STARTED</span>
          </Link>
          <button className="btn-o" onClick={() => scrollTo('how')}>
            <span className="ar">اكتشف آلية العمل ▶</span>
            <span className="en">Discover How It Works ▶</span>
          </button>
        </div>

        {/* Chat Mockup */}
        <div className="mockup-wrap">
          <div className="gl" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div className="mock-bar gl">
              <div className="mavatar">📸</div>
              <div>
                <div className="mname">IryChat — Instagram</div>
                <div className="mstatus">
                  <span className="ar">● نشط الآن</span>
                  <span className="en">● Active now</span>
                </div>
              </div>
              <div className="dots">
                <div className="dot-w" style={{ background: '#ff5f57' }} />
                <div className="dot-w" style={{ background: '#ffbd2e' }} />
                <div className="dot-w" style={{ background: '#28c840' }} />
              </div>
            </div>
            <div className="chat-body" ref={chatBoxRef} />
          </div>

          <div className="fbadges">
            <div className="fb fb1 gl">📊 <span className="ar">98% معدل الفتح</span><span className="en">98% Open Rate</span></div>
            <div className="fb fb2 gl">⚡ <span className="ar">رد في ثانية</span><span className="en">1s Response</span></div>
            <div className="fb fb3 gl">🔥 <span className="ar">×3.4 تحويلات</span><span className="en">×3.4 Conversions</span></div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="stats-section"
      >
        <div className="stats-grid">
          <StatItem number="+15K" labelAr="مستخدم نشط"     labelEn="Active Users"     />
          <StatItem number="98%"  labelAr="معدل الفتح"      labelEn="Open Rate"        />
          <StatItem number="×3.4" labelAr="زيادة التحويلات" labelEn="More Conversions" />
          <StatItem number="24/7" labelAr="رد تلقائي"       labelEn="Auto Reply"       />
          <StatItem number="<1s"  labelAr="وقت الرد"        labelEn="Response Time"    />
        </div>
      </motion.div>

      {/* ── How It Works ── */}
      <section id="how" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag"><span className="ar">اكتشف آلية العمل</span><span className="en">Discover How It Works</span></div>
          <h2 className="section-title"><span className="ar">ابدأ في 3 خطوات</span><span className="en">Get Started in 3 Steps</span></h2>
          <p className="section-sub"><span className="ar">من ربط الحساب لأول بيع تلقائي — في أقل من 10 دقايق</span><span className="en">From account connection to your first automated sale — in under 10 minutes</span></p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="steps-grid">
          {[
            { num: '01', titleAr: 'وصّل انستجرامك',      titleEn: 'Connect Instagram',     descAr: 'ربط حسابك عن طريق Meta API الرسمي — آمن 100% ومتوافق مع سياسات ميتا.',                                          descEn: 'Connect via the official Meta API — 100% secure & fully compliant with Meta policies.' },
            { num: '02', titleAr: 'صمّم الـ Flow',        titleEn: 'Build Your Flow',       descAr: 'استخدم الـ Visual Builder لتحديد الردود التلقائية على DMs والكومنتات بكلمات مفتاحية.',                           descEn: 'Use the Visual Builder to create automated replies for DMs and comments with keywords.' },
            { num: '03', titleAr: 'شغّل وشوف النتيجة',   titleEn: 'Launch & See Results',  descAr: 'IryChat يشتغل 24/7 وإنت بتتابع المبيعات والتحويلات على الداشبورد بالريال تايم.',                                  descEn: 'IryChat runs 24/7 while you track sales and conversions on your real-time dashboard.' },
          ].map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="step-card gl">
              <div className="step-number">{step.num}</div>
              <h3><span className="ar">{step.titleAr}</span><span className="en">{step.titleEn}</span></h3>
              <p><span className="ar">{step.descAr}</span><span className="en">{step.descEn}</span></p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="section features-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag"><span className="ar">المميزات</span><span className="en">Features</span></div>
          <h2 className="section-title">
            <span className="ar">كل أدوات الأتمتة<br />في مكان واحد</span>
            <span className="en">All Automation Tools<br />In One Place</span>
          </h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="features-grid">
          {[
            { icon: '💬', titleAr: 'رد تلقائي على DMs',   titleEn: 'Auto DM Replies',         descAr: 'حدد كلمات مفتاحية وIryChat يرد فوراً ويكمّل المحادثة لحد ما الشخص يشتري.',                        descEn: 'Set keywords and IryChat instantly replies, guiding conversations until the sale is done.' },
            { icon: '📝', titleAr: 'أتمتة الكومنتات',     titleEn: 'Comment Automation',      descAr: 'أي حد يكتب "اسعار" في الكومنتات — IryChat يبعتله رسالة خاصة في ثواني.',                           descEn: 'Anyone who comments "price" gets an instant private message automatically within seconds.' },
            { icon: '📸', titleAr: 'Story Mentions',       titleEn: 'Story Mentions',          descAr: 'أي حد يمنشنك في ستوريه يوصله رد تلقائي يشكره ويعرض عليه حاجة ذات قيمة.',                          descEn: 'Anyone who mentions you in their story gets an automatic personalized reply with a value offer.' },
            { icon: '🏷️', titleAr: 'تقسيم الجمهور',      titleEn: 'Audience Segmentation',   descAr: 'صنّف متابعينك بتاجز تلقائية بناءً على تفاعلهم وابعت لكل شريحة رسالتها الصح.',                    descEn: 'Auto-tag subscribers by behavior and send each segment the perfectly tailored message.' },
            { icon: '📊', titleAr: 'Analytics متعمقة',    titleEn: 'Deep Analytics',          descAr: 'تابع معدلات الفتح والكليك والتحويل بالريال تايم. اعرف إيه الـ flow الأكثر تحويلاً.',               descEn: 'Track open rates, clicks & conversions in real-time. Know exactly which flow converts best.' },
            { icon: '🔗', titleAr: 'API + Webhooks',       titleEn: 'API + Webhooks',          descAr: 'وصّل IryChat بأي نظام خارجي — CRM أو متجرك — عن طريق REST API كامل.',                             descEn: 'Connect IryChat to any external system — CRM, your store — via a full REST API.' },
          ].map((f) => (
            <motion.div key={f.titleEn} variants={fadeUp} className="feature-card gl">
              <div className="feature-icon">{f.icon}</div>
              <h3><span className="ar">{f.titleAr}</span><span className="en">{f.titleEn}</span></h3>
              <p><span className="ar">{f.descAr}</span><span className="en">{f.descEn}</span></p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Highlight ── */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="highlight-section"
      >
        <div className="highlight-wrap">
          <div className="highlight-text">
            <motion.div variants={fadeUp}>
              <div className="stag"><span className="ar">قوة انستجرام</span><span className="en">Instagram Power</span></div>
              <h2 className="section-title">
                <span className="ar">كل تفاعل<br /><span className="cy">فرصة بيع</span></span>
                <span className="en">Every Interaction<br />A <span className="cy">Sales Chance</span></span>
              </h2>
              <p>
                <span className="ar">انستجرام مش بس منصة عرض — هو أقوى قناة مبيعات. IryChat يحوّل كل DM وكومنت ومنشن لمحادثة بيع حقيقية تلقائياً.</span>
                <span className="en">Instagram isn't just a showcase — it's your most powerful sales channel. IryChat turns every DM, comment & mention into a real sales conversation, automatically.</span>
              </p>
              <ul className="check-list">
                {[
                  { ar: 'رد على DMs في أقل من ثانية',         en: 'Reply to DMs in under 1 second' },
                  { ar: 'أتمتة الكومنتات بكلمات مفتاحية',    en: 'Comment automation with keywords' },
                  { ar: 'تحويل Story Mentions لعملاء',         en: 'Convert Story Mentions to customers' },
                  { ar: 'بث جماعي للـ subscribers',            en: 'Broadcast messages to all subscribers' },
                  { ar: 'متوافق 100% مع سياسات ميتا',         en: '100% compliant with Meta policies' },
                ].map((item) => (
                  <li key={item.en}>
                    <span className="check-icon">✓</span>
                    <span className="ar">{item.ar}</span>
                    <span className="en">{item.en}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="highlight-cards">
            <HighlightCard icon="💬" titleAr="DMs اليوم"      titleEn="Today's DMs"       value="247"   subAr="↑ 89% من أمس"          subEn="↑ 89% vs yesterday" />
            <HighlightCard icon="🎯" titleAr="معدل التحويل"   titleEn="Conversion Rate"   value="34%"   subAr="↑ 12% هذا الأسبوع"     subEn="↑ 12% this week" />
            <HighlightCard icon="⚡" titleAr="ردود تلقائية"   titleEn="Auto Replies"      value="1,840" subAr="هذا الشهر"              subEn="This month" />
            <HighlightCard icon="💰" titleAr="إيرادات مولّدة" titleEn="Revenue Generated" value="$8.2K" subAr="×3 مقارنة قبل IryChat"  subEn="×3 vs before IryChat" />
          </div>
        </div>
      </motion.section>

      {/* ── Pricing ── */}
      <section id="pricing" className="section pricing-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag"><span className="ar">الأسعار</span><span className="en">Pricing</span></div>
          <h2 className="section-title"><span className="ar">شفاف من غير مفاجآت</span><span className="en">Transparent, No Surprises</span></h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="pricing-grid">
          {/* Free */}
          <motion.div variants={fadeUp} className="pricing-card gl">
            <div className="plan-name"><span className="ar">مجاني</span><span className="en">Free</span></div>
            <div className="plan-price">$0 <span>/<span className="ar">شهر</span><span className="en">mo</span></span></div>
            <div className="plan-desc"><span className="ar">للتجربة وابدأ من النهارده</span><span className="en">Perfect to get started</span></div>
            <ul className="plan-features">
              <li><span className="ar">500 محادثة / شهر</span><span className="en">500 conversations / month</span></li>
              <li><span className="ar">حساب انستجرام واحد</span><span className="en">1 Instagram account</span></li>
              <li><span className="ar">3 Flows</span><span className="en">3 Flows</span></li>
              <li><span className="ar">رد تلقائي على DMs</span><span className="en">Auto DM replies</span></li>
              <li><span className="ar">دعم بالإيميل</span><span className="en">Email support</span></li>
            </ul>
            <Link href="/login" className="plan-btn"><span className="ar">ابدأ مجاناً</span><span className="en">Start Free</span></Link>
          </motion.div>

          {/* Pro */}
          <motion.div variants={fadeUp} className="pricing-card gl popular">
            <div className="popular-badge"><span className="ar">الأكثر اختياراً</span><span className="en">Most Popular</span></div>
            <div className="plan-name"><span className="ar">برو</span><span className="en">Pro</span></div>
            <div className="plan-price">$29 <span>/<span className="ar">شهر</span><span className="en">mo</span></span></div>
            <div className="plan-desc"><span className="ar">للبيزنس اللي عايز ينمو فعلاً</span><span className="en">For businesses serious about growth</span></div>
            <ul className="plan-features">
              <li><span className="ar">محادثات غير محدودة</span><span className="en">Unlimited conversations</span></li>
              <li><span className="ar">3 حسابات انستجرام</span><span className="en">3 Instagram accounts</span></li>
              <li><span className="ar">Flows غير محدودة</span><span className="en">Unlimited Flows</span></li>
              <li><span className="ar">أتمتة الكومنتات والـ Stories</span><span className="en">Comment & Story automation</span></li>
              <li><span className="ar">تقسيم الجمهور</span><span className="en">Audience segmentation</span></li>
              <li><span className="ar">Analytics متعمقة</span><span className="en">Deep Analytics</span></li>
              <li><span className="ar">دعم أولوية</span><span className="en">Priority support</span></li>
            </ul>
            <Link href="/login" className="plan-btn"><span className="ar">تجربة 14 يوم مجاناً</span><span className="en">14-Day Free Trial</span></Link>
          </motion.div>

          {/* Agency */}
          <motion.div variants={fadeUp} className="pricing-card gl">
            <div className="plan-name"><span className="ar">إيجنسي</span><span className="en">Agency</span></div>
            <div className="plan-price">$99 <span>/<span className="ar">شهر</span><span className="en">mo</span></span></div>
            <div className="plan-desc"><span className="ar">للوكالات وأصحاب المشاريع الكبيرة</span><span className="en">For agencies & large-scale projects</span></div>
            <ul className="plan-features">
              <li><span className="ar">لحد 20 حساب عميل</span><span className="en">Up to 20 client accounts</span></li>
              <li><span className="ar">حسابات انستجرام غير محدودة</span><span className="en">Unlimited Instagram accounts</span></li>
              <li><span className="ar">White Label كامل</span><span className="en">Full White Label</span></li>
              <li><span className="ar">Dashboard موحّد</span><span className="en">Unified dashboard</span></li>
              <li><span className="ar">API + Webhooks</span><span className="en">API + Webhooks</span></li>
              <li><span className="ar">Account Manager مخصص</span><span className="en">Dedicated Account Manager</span></li>
            </ul>
            <Link href="/login" className="plan-btn"><span className="ar">تكلم معنا</span><span className="en">Talk to Us</span></Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag"><span className="ar">شهادات العملاء</span><span className="en">Customer Stories</span></div>
          <h2 className="section-title"><span className="ar">بيقولوا إيه عن IryChat</span><span className="en">What People Say</span></h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="testimonials-grid">
          {currentTestimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="testimonial-card gl">
              <StarRating count={t.stars} />
              <div className="testimonial-text">{t.text}</div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag"><span className="ar">أسئلة شائعة</span><span className="en">FAQ</span></div>
          <h2 className="section-title"><span className="ar">عندك سؤال؟</span><span className="en">Have Questions?</span></h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="faq-grid">
          {currentFaq.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className={`faq-item gl ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span className="faq-icon">{openFaq === i ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">{item.a}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
        className="cta-section"
      >
        <div className="cta-box gl2">
          <h2>
            <span className="ar">جاهز تحوّل انستجرامك<br />لـ <span className="cy">ماكينة مبيعات</span>؟ 🚀</span>
            <span className="en">Ready to Turn Instagram Into<br />A <span className="cy">Sales Machine</span>? 🚀</span>
          </h2>
          <p>
            <span className="ar">انضم لأكتر من 15,000 بيزنس بيستخدم IryChat. ابدأ مجاناً في أقل من 5 دقايق.</span>
            <span className="en">Join 15,000+ businesses already using IryChat. Get started free in under 5 minutes.</span>
          </p>
          <form onSubmit={handleSignup} className="cta-form">
            <input
              type="email"
              name="email"
              placeholder={lang === 'ar' ? 'إيميلك هنا...' : 'Your email here...'}
              className="cta-input"
              required
            />
            <button type="submit" className="cta-btn">
              <span className="ar">ابدأ مجاناً 🚀</span>
              <span className="en">Start Free 🚀</span>
            </button>
          </form>
          <div className="trust-badges">
            <span>✅ <span className="ar">لا كريدت كارد</span><span className="en">No Credit Card</span></span>
            <span>✅ <span className="ar">إعداد في 5 دقايق</span><span className="en">5-Min Setup</span></span>
            <span>✅ <span className="ar">ألغِ في أي وقت</span><span className="en">Cancel Anytime</span></span>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="footer">
        <Link href="/" className="logo">IryChat</Link>
        <div className="footer-links">
          <Link href="/privacy"><span className="ar">سياسة الخصوصية</span><span className="en">Privacy Policy</span></Link>
          <Link href="/terms"><span className="ar">الشروط والأحكام</span><span className="en">Terms</span></Link>
          <Link href="/contact"><span className="ar">الدعم الفني</span><span className="en">Support</span></Link>
          <Link href="/blog"><span className="ar">المدونة</span><span className="en">Blog</span></Link>
        </div>
        <div className="copyright">© 2025 IryChat</div>
      </footer>

    </main>
  )
}