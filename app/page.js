'use client'

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
              {lang === 'ar' ? 'أذكى حلول الأتمتة' : 'The Smartest Automation Solution'}
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
              {lang === 'ar'
                ? <span>استفد إلى أقصى حد من كل <span className="text-cyan-400 border-b-2 border-cyan-400">محادثة</span></span>
                : <span>Make the most out of every <span className="text-cyan-400 border-b-2 border-cyan-400">conversation</span></span>}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'قم بزيادة مبيعاتك، وعزز تفاعلك، ووسع جمهورك من خلال أتمتة قوية لمنصات إنستجرام وواتساب وتيك توك وماسنجر.'
                : 'Sell more, engage better, and grow your audience with powerful automations for Instagram, WhatsApp, TikTok, and Messenger.'}
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
            <h2 className="text-4xl font-bold mb-4 text-white">{lang === 'ar' ? 'ابدأ في 3 خطوات' : 'Get Started in 3 Steps'}</h2>
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

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="text-center mb-16">
            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">{lang === 'ar' ? 'المميزات' : 'Features'}</div>
            <h2 className="text-4xl font-bold text-white">{lang === 'ar' ? 'كل أدوات الأتمتة في مكان واحد' : 'All Automation Tools In One Place'}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💬', ar: ['رد تلقائي على DMs', 'حدد كلمات مفتاحية وIryChat يرد فوراً ويكمّل المحادثة لحد ما الشخص يشتري.'], en: ['Auto DM Replies', 'Set keywords and IryChat instantly replies, guiding conversations until the sale is done.'] },
              { icon: '📝', ar: ['أتمتة الكومنتات', 'أي حد يكتب "اسعار" في الكومنتات — IryChat يبعتله رسالة خاصة في ثواني.'], en: ['Comment Automation', 'Anyone who comments "price" gets an instant private message automatically within seconds.'] },
              { icon: '📸', ar: ['Story Mentions', 'أي حد يمنشنك في ستوريه يوصله رد تلقائي يشكره ويعرض عليه حاجة ذات قيمة.'], en: ['Story Mentions', 'Anyone who mentions you in their story gets an automatic personalized reply with a value offer.'] },
              { icon: '🏷️', ar: ['تقسيم الجمهور', 'صنّف متابعينك بتاجز تلقائية بناءً على تفاعلهم وابعت لكل شريحة رسالتها الصح.'], en: ['Audience Segmentation', 'Auto-tag subscribers by behavior and send each segment the perfectly tailored message.'] },
              { icon: '📊', ar: ['Analytics متعمقة', 'تابع معدلات الفتح والكليك والتحويل بالريال تايم. اعرف إيه الـ flow الأكثر تحويلاً.'], en: ['Deep Analytics', 'Track open rates, clicks & conversions in real-time. Know exactly which flow converts best.'] },
              { icon: '🔗', ar: ['API + Webhooks', 'وصّل IryChat بأي نظام خارجي — CRM أو متجرك — عن طريق REST API كامل.'], en: ['API + Webhooks', 'Connect IryChat to any external system — CRM, your store — via a full REST API.'] },
            ].map((f) => (
              <motion.div key={f.en[0]} variants={fadeUp} className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-white">{lang === 'ar' ? f.ar[0] : f.en[0]}</h3>
                <p className="text-gray-400 text-sm">{lang === 'ar' ? f.ar[1] : f.en[1]}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{lang === 'ar' ? 'الدعم الفني' : 'Support'}</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
            </div>
            <div className="text-gray-500 text-sm">© 2025 IryChat</div>
        </div>
      </footer>

    </PageLayoutWith3D>
  )
}