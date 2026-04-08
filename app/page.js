'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import * as THREE from 'three' 

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const TESTIMONIALS = {
  ar: [
    { name: 'نور محمد',  role: 'صاحبة متجر موضة',     stars: 5, text: 'زاد مبيعاتي 3 أضعاف في شهرين! كل ما حد يكتب "اسعار" في الكومنتات يوصله رسالة ويشتري.' },
    { name: 'علي خالد',  role: 'مدير تسويق - إيجنسي', stars: 5, text: 'كنت بصرف على موظف بيرد على DMs. دلوقتي وفّرت ده كله. الـ ROI واضح من أول أسبوع.' },
    { name: 'سلمى علي',  role: 'كوتش تنمية بشرية',    stars: 5, text: 'في ساعة واحدة عملت flow كامل. البوت بيرد أسرع مني وأذكى. العملاء مش مصدقين إنه بوت!' },
  ],
  en: [
    { name: 'Nour Mohamed', role: 'Fashion Store Owner',         stars: 5, text: 'My sales tripled in 2 months! Every time someone comments "price", they get an auto message and buy.' },
    { name: 'Ali Khaled',   role: 'Marketing Director - Agency', stars: 5, text: 'I used to pay someone to reply to DMs. Now that budget is saved and ROI was clear from the first week.' },
    { name: 'Salma Ali',    role: 'Life & Business Coach',       stars: 5, text: 'In one hour I had a complete flow running. The bot replies faster and smarter. Clients can\'t believe it\'s automated!' },
  ],
}

function StarRating({ count }) {
  return <div className="stars text-white">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</div>
}

function HighlightCard({ icon, titleAr, titleEn, value, subAr, subEn, lang }) {
  return (
    <motion.div variants={fadeUp} className="hcard gl" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="hci text-white">{icon}</div>
      <div className="hct text-white">{lang === 'ar' ? titleAr : titleEn}</div>
      <div className="hcv text-white">{value}</div>
      <div className="hcs text-gray-400">{lang === 'ar' ? subAr : subEn}</div>
    </motion.div>
  )
}

export default function Home() {
  const { lang } = useLanguage()
  const mountRef = useRef(null)

  // === Three.js: White Geometric Sphere (Dark Mode) ===
  useEffect(() => {
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.02) // ضباب أسود للدمج مع الخلفية

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    camera.position.x = 2.5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement)

    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // White Wireframe Sphere (مقلوب اللون)
    const sphereGeo = new THREE.IcosahedronGeometry(3.5, 2)
    const sphereMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, // أبيض
      wireframe: true,
      transparent: true,
      opacity: 0.1 
    })
    const mainSphere = new THREE.Mesh(sphereGeo, sphereMat)
    mainGroup.add(mainSphere)

    // Light Gray Core
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0)
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x888888, // رمادي فاتح
      emissive: 0x111111,
      flatShading: true
    })
    const coreSphere = new THREE.Mesh(coreGeo, coreMat)
    mainGroup.add(coreSphere)

    // White Particles
    const particlesGeo = new THREE.BufferGeometry()
    const particlesCount = 200
    const posArray = new Float32Array(particlesCount * 3)
    for(let i=0; i<particlesCount*3; i++) posArray[i] = (Math.random()-0.5)*15
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff, transparent: true, opacity: 0.2 })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    let scrollY = 0
    let targetY = 0
    
    const onScroll = () => {
        scrollY = window.scrollY
        targetY = scrollY * 0.01
    }
    window.addEventListener('scroll', onScroll)

    let mouseX = 0, mouseY = 0
    const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
        requestAnimationFrame(animate)
        mainGroup.position.y += (targetY - mainGroup.position.y) * 0.05
        mainSphere.rotation.y += 0.001
        mainSphere.rotation.x += 0.0005
        coreSphere.rotation.y -= 0.005
        coreSphere.rotation.z += 0.005
        particles.rotation.y -= 0.0005
        camera.position.x += (2.5 + mouseX * 0.2 - camera.position.x) * 0.05
        camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05
        camera.lookAt(0, mainGroup.position.y, 0)
        renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', handleResize)
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement)
        renderer.dispose()
    }
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentTestimonials = TESTIMONIALS[lang] ?? TESTIMONIALS.ar

  return (
    <main className="bg-black text-white transition-colors duration-300">
      <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }} />
      
      <section className="hero" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', paddingTop: '100px' }}>
        <div className="pill gl" style={{ background: 'white', color: 'black', border: 'none' }}>
          <span className="pdot bg-black" />
          {lang === 'ar' ? 'أذكى حلول الأتمتة' : 'The Smartest Automation Solution'}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
          {lang === 'ar'
            ? <span>استفد إلى أقصى حد من كل <span className="cy text-white border-b-2 border-white">محادثة</span></span>
            : <span>Make the most out of every <span className="cy text-white border-b-2 border-white">conversation</span></span>}
        </h1>
        <p className="hero-sub text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'قم بزيادة مبيعاتك، وعزز تفاعلك، ووسع جمهورك من خلال أتمتة قوية لمنصات إنستجرام وواتساب وتيك توك وماسنجر.'
            : 'Sell more, engage better, and grow your audience with powerful automations for Instagram, WhatsApp, TikTok, and Messenger.'}
        </p>
        <div className="hero-btns flex gap-4 justify-center mb-12">
          <Link href="/login" className="btn-p px-8 py-3 rounded-full font-bold transition-all hover:scale-105" style={{ background: '#fff', color: '#000' }}>
            {lang === 'ar' ? 'ابدأ' : 'GET STARTED'}
          </Link>
          <button className="btn-o px-8 py-3 rounded-full font-bold border-2 border-white text-white transition-all hover:bg-white hover:text-black" onClick={() => scrollTo('how')}>
            {lang === 'ar' ? 'اكتشف آلية العمل ▶' : 'Discover How It Works ▶'}
          </button>
        </div>
      </section>

      <section id="how" className="section py-20 relative z-10 max-w-6xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16">
          <div className="stag text-sm font-bold tracking-widest uppercase mb-2 text-gray-500">{lang === 'ar' ? 'اكتشف آلية العمل' : 'Discover How It Works'}</div>
          <h2 className="section-title text-4xl font-bold mb-4 text-white">{lang === 'ar' ? 'ابدأ في 3 خطوات' : 'Get Started in 3 Steps'}</h2>
          <p className="section-sub text-gray-400 max-w-2xl mx-auto">{lang === 'ar' ? 'من ربط الحساب لأول بيع تلقائي — في أقل من 10 دقايق' : 'From account connection to your first automated sale — in under 10 minutes'}</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="steps-grid grid md:grid-cols-3 gap-8">
          {[
            { num: '01', ar: ['وصّل انستجرامك', 'ربط حسابك عن طريق Meta API الرسمي — آمن 100% ومتوافق مع سياسات ميتا.'], en: ['Connect Instagram', 'Connect via the official Meta API — 100% secure & fully compliant with Meta policies.'] },
            { num: '02', ar: ['صمّم الـ Flow', 'استخدم الـ Visual Builder لتحديد الردود التلقائية على DMs والكومنتات بكلمات مفتاحية.'], en: ['Build Your Flow', 'Use the Visual Builder to create automated replies for DMs and comments with keywords.'] },
            { num: '03', ar: ['شغّل وشوف النتيجة', 'IryChat يشتغل 24/7 وإنت بتتابع المبيعات والتحويلات على الداشبورد بالريال تايم.'], en: ['Launch & See Results', 'IryChat runs 24/7 while you track sales and conversions on your real-time dashboard.'] },
          ].map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="step-card gl p-8 rounded-2xl border border-gray-800 bg-neutral-900/50 backdrop-blur-sm shadow-lg hover:border-gray-600 transition-all">
              <div className="step-number text-4xl font-bold text-gray-700 mb-4">{step.num}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{lang === 'ar' ? step.ar[0] : step.en[0]}</h3>
              <p className="text-gray-400">{lang === 'ar' ? step.ar[1] : step.en[1]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="features" className="section features-section py-20 bg-neutral-900 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16 max-w-6xl mx-auto px-4">
          <div className="stag text-sm font-bold tracking-widest uppercase mb-2 text-gray-500">{lang === 'ar' ? 'المميزات' : 'Features'}</div>
          <h2 className="section-title text-4xl font-bold text-white">{lang === 'ar' ? 'كل أدوات الأتمتة في مكان واحد' : 'All Automation Tools In One Place'}</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {[
            { icon: '💬', ar: ['رد تلقائي على DMs', 'حدد كلمات مفتاحية وIryChat يرد فوراً ويكمّل المحادثة لحد ما الشخص يشتري.'], en: ['Auto DM Replies', 'Set keywords and IryChat instantly replies, guiding conversations until the sale is done.'] },
            { icon: '📝', ar: ['أتمتة الكومنتات', 'أي حد يكتب "اسعار" في الكومنتات — IryChat يبعتله رسالة خاصة في ثواني.'], en: ['Comment Automation', 'Anyone who comments "price" gets an instant private message automatically within seconds.'] },
            { icon: '📸', ar: ['Story Mentions', 'أي حد يمنشنك في ستوريه يوصله رد تلقائي يشكره ويعرض عليه حاجة ذات قيمة.'], en: ['Story Mentions', 'Anyone who mentions you in their story gets an automatic personalized reply with a value offer.'] },
            { icon: '🏷️', ar: ['تقسيم الجمهور', 'صنّف متابعينك بتاجز تلقائية بناءً على تفاعلهم وابعت لكل شريحة رسالتها الصح.'], en: ['Audience Segmentation', 'Auto-tag subscribers by behavior and send each segment the perfectly tailored message.'] },
            { icon: '📊', ar: ['Analytics متعمقة', 'تابع معدلات الفتح والكليك والتحويل بالريال تايم. اعرف إيه الـ flow الأكثر تحويلاً.'], en: ['Deep Analytics', 'Track open rates, clicks & conversions in real-time. Know exactly which flow converts best.'] },
            { icon: '🔗', ar: ['API + Webhooks', 'وصّل IryChat بأي نظام خارجي — CRM أو متجرك — عن طريق REST API كامل.'], en: ['API + Webhooks', 'Connect IryChat to any external system — CRM, your store — via a full REST API.'] },
          ].map((f) => (
            <motion.div key={f.en[0]} variants={fadeUp} className="feature-card gl p-6 rounded-2xl border border-gray-800 bg-neutral-900/50 backdrop-blur-sm shadow-lg hover:border-gray-600 transition-all">
              <div className="feature-icon text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{lang === 'ar' ? f.ar[0] : f.en[0]}</h3>
              <p className="text-gray-400 text-sm">{lang === 'ar' ? f.ar[1] : f.en[1]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="highlight-section py-20 relative z-10 max-w-6xl mx-auto px-4">
        <div className="highlight-wrap grid md:grid-cols-2 gap-12 items-center">
          <div className="highlight-text">
            <motion.div variants={fadeUp}>
              <div className="stag text-sm font-bold tracking-widest uppercase mb-2 text-gray-500">{lang === 'ar' ? 'قوة انستجرام' : 'Instagram Power'}</div>
              <h2 className="section-title text-4xl font-bold mb-6 text-white">
                {lang === 'ar' ? <span>كل تفاعل<br /><span className="text-gray-600">فرصة بيع</span></span> : <span>Every Interaction<br />A <span className="text-gray-600">Sales Chance</span></span>}
              </h2>
              <p className="text-gray-400 mb-6">{lang === 'ar' ? 'انستجرام مش بس منصة عرض — هو أقوى قناة مبيعات. IryChat يحوّل كل DM وكومنت ومنشن لمحادثة بيع حقيقية تلقائياً.' : "Instagram isn't just a showcase — it's your most powerful sales channel. IryChat turns every DM, comment & mention into a real sales conversation, automatically."}</p>
              <ul className="check-list space-y-3">
                {[
                  { ar: 'رد على DMs في أقل من ثانية', en: 'Reply to DMs in under 1 second' },
                  { ar: 'أتمتة الكومنتات بكلمات مفتاحية', en: 'Comment automation with keywords' },
                  { ar: 'تحويل Story Mentions لعملاء', en: 'Convert Story Mentions to customers' },
                  { ar: 'بث جماعي للـ subscribers', en: 'Broadcast messages to all subscribers' },
                  { ar: 'متوافق 100% مع سياسات ميتا', en: '100% compliant with Meta policies' },
                ].map((item) => (
                  <li key={item.en} className="flex items-center gap-3 text-white"><span className="check-icon text-white font-bold">✓</span>{lang === 'ar' ? item.ar : item.en}</li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="highlight-cards grid grid-cols-2 gap-4">
            <HighlightCard icon="💬" titleAr="DMs اليوم"      titleEn="Today's DMs"       value="247"   subAr="↑ 89% من أمس"         subEn="↑ 89% vs yesterday" lang={lang} />
            <HighlightCard icon="🎯" titleAr="معدل التحويل"   titleEn="Conversion Rate"   value="34%"   subAr="↑ 12% هذا الأسبوع"    subEn="↑ 12% this week"    lang={lang} />
            <HighlightCard icon="⚡" titleAr="ردود تلقائية"   titleEn="Auto Replies"      value="1,840" subAr="هذا الشهر"             subEn="This month"          lang={lang} />
            <HighlightCard icon="💰" titleAr="إيرادات مولّدة" titleEn="Revenue Generated" value="$8.2K" subAr="×3 مقارنة قبل IryChat" subEn="×3 vs before IryChat" lang={lang} />
          </div>
        </div>
      </motion.section>

      <section id="testimonials" className="section py-20 relative z-10 max-w-6xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16">
          <div className="stag text-sm font-bold tracking-widest uppercase mb-2 text-gray-500">{lang === 'ar' ? 'شهادات العملاء' : 'Customer Stories'}</div>
          <h2 className="section-title text-4xl font-bold text-white">{lang === 'ar' ? 'بيقولوا إيه عن IryChat' : 'What People Say'}</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="testimonials-grid grid md:grid-cols-3 gap-8">
          {currentTestimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="testimonial-card gl p-6 rounded-2xl border border-gray-800 bg-neutral-900/50 backdrop-blur-sm">
              <StarRating count={t.stars} />
              <div className="testimonial-text text-gray-300 italic my-4">"{t.text}"</div>
              <div className="testimonial-author flex items-center gap-3">
                <div className="author-avatar w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                <div><div className="author-name font-bold text-white text-sm">{t.name}</div><div className="author-role text-xs text-gray-400">{t.role}</div></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="footer py-12 border-t border-gray-800 bg-black relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            {/* Logo Removed */}
            <div className="footer-links flex gap-6 mb-4 md:mb-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">{lang === 'ar' ? 'الدعم الفني' : 'Support'}</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
            </div>
            <div className="copyright text-gray-500 text-sm">© 2025 IryChat</div>
        </div>
      </footer>
    </main>
  )
}