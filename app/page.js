'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [lang, setLang] = useState('ar')
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const chatBoxRef = useRef(null)

  // Chat Messages
  const chatMessages = {
    ar: [
      { type: 'in', text: 'كم سعر المنتج؟ 😍' },
      { type: 'out', text: '👋 أهلاً! عندنا عروض حلوة النهارده. تحب أبعتلك الكاتالوج؟' },
      { type: 'in', text: 'أيوه طبعاً!' },
      { type: 'out', text: '✅ تم! وعندنا خصم 20% هذا الأسبوع فقط 🎁' },
      { type: 'in', text: 'تمام، عايز أطلب' },
      { type: 'out', text: '🔥 ممتاز! اضغط هنا لإتمام الطلب 👇 IryChat.io/order' },
    ],
    en: [
      { type: 'in', text: "What's the price? 😍" },
      { type: 'out', text: "👋 Hey! We have great offers today. Want me to send the catalog?" },
      { type: 'in', text: "Yes please!" },
      { type: 'out', text: "✅ Sent! We also have 20% off this week only 🎁" },
      { type: 'in', text: "Awesome, I want to order" },
      { type: 'out', text: "🔥 Great! Click here to complete your order 👇 IryChat.io/order" },
    ]
  }

  // FAQ Data
  const faqData = {
    ar: [
      { q: 'هل IryChat معتمد من ميتا وانستجرام؟', a: 'أيوه 100%. بنستخدم Meta Graph API الرسمي ومتوافقون تماماً مع سياسات ميتا. حسابك في أمان.' },
      { q: 'هل محتاج خبرة تقنية؟', a: 'لأ خالص. الواجهة visual drag & drop بالكامل. لو تعرف تبعت DM على انستجرام تقدر تشغّل IryChat في أقل من 10 دقايق.' },
      { q: 'أقدر أجرب قبل ما أدفع؟', a: 'طبعاً! الخطة المجانية دايماً موجودة. والبرو فيها 14 يوم تجربة مجانية بدون كريدت كارد.' },
      { q: 'هل هيحس المتابع إنه بيكلم بوت؟', a: 'ده بيرجع لإنت. تقدر تعمل ردود طبيعية جداً وبشرية. كتير من عملائنا بيقولوا إن متابعيهم مش بيلاحظوا الفرق.' },
      { q: 'أقدر ألغي الاشتراك وقت ما أنا عايز؟', a: 'أيوه، في أي وقت بضغطة واحدة من الداشبورد. مفيش عقود ومفيش رسوم إلغاء.' },
    ],
    en: [
      { q: 'Is IryChat approved by Meta & Instagram?', a: 'Yes, 100%. We use the official Meta Graph API and are fully compliant with Meta & Instagram policies.' },
      { q: 'Do I need technical skills?', a: 'Not at all. The interface is fully visual drag & drop. If you can send a DM on Instagram, you can run IryChat in under 10 minutes.' },
      { q: 'Can I try before paying?', a: 'Absolutely! The free plan is always available. Pro also comes with a 14-day free trial — no credit card required.' },
      { q: 'Will followers know they\'re talking to a bot?', a: 'That\'s entirely up to you. You can craft very natural, human-sounding replies. Many users say their followers don\'t notice the difference.' },
      { q: 'Can I cancel anytime?', a: 'Yes, anytime with one click from your dashboard. No contracts, no cancellation fees whatsoever.' },
    ]
  }

  // Testimonials Data
  const testimonials = {
    ar: [
      { name: 'نور محمد', role: 'صاحبة متجر موضة', text: '"زاد مبيعاتي 3 أضعاف في شهرين! كل ما حد يكتب \'اسعار\' في الكومنتات يوصله رسالة ويشتري. المشروع اتغير خالص."', stars: 5 },
      { name: 'علي خالد', role: 'مدير تسويق — إيجنسي', text: '"كنت بصرف على موظف بيرد على DMs. دلوقتي وفّرت ده كله. الـ ROI واضح من أول أسبوع."', stars: 5 },
      { name: 'سلمى علي', role: 'كوتش تنمية بشرية', text: '"في ساعة واحدة عملت flow كامل. البوت بيرد أسرع مني وأذكى. العملاء مش مصدقين إنه بوت!"', stars: 5 },
    ],
    en: [
      { name: 'Nour Mohamed', role: 'Fashion Store Owner', text: '"My sales tripled in 2 months! Every time someone comments \'price\', they get an auto message and buy. This completely changed my business."', stars: 5 },
      { name: 'Ali Khaled', role: 'Marketing Director — Agency', text: '"I used to pay someone to reply to DMs. Now that budget is saved and ROI was clear from the first week."', stars: 5 },
      { name: 'Salma Ali', role: 'Life & Business Coach', text: '"In one hour I had a complete flow running. The bot replies faster and smarter. Clients can\'t believe it\'s automated!"', stars: 5 },
    ]
  }

  // Run Chat Animation
  useEffect(() => {
    let chatIndex = 0
    let timeouts = []

    const addMessage = (message) => {
      if (!chatBoxRef.current) return
      
      const msgDiv = document.createElement('div')
      msgDiv.className = message.type === 'out' ? 'msg mout' : 'msg min gl'
      msgDiv.innerHTML = `${message.text}<div class="msg-time">now</div>`
      chatBoxRef.current.appendChild(msgDiv)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }

    const runChat = () => {
      const messages = chatMessages[lang] || chatMessages.ar
      
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
          const typingDiv = document.createElement('div')
          typingDiv.className = 'typ gl'
          typingDiv.innerHTML = '<div class="td"></div><div class="td"></div><div class="td"></div>'
          chatBoxRef.current?.appendChild(typingDiv)
          chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
          
          timeouts.push(setTimeout(() => {
            typingDiv.remove()
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
    }

    runChat()

    return () => {
      timeouts.forEach(id => clearTimeout(id))
    }
  }, [lang])

  // Language & Direction
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'ar'
    setLang(savedLang)
    document.documentElement.setAttribute('data-lang', savedLang)
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.setAttribute('data-lang', newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const scrollTo = (id) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (email && email.includes('@')) {
      alert(lang === 'ar' ? 'شكراً! سيصلك رابط التفعيل على بريدك الإلكتروني' : 'Thanks! You will receive an activation link via email')
      e.target.reset()
    } else {
      alert(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email')
    }
  }

  const currentFaq = faqData[lang] || faqData.ar
  const currentTestimonials = testimonials[lang] || testimonials.ar

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <main>
      {/* Background Effects */}
      <div className="bg-mesh">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>
      <div className="bg-grid"></div>

      {/* ========== NAVBAR ========== */}
      <nav className="navbar">
        <Link href="/" className="logo">IryChat</Link>
        
        {/* Desktop Navigation */}
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
          
          {/* Hamburger Menu Button */}
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button onClick={() => scrollTo('how')}><span className="ar">كيف يعمل</span><span className="en">How It Works</span></button>
        <button onClick={() => scrollTo('features')}><span className="ar">المميزات</span><span className="en">Features</span></button>
        <button onClick={() => scrollTo('pricing')}><span className="ar">الأسعار</span><span className="en">Pricing</span></button>
        <button onClick={() => scrollTo('faq')}>FAQ</button>
      </div>

      {/* ========== HERO SECTION ========== */}
      <div className="hero">
        <div className="pill gl">
          <span className="pdot"></span>
          <span className="ar">أتمتة انستجرام الأذكى</span>
          <span className="en">The Smartest Instagram Automation</span>
        </div>
        <h1>
          <span className="ar">حوّل كل <span className="cy">DM</span><br />لبيع حقيقي</span>
          <span className="en">Turn Every <span className="cy">DM</span><br />Into a Real Sale</span>
        </h1>
        <p className="hero-sub">
          <span className="ar">IryChat يرد على رسايل ومنشنات انستجرام تلقائياً ويحوّل متابعينك لعملاء حقيقيين وإنت نايم.</span>
          <span className="en">IryChat auto-replies to Instagram DMs & mentions — converting your followers into customers while you sleep.</span>
        </p>
        <div className="hero-btns">
          <Link href="/login" className="btn-p">
            <span className="ar">تسجيل دخول 🚀</span>
            <span className="en">Login 🚀</span>
          </Link>
          <button className="btn-o" onClick={() => scrollTo('how')}>
            <span className="ar">شوف كيف يشتغل ▶</span>
            <span className="en">See How It Works ▶</span>
          </button>
        </div>

        {/* Chat Mockup */}
        <div className="mockup-wrap">
          <div className="gl" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div className="mock-bar gl">
              <div className="mavatar">📸</div>
              <div>
                <div className="mname">IryChat — Instagram</div>
                <div className="mstatus"><span className="ar">● نشط الآن</span><span className="en">● Active now</span></div>
              </div>
              <div className="dots">
                <div className="dot-w" style={{ background: '#ff5f57' }}></div>
                <div className="dot-w" style={{ background: '#ffbd2e' }}></div>
                <div className="dot-w" style={{ background: '#28c840' }}></div>
              </div>
            </div>
            <div className="chat-body" ref={chatBoxRef}></div>
          </div>
          
          {/* Floating Badges */}
          <div className="fbadges">
            <div className="fb fb1 gl">📊 <span className="ar">98% معدل الفتح</span><span className="en">98% Open Rate</span></div>
            <div className="fb fb2 gl">⚡ <span className="ar">رد في ثانية</span><span className="en">1s Response</span></div>
            <div className="fb fb3 gl">🔥 <span className="ar">×3.4 تحويلات</span><span className="en">×3.4 Conversions</span></div>
          </div>
        </div>
      </div>

      {/* ========== STATS SECTION ========== */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="stats-section"
      >
        <div className="stats-grid">
          <motion.div variants={fadeUp} className="stat"><div className="stat-number">+15K</div><div className="stat-label"><span className="ar">مستخدم نشط</span><span className="en">Active Users</span></div></motion.div>
          <motion.div variants={fadeUp} className="stat"><div className="stat-number">98%</div><div className="stat-label"><span className="ar">معدل الفتح</span><span className="en">Open Rate</span></div></motion.div>
          <motion.div variants={fadeUp} className="stat"><div className="stat-number">×3.4</div><div className="stat-label"><span className="ar">زيادة التحويلات</span><span className="en">More Conversions</span></div></motion.div>
          <motion.div variants={fadeUp} className="stat"><div className="stat-number">24/7</div><div className="stat-label"><span className="ar">رد تلقائي</span><span className="en">Auto Reply</span></div></motion.div>
          <motion.div variants={fadeUp} className="stat"><div className="stat-number">&lt;1s</div><div className="stat-label"><span className="ar">وقت الرد</span><span className="en">Response Time</span></div></motion.div>
        </div>
      </motion.div>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how" className="section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="stag"><span className="ar">كيف يعمل</span><span className="en">How It Works</span></div>
          <h2 className="section-title"><span className="ar">3 خطوات وبدأت</span><span className="en">3 Steps & You're Live</span></h2>
          <p className="section-sub"><span className="ar">من ربط الحساب لأول بيع تلقائي — في أقل من 10 دقايق</span><span className="en">From account connection to your first automated sale — in under 10 minutes</span></p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="steps-grid"
        >
          <motion.div variants={fadeUp} className="step-card gl">
            <div className="step-number">01</div>
            <h3><span className="ar">وصّل انستجرامك</span><span className="en">Connect Instagram</span></h3>
            <p><span className="ar">ربط حسابك عن طريق Meta API الرسمي — آمن 100% ومتوافق مع سياسات ميتا.</span><span className="en">Connect via the official Meta API — 100% secure & fully compliant with Meta policies.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="step-card gl">
            <div className="step-number">02</div>
            <h3><span className="ar">صمّم الـ Flow</span><span className="en">Build Your Flow</span></h3>
            <p><span className="ar">استخدم الـ Visual Builder لتحديد الردود التلقائية على DMs والكومنتات بكلمات مفتاحية.</span><span className="en">Use the Visual Builder to create automated replies for DMs and comments with keywords.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="step-card gl">
            <div className="step-number">03</div>
            <h3><span className="ar">شغّل وشوف النتيجة</span><span className="en">Launch & See Results</span></h3>
            <p><span className="ar">IryChat يشتغل 24/7 وإنت بتتابع المبيعات والتحويلات على الداشبورد بالريال تايم.</span><span className="en">IryChat runs 24/7 while you track sales and conversions on your real-time dashboard.</span></p>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="section features-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="stag"><span className="ar">المميزات</span><span className="en">Features</span></div>
          <h2 className="section-title"><span className="ar">كل أدوات الأتمتة<br />في مكان واحد</span><span className="en">All Automation Tools<br />In One Place</span></h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="features-grid"
        >
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">💬</div>
            <h3><span className="ar">رد تلقائي على DMs</span><span className="en">Auto DM Replies</span></h3>
            <p><span className="ar">حدد كلمات مفتاحية وIryChat يرد فوراً ويكمّل المحادثة لحد ما الشخص يشتري.</span><span className="en">Set keywords and IryChat instantly replies, guiding conversations until the sale is done.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">📝</div>
            <h3><span className="ar">أتمتة الكومنتات</span><span className="en">Comment Automation</span></h3>
            <p><span className="ar">أي حد يكتب "اسعار" في الكومنتات — IryChat يبعتله رسالة خاصة في ثواني.</span><span className="en">Anyone who comments "price" gets an instant private message automatically within seconds.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">📸</div>
            <h3><span className="ar">Story Mentions</span><span className="en">Story Mentions</span></h3>
            <p><span className="ar">أي حد يمنشنك في ستوريه يوصله رد تلقائي يشكره ويعرض عليه حاجة ذات قيمة.</span><span className="en">Anyone who mentions you in their story gets an automatic personalized reply with a value offer.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">🏷️</div>
            <h3><span className="ar">تقسيم الجمهور</span><span className="en">Audience Segmentation</span></h3>
            <p><span className="ar">صنّف متابعينك بتاجز تلقائية بناءً على تفاعلهم وابعت لكل شريحة رسالتها الصح.</span><span className="en">Auto-tag subscribers by behavior and send each segment the perfectly tailored message.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">📊</div>
            <h3><span className="ar">Analytics متعمقة</span><span className="en">Deep Analytics</span></h3>
            <p><span className="ar">تابع معدلات الفتح والكليك والتحويل بالريال تايم. اعرف إيه الـ flow الأكثر تحويلاً.</span><span className="en">Track open rates, clicks & conversions in real-time. Know exactly which flow converts best.</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card gl">
            <div className="feature-icon">🔗</div>
            <h3><span className="ar">API + Webhooks</span><span className="en">API + Webhooks</span></h3>
            <p><span className="ar">وصّل IryChat بأي نظام خارجي — CRM أو متجرك — عن طريق REST API كامل.</span><span className="en">Connect IryChat to any external system — CRM, your store — via a full REST API.</span></p>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== HIGHLIGHT SECTION ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="highlight-section"
      >
        <div className="highlight-wrap">
          <div className="highlight-text">
            <motion.div variants={fadeUp}>
              <div className="stag"><span className="ar">قوة انستجرام</span><span className="en">Instagram Power</span></div>
              <h2 className="section-title"><span className="ar">كل تفاعل<br /><span className="cy">فرصة بيع</span></span><span className="en">Every Interaction<br />A <span className="cy">Sales Chance</span></span></h2>
              <p><span className="ar">انستجرام مش بس منصة عرض — هو أقوى قناة مبيعات. IryChat يحوّل كل DM وكومنت ومنشن لمحادثة بيع حقيقية تلقائياً.</span><span className="en">Instagram isn't just a showcase — it's your most powerful sales channel. IryChat turns every DM, comment & mention into a real sales conversation, automatically.</span></p>
              <ul className="check-list">
                <li><span className="check-icon">✓</span><span className="ar">رد على DMs في أقل من ثانية</span><span className="en">Reply to DMs in under 1 second</span></li>
                <li><span className="check-icon">✓</span><span className="ar">أتمتة الكومنتات بكلمات مفتاحية</span><span className="en">Comment automation with keywords</span></li>
                <li><span className="check-icon">✓</span><span className="ar">تحويل Story Mentions لعملاء</span><span className="en">Convert Story Mentions to customers</span></li>
                <li><span className="check-icon">✓</span><span className="ar">بث جماعي للـ subscribers</span><span className="en">Broadcast messages to all subscribers</span></li>
                <li><span className="check-icon">✓</span><span className="ar">متوافق 100% مع سياسات ميتا</span><span className="en">100% compliant with Meta policies</span></li>
              </ul>
            </motion.div>
          </div>
          <div className="highlight-cards">
            <motion.div variants={fadeUp} className="hcard gl">
              <div className="hci">💬</div>
              <div className="hct"><span className="ar">DMs اليوم</span><span className="en">Today's DMs</span></div>
              <div className="hcv">247</div>
              <div className="hcs"><span className="ar">↑ 89% من أمس</span><span className="en">↑ 89% vs yesterday</span></div>
            </motion.div>
            <motion.div variants={fadeUp} className="hcard gl">
              <div className="hci">🎯</div>
              <div className="hct"><span className="ar">معدل التحويل</span><span className="en">Conversion Rate</span></div>
              <div className="hcv">34%</div>
              <div className="hcs"><span className="ar">↑ 12% هذا الأسبوع</span><span className="en">↑ 12% this week</span></div>
            </motion.div>
            <motion.div variants={fadeUp} className="hcard gl">
              <div className="hci">⚡</div>
              <div className="hct"><span className="ar">ردود تلقائية</span><span className="en">Auto Replies</span></div>
              <div className="hcv">1,840</div>
              <div className="hcs"><span className="ar">هذا الشهر</span><span className="en">This month</span></div>
            </motion.div>
            <motion.div variants={fadeUp} className="hcard gl">
              <div className="hci">💰</div>
              <div className="hct"><span className="ar">إيرادات مولّدة</span><span className="en">Revenue Generated</span></div>
              <div className="hcv">$8.2K</div>
              <div className="hcs"><span className="ar">×3 مقارنة قبل IryChat</span><span className="en">×3 vs before IryChat</span></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="section pricing-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="stag"><span className="ar">الأسعار</span><span className="en">Pricing</span></div>
          <h2 className="section-title"><span className="ar">شفاف من غير مفاجآت</span><span className="en">Transparent, No Surprises</span></h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="pricing-grid"
        >
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

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="section testimonials-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="stag"><span className="ar">شهادات العملاء</span><span className="en">Customer Stories</span></div>
          <h2 className="section-title"><span className="ar">بيقولوا إيه عن IryChat</span><span className="en">What People Say</span></h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="testimonials-grid"
        >
          {currentTestimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="testimonial-card gl">
              <div className="stars">{'★'.repeat(t.stars)}{'☆'.repeat(5-t.stars)}</div>
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

      {/* ========== FAQ ========== */}
      <section id="faq" className="section faq-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="faq-header">
            <div className="stag"><span className="ar">أسئلة شائعة</span><span className="en">FAQ</span></div>
            <h2 className="section-title"><span className="ar">عندك سؤال؟</span><span className="en">Have Questions?</span></h2>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="faq-grid"
        >
          {currentFaq.map((item, index) => (
            <motion.div key={index} variants={fadeUp} className={`faq-item gl ${openFaq === index ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{item.q}</span>
                <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">{item.a}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
        className="cta-section"
      >
        <div className="cta-box gl2">
          <h2><span className="ar">جاهز تحوّل انستجرامك<br />لـ <span className="cy">ماكينة مبيعات</span>؟ 🚀</span><span className="en">Ready to Turn Instagram Into<br />A <span className="cy">Sales Machine</span>? 🚀</span></h2>
          <p><span className="ar">انضم لأكتر من 15,000 بيزنس بيستخدم IryChat. ابدأ مجاناً في أقل من 5 دقايق.</span><span className="en">Join 15,000+ businesses already using IryChat. Get started free in under 5 minutes.</span></p>
          <form onSubmit={handleSignup} className="cta-form">
            <input type="email" name="email" placeholder={lang === 'ar' ? 'إيميلك هنا...' : 'Your email here...'} className="cta-input" required />
            <button type="submit" className="cta-btn"><span className="ar">ابدأ مجاناً 🚀</span><span className="en">Start Free 🚀</span></button>
          </form>
          <div className="trust-badges">
            <span>✅ <span className="ar">لا كريدت كارد</span><span className="en">No Credit Card</span></span>
            <span>✅ <span className="ar">إعداد في 5 دقايق</span><span className="en">5-Min Setup</span></span>
            <span>✅ <span className="ar">ألغِ في أي وقت</span><span className="en">Cancel Anytime</span></span>
          </div>
        </div>
      </motion.section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="logo">IryChat</div>
        <div className="footer-links">
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/terms">الشروط والأحكام</Link>
          <Link href="/contact">الدعم الفني</Link>
          <Link href="/blog">المدونة</Link>
        </div>
        <div className="copyright">© 2025 IryChat</div>
      </footer>

      <style jsx global>{`
        :root {
          --c1: #05080f;
          --c2: #00d4ff;
          --c2-dim: rgba(0,212,255,.12);
          --c2-glow: rgba(0,212,255,.22);
          --c2-border: rgba(0,212,255,.18);
          --glass: rgba(255,255,255,.035);
          --glass-h: rgba(255,255,255,.065);
          --gb: rgba(255,255,255,.07);
          --gs: rgba(255,255,255,.12);
          --text: #eef2ff;
          --muted: rgba(238,242,255,.42);
          --muted2: rgba(238,242,255,.62);
          --r: 20px;
          --rs: 12px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Tajawal', 'Outfit', sans-serif;
          background: var(--c1);
          color: var(--text);
          overflow-x: hidden;
        }

        [data-lang="en"] .ar {
          display: none !important;
        }

        [data-lang="ar"] .en {
          display: none !important;
        }

        [data-lang="en"] {
          font-family: 'Outfit', sans-serif;
        }

        [data-lang="ar"] {
          font-family: 'Tajawal', sans-serif;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: var(--c1);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--c2);
          border-radius: 99px;
        }

        /* Background */
        .bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          animation: bd 12s ease-in-out infinite alternate;
        }

        .b1 {
          width: 700px;
          height: 700px;
          background: rgba(0,212,255,.14);
          top: -200px;
          right: -180px;
        }

        .b2 {
          width: 550px;
          height: 550px;
          background: rgba(0,80,255,.11);
          bottom: -150px;
          left: -150px;
          animation-delay: -5s;
        }

        .b3 {
          width: 400px;
          height: 400px;
          background: rgba(0,212,255,.06);
          top: 45%;
          left: 38%;
          animation-delay: -9s;
        }

        @keyframes bd {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(0,212,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* Glass Effects */
        .gl {
          background: var(--glass);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid var(--gb);
          box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05);
        }

        .gl2 {
          background: rgba(255,255,255,.055);
          backdrop-filter: blur(26px) saturate(200%);
          -webkit-backdrop-filter: blur(26px) saturate(200%);
          border: 1px solid var(--gs);
          box-shadow: 0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.09);
        }

        /* Animations */
        @keyframes up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Utilities */
        .cy {
          color: var(--c2);
          text-shadow: 0 0 40px var(--c2-glow);
        }

        .stag {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--c2);
          margin-bottom: .65rem;
        }

        .sh {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        [data-lang="ar"] .sh {
          font-family: 'Tajawal', sans-serif;
          letter-spacing: 0;
        }

        .sec {
          position: relative;
          z-index: 1;
          padding: 7rem 5%;
        }

        .sec-c {
          text-align: center;
        }

        .ssub {
          font-size: .95rem;
          color: var(--muted2);
          line-height: 1.75;
          max-width: 520px;
          margin: 0 auto;
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 900;
          padding: 0.85rem 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(5,8,15,0.75);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid var(--gb);
        }

        .logo {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--c2);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 1.6rem;
          list-style: none;
        }

        .nav-links button {
          color: var(--muted2);
          font-size: 0.88rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.2s;
        }

        .nav-links button:hover {
          color: var(--c2);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .lang-toggle {
          display: flex;
          background: rgba(255,255,255,0.035);
          border: 1px solid var(--gb);
          border-radius: 99px;
          padding: 3px;
        }

        .lang-toggle button {
          padding: 0.28rem 0.75rem;
          border-radius: 99px;
          font-size: 0.76rem;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
        }

        .lang-toggle button.active {
          background: var(--c2);
          color: var(--c1);
          box-shadow: 0 0 14px var(--c2-glow);
        }

        .btn-login {
          background: var(--c2);
          color: var(--c1);
          padding: 0.48rem 1.25rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 0 22px var(--c2-glow);
          transition: all 0.2s;
        }

        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 38px var(--c2-glow);
        }

        /* Hamburger Menu */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hamburger-line {
          width: 100%;
          height: 2px;
          background: var(--text);
          transition: all 0.3s;
        }

        .mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: rgba(5,8,15,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--gb);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transform: translateY(-150%);
          transition: transform 0.3s ease;
          z-index: 899;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-menu button {
          background: var(--glass);
          border: 1px solid var(--gb);
          border-radius: 12px;
          padding: 0.8rem;
          color: var(--text);
          font-size: 1rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .mobile-menu button:hover {
          background: var(--c2-dim);
          border-color: var(--c2-border);
          color: var(--c2);
        }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 9rem 5% 5rem;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.2rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--c2);
          animation: up 0.55s ease both;
        }

        .pdot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--c2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.3;transform:scale(1.6)}
        }

        h1 {
          font-size: clamp(2.8rem,8vw,6.5rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          animation: up 0.6s 0.1s both;
        }

        .hero-sub {
          font-size: clamp(0.95rem,2.2vw,1.18rem);
          color: var(--muted2);
          max-width: 560px;
          margin-bottom: 3rem;
          animation: up 0.6s 0.2s both;
        }

        .hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: up 0.6s 0.3s both;
          margin-bottom: 4.5rem;
        }

        .btn-p {
          background: var(--c2);
          color: var(--c1);
          padding: 0.88rem 2.2rem;
          border-radius: 99px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-p:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 55px var(--c2-glow);
        }

        .btn-o {
          background: var(--glass);
          color: var(--text);
          border: 1px solid var(--gs);
          padding: 0.88rem 2.2rem;
          border-radius: 99px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-o:hover {
          border-color: var(--c2-border);
          background: var(--c2-dim);
        }

        /* Mockup */
        .mockup-wrap {
          width: 100%;
          max-width: 700px;
          position: relative;
          animation: up 0.8s 0.45s both;
        }

        .mock-bar {
          padding: 0.9rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--gb);
        }

        .dots {
          display: flex;
          gap: 5px;
          margin-left: auto;
        }

        [dir="rtl"] .dots {
          margin-left: 0;
          margin-right: auto;
        }

        .dot-w {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .mavatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--c2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .mname {
          font-size: 0.88rem;
          font-weight: 700;
        }

        .mstatus {
          font-size: 0.7rem;
          color: var(--c2);
          font-weight: 600;
        }

        .chat-body {
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          height: 280px;
          overflow-y: auto;
          scroll-behavior: smooth;
          background: rgba(5,8,15,0.5);
          border-radius: 0 0 20px 20px;
        }

        .msg {
          max-width: 72%;
          padding: 0.68rem 1.1rem;
          border-radius: 18px;
          font-size: 0.87rem;
        }

        .msg-time {
          font-size: 0.63rem;
          color: var(--muted);
          margin-top: 0.3rem;
        }

        .min {
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        [dir="rtl"] .min {
          border-bottom-right-radius: 18px;
          border-bottom-left-radius: 4px;
        }

        .mout {
          align-self: flex-end;
          background: var(--c2);
          color: var(--c1);
          font-weight: 600;
          border-bottom-right-radius: 4px;
        }

        .typ {
          align-self: flex-start;
          display: flex;
          gap: 4px;
          padding: 0.68rem 1.1rem;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
        }

        .td {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--c2);
          animation: td 1.2s infinite;
        }

        .td:nth-child(2) { animation-delay: 0.2s; }
        .td:nth-child(3) { animation-delay: 0.4s; }

        @keyframes td {
          0%,80%,100%{transform:scale(1);opacity:0.5}
          40%{transform:scale(1.4);opacity:1}
        }

        .fbadges {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .fb {
          position: absolute;
          padding: 0.5rem 0.95rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          gap: 0.45rem;
          animation: float 4s infinite alternate;
          white-space: nowrap;
        }

        .fb1 { top: 18%; right: -175px; }
        .fb2 { top: 52%; left: -180px; animation-delay: -2s; }
        .fb3 { bottom: 12%; right: -165px; animation-delay: -4s; }

        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }

        /* Stats */
        .stats-section {
          padding: 2.5rem 5%;
          border-top: 1px solid var(--gb);
          border-bottom: 1px solid var(--gb);
          background: rgba(5,8,15,0.6);
          backdrop-filter: blur(20px);
        }

        .stats-grid {
          max-width: 920px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: space-around;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--c2);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--muted);
          margin-top: 0.2rem;
        }

        /* Sections */
        .section {
          position: relative;
          z-index: 1;
          padding: 7rem 5%;
          text-align: center;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem,4.5vw,3.4rem);
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        [data-lang="ar"] .section-title {
          font-family: 'Tajawal', sans-serif;
          letter-spacing: 0;
        }

        .section-sub {
          font-size: 0.95rem;
          color: var(--muted2);
          max-width: 520px;
          margin: 0 auto 4rem;
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .step-card {
          border-radius: 20px;
          padding: 2.2rem 1.8rem;
          text-align: center;
          transition: transform 0.3s;
        }

        .step-card:hover {
          transform: translateY(-6px);
        }

        .step-number {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px solid var(--c2-border);
          background: var(--c2-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--c2);
          margin: 0 auto 1.4rem;
        }

        .step-card h3 {
          font-size: 1.05rem;
          margin-bottom: 0.6rem;
        }

        .step-card p {
          font-size: 0.88rem;
          color: var(--muted2);
        }

        /* Features */
        .features-section {
          background: rgba(255,255,255,0.015);
          border-top: 1px solid var(--gb);
          border-bottom: 1px solid var(--gb);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.3rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-card {
          border-radius: 20px;
          padding: 2rem;
          text-align: right;
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--c2-dim);
          border: 1px solid var(--c2-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1.3rem;
        }

        .feature-card h3 {
          font-size: 1rem;
          margin-bottom: 0.55rem;
        }

        .feature-card p {
          font-size: 0.87rem;
          color: var(--muted2);
        }

        /* Highlight */
        .highlight-section {
          padding: 7rem 5%;
        }

        .highlight-wrap {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .highlight-text {
          flex: 1;
          min-width: 280px;
        }

        .check-list {
          list-style: none;
          margin-top: 2rem;
        }

        .check-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.8rem;
          font-size: 0.92rem;
        }

        .check-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--c2-dim);
          border: 1px solid var(--c2-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: var(--c2);
        }

        .highlight-cards {
          flex: 1;
          min-width: 280px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .hcard {
          border-radius: 12px;
          padding: 1.4rem 1.2rem;
          transition: transform 0.3s;
        }

        .hcard:hover {
          transform: translateY(-5px);
        }

        .hci {
          font-size: 1.8rem;
          margin-bottom: 0.6rem;
        }

        .hct {
          font-size: 0.82rem;
          color: var(--muted2);
          margin-bottom: 0.3rem;
        }

        .hcv {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--c2);
        }

        .hcs {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 0.2rem;
        }

        /* Pricing */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 1.3rem;
          max-width: 950px;
          margin: 0 auto;
        }

        .pricing-card {
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: right;
          position: relative;
          transition: transform 0.3s;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
        }

        .pricing-card.popular {
          background: rgba(0,212,255,0.035);
          box-shadow: 0 0 60px rgba(0,212,255,0.07);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--c2);
          color: var(--c1);
          font-size: 0.72rem;
          padding: 0.3rem 1rem;
          border-radius: 99px;
          white-space: nowrap;
        }

        .plan-name {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }

        .plan-price {
          font-family: 'Outfit', sans-serif;
          font-size: 3.2rem;
          font-weight: 900;
          margin-bottom: 0.4rem;
        }

        .plan-price span {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--muted);
        }

        .plan-desc {
          font-size: 0.85rem;
          color: var(--muted2);
          margin-bottom: 2rem;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 2rem;
        }

        .plan-features li {
          font-size: 0.87rem;
          color: var(--muted2);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .plan-features li::before {
          content: '✓';
          color: var(--c2);
          font-weight: 700;
        }

        .plan-btn {
          width: 100%;
          display: block;
          padding: 0.88rem;
          border-radius: 99px;
          text-align: center;
          text-decoration: none;
          background: var(--c2);
          color: var(--c1);
          font-weight: 700;
          transition: all 0.2s;
        }

        .plan-btn:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.3rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .testimonial-card {
          border-radius: 20px;
          padding: 2rem;
          text-align: right;
          transition: transform 0.3s;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
        }

        .stars {
          color: #ffd700;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          font-size: 0.9rem;
          color: var(--muted2);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .author-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--c2-dim);
          border: 1px solid var(--c2-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--c2);
        }

        .author-name {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .author-role {
          font-size: 0.76rem;
          color: var(--muted);
        }

        /* FAQ */
        .faq-grid {
          max-width: 740px;
          margin: 0 auto;
        }

        .faq-item {
          border-radius: 12px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 1.2rem 1.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          font-family: inherit;
          text-align: right;
        }

        .faq-question:hover {
          color: var(--c2);
        }

        .faq-icon {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background: var(--gb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s;
        }

        .faq-item.open .faq-icon {
          background: var(--c2);
          color: var(--c1);
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          font-size: 0.88rem;
          color: var(--muted2);
          line-height: 1.75;
          padding: 0 1.6rem;
        }

        .faq-item.open .faq-answer {
          max-height: 280px;
          padding: 0 1.6rem 1.3rem;
        }

        /* CTA */
        .cta-section {
          padding: 0 5% 7rem;
        }

        .cta-box {
          max-width: 720px;
          margin: 0 auto;
          border-radius: 32px;
          padding: 5rem 3rem;
          text-align: center;
        }

        .cta-form {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;
        }

        .cta-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--gs);
          border-radius: 99px;
          padding: 0.9rem 1.5rem;
          color: var(--text);
          font-family: inherit;
          font-size: 0.95rem;
          width: 300px;
          outline: none;
        }

        .cta-input:focus {
          border-color: var(--c2-border);
        }

        .cta-btn {
          background: var(--c2);
          color: var(--c1);
          border: none;
          padding: 0.9rem 2rem;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px var(--c2-glow);
        }

        .trust-badges {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          font-size: 0.8rem;
          color: var(--muted);
        }

        .trust-badges span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* Footer */
        .footer {
          padding: 2.5rem 5%;
          border-top: 1px solid var(--gb);
          background: rgba(5,8,15,0.7);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: var(--muted);
          font-size: 0.82rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--c2);
        }

        .copyright {
          font-size: 0.8rem;
          color: var(--muted);
        }

        /* منع الزوم التلقائي على الموبايل */
        input, 
        textarea, 
        select {
          font-size: 16px !important;
        }

        @media (max-width: 768px) {
          input, 
          textarea, 
          select {
            font-size: 16px !important;
          }
        }

        /* ========== RESPONSIVE DESIGN ========== */

        /* Tablet */
        @media (max-width: 1024px) {
          .hero {
            padding: 8rem 5% 4rem;
          }
          
          h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
          }
          
          .steps-grid,
          .features-grid,
          .pricing-grid,
          .testimonials-grid {
            gap: 1rem;
          }
          
          .step-card {
            padding: 1.5rem;
          }
          
          .highlight-wrap {
            gap: 2rem;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .hamburger {
            display: flex;
          }
          
          .hero {
            padding: 7rem 5% 3rem;
            min-height: auto;
          }
          
          .hero-btns {
            margin-bottom: 2rem;
          }
          
          .btn-p, .btn-o {
            padding: 0.7rem 1.5rem;
            font-size: 0.85rem;
          }
          
          .fbadges {
            display: none;
          }
          
          .mockup-wrap {
            max-width: 100%;
          }
          
          .chat-body {
            height: 220px;
          }
          
          .stats-grid {
            gap: 0.8rem;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .stat-label {
            font-size: 0.7rem;
          }
          
          .section {
            padding: 4rem 5%;
          }
          
          .section-title {
            font-size: clamp(1.5rem, 5vw, 2rem);
          }
          
          .steps-grid,
          .features-grid,
          .pricing-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          
          .feature-card {
            text-align: center;
          }
          
          .feature-icon {
            margin-left: auto;
            margin-right: auto;
          }
          
          .highlight-section {
            padding: 4rem 5%;
          }
          
          .highlight-cards {
            grid-template-columns: 1fr;
          }
          
          .cta-box {
            padding: 2rem 1.5rem;
          }
          
          .cta-form {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-input {
            width: 100%;
            max-width: 300px;
          }
          
          .cta-btn {
            width: 100%;
            max-width: 300px;
          }
          
          .trust-badges {
            gap: 0.8rem;
            font-size: 0.7rem;
          }
          
          .footer {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .footer-links {
            justify-content: center;
            gap: 1rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero-sub {
            font-size: 0.85rem;
          }
          
          .stat-number {
            font-size: 1.2rem;
          }
          
          .pricing-card {
            padding: 1.5rem;
          }
          
          .plan-price {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </main>
  )
}