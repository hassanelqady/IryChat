'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
// LanguageSwitcher تمت إزالته لأنه موجود الآن داخل الـ Navbar الجديد

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

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
    { name: 'نور محمد',  role: 'صاحبة متجر موضة',     stars: 5, text: '"زاد مبيعاتي 3 أضعاف في شهرين! كل ما حد يكتب \'اسعار\' في الكومنتات يوصله رسالة ويشتري."' },
    { name: 'علي خالد',  role: 'مدير تسويق — إيجنسي', stars: 5, text: '"كنت بصرف على موظف بيرد على DMs. دلوقتي وفّرت ده كله. الـ ROI واضح من أول أسبوع."' },
    { name: 'سلمى علي',  role: 'كوتش تنمية بشرية',    stars: 5, text: '"في ساعة واحدة عملت flow كامل. البوت بيرد أسرع مني وأذكى. العملاء مش مصدقين إنه بوت!"' },
  ],
  en: [
    { name: 'Nour Mohamed', role: 'Fashion Store Owner',         stars: 5, text: '"My sales tripled in 2 months! Every time someone comments \'price\', they get an auto message and buy."' },
    { name: 'Ali Khaled',   role: 'Marketing Director — Agency', stars: 5, text: '"I used to pay someone to reply to DMs. Now that budget is saved and ROI was clear from the first week."' },
    { name: 'Salma Ali',    role: 'Life & Business Coach',       stars: 5, text: "\"In one hour I had a complete flow running. The bot replies faster and smarter. Clients can't believe it's automated!\"" },
  ],
}

function StarRating({ count }) {
  return <div className="stars">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</div>
}

function StatItem({ number, labelAr, labelEn, lang }) {
  return (
    <div className="stat">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{lang === 'ar' ? labelAr : labelEn}</div>
    </div>
  )
}

function HighlightCard({ icon, titleAr, titleEn, value, subAr, subEn, lang }) {
  return (
    <motion.div variants={fadeUp} className="hcard gl">
      <div className="hci">{icon}</div>
      <div className="hct">{lang === 'ar' ? titleAr : titleEn}</div>
      <div className="hcv">{value}</div>
      <div className="hcs">{lang === 'ar' ? subAr : subEn}</div>
    </motion.div>
  )
}

export default function Home() {
  const { lang } = useLanguage()
  const [openFaq, setOpenFaq] = useState(null)
  // تم حذف mobileMenuOpen لأن القائمة أصبحت في الـ Layout
  const chatBoxRef = useRef(null)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (email?.includes('@')) {
      alert(lang === 'ar' ? 'شكراً! سيصلك رابط التفعيل على بريدك الإلكتروني' : 'Thanks! You will receive an activation link via email')
      e.target.reset()
    } else {
      alert(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email')
    }
  }

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

    if (chatBoxRef.current) chatBoxRef.current.innerHTML = ''
    next()
    return () => timeouts.forEach(clearTimeout)
  }, [lang])

  const currentFaq = FAQ_DATA[lang] ?? FAQ_DATA.ar
  const currentTestimonials = TESTIMONIALS[lang] ?? TESTIMONIALS.ar

  return (
    <main>
      <div className="bg-mesh">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>
      <div className="bg-grid" />

      {/* تم حذف الـ Mobile Menu القديم لأن الـ Navbar الجديد يدير القائمة بالكامل */}

      {/* Hero */}
      <div className="hero">
        <div className="pill gl">
          <span className="pdot" />
          {lang === 'ar' ? 'أذكى حلول الأتمتة' : 'The Smartest Automation Solution'}
        </div>
        <h1>
          {lang === 'ar'
            ? <span>استفد إلى أقصى حد من كل <span className="cy">محادثة</span></span>
            : <span>Make the most out of every <span className="cy">conversation</span></span>}
        </h1>
        <p className="hero-sub">
          {lang === 'ar'
            ? 'قم بزيادة مبيعاتك، وعزز تفاعلك، ووسع جمهورك من خلال أتمتة قوية لمنصات إنستجرام وواتساب وتيك توك وماسنجر.'
            : 'Sell more, engage better, and grow your audience with powerful automations for Instagram, WhatsApp, TikTok, and Messenger.'}
        </p>
        <div className="hero-btns">
          <Link href="/login" className="btn-p">{lang === 'ar' ? 'ابدأ' : 'GET STARTED'}</Link>
          <button className="btn-o" onClick={() => scrollTo('how')}>
            {lang === 'ar' ? 'اكتشف آلية العمل ▶' : 'Discover How It Works ▶'}
          </button>
        </div>

        <div className="mockup-wrap">
          <div className="gl" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div className="mock-bar gl">
              <div className="mavatar">📸</div>
              <div>
                <div className="mname">IryChat — Instagram</div>
                <div className="mstatus">{lang === 'ar' ? '● نشط الآن' : '● Active now'}</div>
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
            <div className="fb fb1 gl">📊 {lang === 'ar' ? '98% معدل الفتح' : '98% Open Rate'}</div>
            <div className="fb fb2 gl">⚡ {lang === 'ar' ? 'رد في ثانية' : '1s Response'}</div>
            <div className="fb fb3 gl">🔥 {lang === 'ar' ? '×3.4 تحويلات' : '×3.4 Conversions'}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="stats-section">
        <div className="stats-grid">
          <StatItem number="+15K" labelAr="مستخدم نشط"     labelEn="Active Users"     lang={lang} />
          <StatItem number="98%"  labelAr="معدل الفتح"      labelEn="Open Rate"        lang={lang} />
          <StatItem number="×3.4" labelAr="زيادة التحويلات" labelEn="More Conversions" lang={lang} />
          <StatItem number="24/7" labelAr="رد تلقائي"       labelEn="Auto Reply"       lang={lang} />
          <StatItem number="<1s"  labelAr="وقت الرد"        labelEn="Response Time"    lang={lang} />
        </div>
      </motion.div>

      {/* How It Works */}
      <section id="how" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag">{lang === 'ar' ? 'اكتشف آلية العمل' : 'Discover How It Works'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'ابدأ في 3 خطوات' : 'Get Started in 3 Steps'}</h2>
          <p className="section-sub">{lang === 'ar' ? 'من ربط الحساب لأول بيع تلقائي — في أقل من 10 دقايق' : 'From account connection to your first automated sale — in under 10 minutes'}</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="steps-grid">
          {[
            { num: '01', ar: ['وصّل انستجرامك', 'ربط حسابك عن طريق Meta API الرسمي — آمن 100% ومتوافق مع سياسات ميتا.'], en: ['Connect Instagram', 'Connect via the official Meta API — 100% secure & fully compliant with Meta policies.'] },
            { num: '02', ar: ['صمّم الـ Flow', 'استخدم الـ Visual Builder لتحديد الردود التلقائية على DMs والكومنتات بكلمات مفتاحية.'], en: ['Build Your Flow', 'Use the Visual Builder to create automated replies for DMs and comments with keywords.'] },
            { num: '03', ar: ['شغّل وشوف النتيجة', 'IryChat يشتغل 24/7 وإنت بتتابع المبيعات والتحويلات على الداشبورد بالريال تايم.'], en: ['Launch & See Results', 'IryChat runs 24/7 while you track sales and conversions on your real-time dashboard.'] },
          ].map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="step-card gl">
              <div className="step-number">{step.num}</div>
              <h3>{lang === 'ar' ? step.ar[0] : step.en[0]}</h3>
              <p>{lang === 'ar' ? step.ar[1] : step.en[1]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="section features-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag">{lang === 'ar' ? 'المميزات' : 'Features'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'كل أدوات الأتمتة في مكان واحد' : 'All Automation Tools In One Place'}</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="features-grid">
          {[
            { icon: '💬', ar: ['رد تلقائي على DMs', 'حدد كلمات مفتاحية وIryChat يرد فوراً ويكمّل المحادثة لحد ما الشخص يشتري.'], en: ['Auto DM Replies', 'Set keywords and IryChat instantly replies, guiding conversations until the sale is done.'] },
            { icon: '📝', ar: ['أتمتة الكومنتات', 'أي حد يكتب "اسعار" في الكومنتات — IryChat يبعتله رسالة خاصة في ثواني.'], en: ['Comment Automation', 'Anyone who comments "price" gets an instant private message automatically within seconds.'] },
            { icon: '📸', ar: ['Story Mentions', 'أي حد يمنشنك في ستوريه يوصله رد تلقائي يشكره ويعرض عليه حاجة ذات قيمة.'], en: ['Story Mentions', 'Anyone who mentions you in their story gets an automatic personalized reply with a value offer.'] },
            { icon: '🏷️', ar: ['تقسيم الجمهور', 'صنّف متابعينك بتاجز تلقائية بناءً على تفاعلهم وابعت لكل شريحة رسالتها الصح.'], en: ['Audience Segmentation', 'Auto-tag subscribers by behavior and send each segment the perfectly tailored message.'] },
            { icon: '📊', ar: ['Analytics متعمقة', 'تابع معدلات الفتح والكليك والتحويل بالريال تايم. اعرف إيه الـ flow الأكثر تحويلاً.'], en: ['Deep Analytics', 'Track open rates, clicks & conversions in real-time. Know exactly which flow converts best.'] },
            { icon: '🔗', ar: ['API + Webhooks', 'وصّل IryChat بأي نظام خارجي — CRM أو متجرك — عن طريق REST API كامل.'], en: ['API + Webhooks', 'Connect IryChat to any external system — CRM, your store — via a full REST API.'] },
          ].map((f) => (
            <motion.div key={f.en[0]} variants={fadeUp} className="feature-card gl">
              <div className="feature-icon">{f.icon}</div>
              <h3>{lang === 'ar' ? f.ar[0] : f.en[0]}</h3>
              <p>{lang === 'ar' ? f.ar[1] : f.en[1]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Highlight */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="highlight-section">
        <div className="highlight-wrap">
          <div className="highlight-text">
            <motion.div variants={fadeUp}>
              <div className="stag">{lang === 'ar' ? 'قوة انستجرام' : 'Instagram Power'}</div>
              <h2 className="section-title">
                {lang === 'ar' ? <span>كل تفاعل<br /><span className="cy">فرصة بيع</span></span> : <span>Every Interaction<br />A <span className="cy">Sales Chance</span></span>}
              </h2>
              <p>{lang === 'ar' ? 'انستجرام مش بس منصة عرض — هو أقوى قناة مبيعات. IryChat يحوّل كل DM وكومنت ومنشن لمحادثة بيع حقيقية تلقائياً.' : "Instagram isn't just a showcase — it's your most powerful sales channel. IryChat turns every DM, comment & mention into a real sales conversation, automatically."}</p>
              <ul className="check-list">
                {[
                  { ar: 'رد على DMs في أقل من ثانية', en: 'Reply to DMs in under 1 second' },
                  { ar: 'أتمتة الكومنتات بكلمات مفتاحية', en: 'Comment automation with keywords' },
                  { ar: 'تحويل Story Mentions لعملاء', en: 'Convert Story Mentions to customers' },
                  { ar: 'بث جماعي للـ subscribers', en: 'Broadcast messages to all subscribers' },
                  { ar: 'متوافق 100% مع سياسات ميتا', en: '100% compliant with Meta policies' },
                ].map((item) => (
                  <li key={item.en}><span className="check-icon">✓</span>{lang === 'ar' ? item.ar : item.en}</li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="highlight-cards">
            <HighlightCard icon="💬" titleAr="DMs اليوم"      titleEn="Today's DMs"       value="247"   subAr="↑ 89% من أمس"         subEn="↑ 89% vs yesterday" lang={lang} />
            <HighlightCard icon="🎯" titleAr="معدل التحويل"   titleEn="Conversion Rate"   value="34%"   subAr="↑ 12% هذا الأسبوع"    subEn="↑ 12% this week"    lang={lang} />
            <HighlightCard icon="⚡" titleAr="ردود تلقائية"   titleEn="Auto Replies"      value="1,840" subAr="هذا الشهر"             subEn="This month"          lang={lang} />
            <HighlightCard icon="💰" titleAr="إيرادات مولّدة" titleEn="Revenue Generated" value="$8.2K" subAr="×3 مقارنة قبل IryChat" subEn="×3 vs before IryChat" lang={lang} />
          </div>
        </div>
      </motion.section>

      {/* Pricing */}
      <section id="pricing" className="section pricing-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'شفاف من غير مفاجآت' : 'Transparent, No Surprises'}</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="pricing-grid">
          {[
            { name: { ar: 'مجاني', en: 'Free' }, price: '$0', desc: { ar: 'للتجربة وابدأ من النهارده', en: 'Perfect to get started' }, features: { ar: ['500 محادثة / شهر', 'حساب انستجرام واحد', '3 Flows', 'رد تلقائي على DMs', 'دعم بالإيميل'], en: ['500 conversations / month', '1 Instagram account', '3 Flows', 'Auto DM replies', 'Email support'] }, btn: { ar: 'ابدأ مجاناً', en: 'Start Free' }, popular: false },
            { name: { ar: 'برو', en: 'Pro' }, price: '$29', desc: { ar: 'للبيزنس اللي عايز ينمو فعلاً', en: 'For businesses serious about growth' }, features: { ar: ['محادثات غير محدودة', '3 حسابات انستجرام', 'Flows غير محدودة', 'أتمتة الكومنتات والـ Stories', 'تقسيم الجمهور', 'Analytics متعمقة', 'دعم أولوية'], en: ['Unlimited conversations', '3 Instagram accounts', 'Unlimited Flows', 'Comment & Story automation', 'Audience segmentation', 'Deep Analytics', 'Priority support'] }, btn: { ar: 'تجربة 14 يوم مجاناً', en: '14-Day Free Trial' }, popular: true },
            { name: { ar: 'إيجنسي', en: 'Agency' }, price: '$99', desc: { ar: 'للوكالات وأصحاب المشاريع الكبيرة', en: 'For agencies & large-scale projects' }, features: { ar: ['لحد 20 حساب عميل', 'حسابات انستجرام غير محدودة', 'White Label كامل', 'Dashboard موحّد', 'API + Webhooks', 'Account Manager مخصص'], en: ['Up to 20 client accounts', 'Unlimited Instagram accounts', 'Full White Label', 'Unified dashboard', 'API + Webhooks', 'Dedicated Account Manager'] }, btn: { ar: 'تكلم معنا', en: 'Talk to Us' }, popular: false },
          ].map((plan) => (
            <motion.div key={plan.name.en} variants={fadeUp} className={`pricing-card gl ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">{lang === 'ar' ? 'الأكثر اختياراً' : 'Most Popular'}</div>}
              <div className="plan-name">{lang === 'ar' ? plan.name.ar : plan.name.en}</div>
              <div className="plan-price">{plan.price} <span>/{lang === 'ar' ? 'شهر' : 'mo'}</span></div>
              <div className="plan-desc">{lang === 'ar' ? plan.desc.ar : plan.desc.en}</div>
              <ul className="plan-features">
                {(lang === 'ar' ? plan.features.ar : plan.features.en).map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <Link href="/login" className="plan-btn">{lang === 'ar' ? plan.btn.ar : plan.btn.en}</Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag">{lang === 'ar' ? 'شهادات العملاء' : 'Customer Stories'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'بيقولوا إيه عن IryChat' : 'What People Say'}</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="testimonials-grid">
          {currentTestimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="testimonial-card gl">
              <StarRating count={t.stars} />
              <div className="testimonial-text">{t.text}</div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div><div className="author-name">{t.name}</div><div className="author-role">{t.role}</div></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
          <div className="stag">{lang === 'ar' ? 'أسئلة شائعة' : 'FAQ'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'عندك سؤال؟' : 'Have Questions?'}</h2>
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

      {/* CTA */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="cta-section">
        <div className="cta-box gl2">
          <h2>
            {lang === 'ar'
              ? <span>جاهز تحوّل انستجرامك<br />لـ <span className="cy">ماكينة مبيعات</span>؟ 🚀</span>
              : <span>Ready to Turn Instagram Into<br />A <span className="cy">Sales Machine</span>? 🚀</span>}
          </h2>
          <p>{lang === 'ar' ? 'انضم لأكتر من 15,000 بيزنس بيستخدم IryChat. ابدأ مجاناً في أقل من 5 دقايق.' : 'Join 15,000+ businesses already using IryChat. Get started free in under 5 minutes.'}</p>
          <form onSubmit={handleSignup} className="cta-form">
            <input type="email" name="email" placeholder={lang === 'ar' ? 'إيميلك هنا...' : 'Your email here...'} className="cta-input" required />
            <button type="submit" className="cta-btn">{lang === 'ar' ? 'ابدأ مجاناً 🚀' : 'Start Free 🚀'}</button>
          </form>
          <div className="trust-badges">
            <span>✅ {lang === 'ar' ? 'لا كريدت كارد' : 'No Credit Card'}</span>
            <span>✅ {lang === 'ar' ? 'إعداد في 5 دقايق' : '5-Min Setup'}</span>
            <span>✅ {lang === 'ar' ? 'ألغِ في أي وقت' : 'Cancel Anytime'}</span>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <Link href="/" className="logo">IryChat</Link>
        <div className="footer-links">
          <Link href="/privacy">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
          <Link href="/terms">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}</Link>
          <Link href="/contact">{lang === 'ar' ? 'الدعم الفني' : 'Support'}</Link>
          <Link href="/blog">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
        </div>
        <div className="copyright">© 2025 IryChat</div>
      </footer>
    </main>
  )
}