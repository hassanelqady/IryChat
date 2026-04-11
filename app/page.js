'use client'
import FeatureShowcase from '@/components/FeatureShowcase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import PageLayoutWith3D from '@/components/PageLayoutWith3D'

// Animation Variants
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// Data
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
  return <div className="text-yellow-400">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</div>
}

function HighlightCard({ icon, titleAr, titleEn, value, subAr, subEn, lang }) {
  return (
    <motion.div variants={fadeUp} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col justify-between h-full">
      <div className="text-4xl mb-4">{icon}</div>
      <div>
        <div className="text-sm text-gray-400 mb-1">{lang === 'ar' ? titleAr : titleEn}</div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-gray-500">{lang === 'ar' ? subAr : subEn}</div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { lang } = useLanguage()
  const isRTL = lang === 'ar'

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentTestimonials = TESTIMONIALS[lang] ?? TESTIMONIALS.ar

  return (
    <PageLayoutWith3D dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-4xl mx-auto">
            
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold mb-6">
              {lang === 'ar' ? ' الجيل الجديد من التسويق عبر المحادثة  ' : 'The new generation of conversational marketing'}
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
              {lang === 'ar'
                ? <span>المنصة العربية الأولى لأتمتة المحادثات<span className="text-cyan-400 border-b-2 border-cyan-400"></span></span>
                : <span>The first Arabic platform for chat automation <span className="text-cyan-400 border-b-2 border-cyan-400"></span></span>}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'استخدم قوة الذكاء الاصطناعي لأتمتة الردود، إغلاق المبيعات، وتوفير الوقت. IryChat هو فريق المبيعات الذي لا ينام أبداً. '
                : 'Leverage the power of AI to automate replies, close sales, and save time. IryChat is the sales team that never sleeps.'}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/login" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all duration-200 shadow-lg shadow-white/10 text-center">
                {lang === 'ar' ? 'ابدأ' : 'GET STARTED'}
              </Link>
              <button onClick={() => scrollTo('how')} className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-black transition-all duration-200 text-center">
                {lang === 'ar' ? 'اكتشف آلية العمل ▶' : 'Discover How It Works ▶'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16">
            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">{lang === 'ar' ? 'اكتشف آلية العمل' : 'Discover How It Works'}</div>
            <h2 className="text-4xl font-bold mb-4 text-white">{lang === 'ar' ? 'حول متابعيك إلى عملاء    ' : 'Turn your followers into customers'}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{lang === 'ar' ? 'من ربط الحساب لأول بيع تلقائي — في أقل من 10 دقايق' : 'From account connection to your first automated sale — in under 10 minutes'}</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', ar: ['وصّل انستجرامك', 'ربط حسابك عن طريق Meta API الرسمي — آمن 100% ومتوافق مع سياسات ميتا.'], en: ['Connect Instagram', 'Connect via the official Meta API — 100% secure & fully compliant with Meta policies.'] },
              { num: '02', ar: ['صمّم الـ Flow', 'استخدم الـ Visual Builder لتحديد الردود التلقائية على DMs والكومنتات بكلمات مفتاحية.'], en: ['Build Your Flow', 'Use the Visual Builder to create automated replies for DMs and comments with keywords.'] },
              { num: '03', ar: ['شغّل وشوف النتيجة', 'IryChat يشتغل 24/7 وإنت بتتابع المبيعات والتحويلات على الداشبورد بالريال تايم.'], en: ['Launch & See Results', 'IryChat runs 24/7 while you track sales and conversions on your real-time dashboard.'] },
            ].map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-4xl font-bold text-gray-700 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{lang === 'ar' ? step.ar[0] : step.en[0]}</h3>
                <p className="text-gray-400">{lang === 'ar' ? step.ar[1] : step.en[1]}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: Introduction to Features (Corrected Order) */}
      <section className="py-24 px-4 bg-white text-center relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Title 1 (Big) */}
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-8 leading-tight">
              {lang === 'ar' 
                ? 'انضم إلى آلاف أصحاب المتاجر والكوتشز والإيجنسيز في العالم العربي'
                : 'Join thousands of store owners, coaches, and agencies across the Arab world'}
            </h2>
            
            {/* Title 2 (Small) */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-600 mb-6 leading-relaxed">
              {lang === 'ar' 
                ? 'إليك بعض الأشياء التي يمكنك القيام بها باستخدام أدوات الأتمتة المذهلة لدينا!'
                : 'Here are some things you can do with our amazing automation tools!'}
            </h3>
          </motion.div>
        </div>
      </section>

      <FeatureShowcase />

      {/* Highlight Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">{lang === 'ar' ? 'قوة انستجرام' : 'Instagram Power'}</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {lang === 'ar' ? <span>كل تفاعل<br /><span className="text-gray-600">فرصة بيع</span></span> : <span>Every Interaction<br />A <span className="text-gray-600">Sales Chance</span></span>}
            </h2>
            <p className="text-gray-400 mb-6">{lang === 'ar' ? 'انستجرام مش بس منصة عرض — هو أقوى قناة مبيعات. IryChat يحوّل كل DM وكومنت ومنشن لمحادثة بيع حقيقية تلقائياً.' : "Instagram isn't just a showcase — it's your most powerful sales channel. IryChat turns every DM, comment & mention into a real sales conversation, automatically."}</p>
            <ul className="space-y-3">
              {[
                { ar: 'رد على DMs في أقل من ثانية', en: 'Reply to DMs in under 1 second' },
                { ar: 'أتمتة الكومنتات بكلمات مفتاحية', en: 'Comment automation with keywords' },
                { ar: 'تحويل Story Mentions لعملاء', en: 'Convert Story Mentions to customers' },
                { ar: 'بث جماعي للـ subscribers', en: 'Broadcast messages to all subscribers' },
                { ar: 'متوافق 100% مع سياسات ميتا', en: '100% compliant with Meta policies' },
              ].map((item) => (
                <li key={item.en} className="flex items-center gap-3 text-white"><span className="text-cyan-400 font-bold">✓</span>{lang === 'ar' ? item.ar : item.en}</li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="grid grid-cols-2 gap-4">
            <HighlightCard icon="💬" titleAr="DMs اليوم"      titleEn="Today's DMs"       value="247"   subAr="↑ 89% من أمس"         subEn="↑ 89% vs yesterday" lang={lang} />
            <HighlightCard icon="🎯" titleAr="معدل التحويل"   titleEn="Conversion Rate"   value="34%"   subAr="↑ 12% هذا الأسبوع"    subEn="↑ 12% this week"    lang={lang} />
            <HighlightCard icon="⚡" titleAr="ردود تلقائية"   titleEn="Auto Replies"      value="1,840" subAr="هذا الشهر"             subEn="This month"          lang={lang} />
            <HighlightCard icon="💰" titleAr="إيرادات مولّدة" titleEn="Revenue Generated" value="$8.2K" subAr="×3 مقارنة قبل IryChat" subEn="×3 vs before IryChat" lang={lang} />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16">
            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">{lang === 'ar' ? 'شهادات العملاء' : 'Customer Stories'}</div>
            <h2 className="text-4xl font-bold text-white">{lang === 'ar' ? 'بيقولوا إيه عن IryChat' : 'What People Say'}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {currentTestimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <StarRating count={t.stars} />
                <div className="text-gray-300 italic my-4 min-h-[80px]">"{t.text}"</div>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">{t.name.charAt(0)}</div>
                  <div><div className="font-bold text-white text-sm">{t.name}</div><div className="text-xs text-gray-400">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {lang === 'ar' ? 'جاهز لتعزيز مبيعاتك؟' : 'Ready to boost your sales?'}
          </h2>
          <p className="text-gray-400 mb-8">
            {lang === 'ar' ? 'انضم لآلاف المستخدمين الذين يحققون نتائج مذهلة مع IryChat.' : 'Join thousands of users achieving amazing results with IryChat.'}
          </p>
          <Link href="/signup" className="inline-block px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20">
            {lang === 'ar' ? 'ابدأ تجربة مجانية' : 'Start Free Trial'}
          </Link>
        </div>
      </section>

      {/* Footer - Original State Restored */}
      <footer className="relative mt-20 bg-black/60 backdrop-blur-xl border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-2xl font-bold text-white mb-4 block tracking-tight">
                IryChat
              </Link>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {lang === 'ar' 
                  ? 'المنصة العربية الأولى لأتمتة المحادثات وزيادة المبيعات عبر السوشيال ميديا.'
                  : 'The #1 Arabic platform for conversation automation and social media sales growth.'
                }
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'المنتج' : 'Product'}
              </h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'المميزات' : 'Features'}</Link></li>
                <li><Link href="#how" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'كيف يعمل' : 'How it Works'}</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</Link></li>
                <li><Link href="/integrations" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'التكاملات' : 'Integrations'}</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'الشركة' : 'Company'}
              </h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'من نحن' : 'About Us'}</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'وظائف' : 'Careers'}</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal & Support */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'الدعم والقانوني' : 'Support & Legal'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                    <span>🎧</span> {lang === 'ar' ? 'مركز الدعم الفني' : 'Help Center'}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {lang === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {lang === 'ar' ? 'حالة الخدمة' : 'System Status'}
                  </Link>
                </li>
              </ul>
            </div>

          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} IryChat. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            
          </div>
        </div>
      </footer>

    </PageLayoutWith3D>
  )
}