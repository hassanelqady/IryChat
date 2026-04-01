export default function Stats() {
  return (
    <section className="py-16 border-y border-white/10 text-center">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">

        <div>
          <div className="text-2xl font-bold text-cyan-400">+15K</div>
          <div className="text-white/50 text-sm">مستخدم</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-cyan-400">98%</div>
          <div className="text-white/50 text-sm">Open Rate</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-cyan-400">×3.4</div>
          <div className="text-white/50 text-sm">تحويلات</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-cyan-400">24/7</div>
          <div className="text-white/50 text-sm">Auto Reply</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-cyan-400">&lt;1s</div>
          <div className="text-white/50 text-sm">Response</div>
        </div>

      </div>
    </section>
  )
}