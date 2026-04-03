export default function DesignSystem() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --c1:        #05080f;
          --c2:        #00d4ff;
          --c2-dim:    rgba(0,212,255,.12);
          --c2-glow:   rgba(0,212,255,.22);
          --c2-border: rgba(0,212,255,.18);
          --glass:     rgba(255,255,255,.035);
          --gb:        rgba(255,255,255,.07);
          --gs:        rgba(255,255,255,.12);
          --text:      #eef2ff;
          --muted:     rgba(238,242,255,.42);
          --muted2:    rgba(238,242,255,.62);
        }

        * { margin:0; padding:0; box-sizing:border-box; }

        body {
          font-family: 'Outfit', sans-serif;
          background: var(--c1);
          color: var(--text);
          min-height: 100vh;
        }

        .bg-mesh {
          position: fixed; inset: 0; z-index: 0;
          overflow: hidden; pointer-events: none;
        }
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(110px);
          animation: bd 12s ease-in-out infinite alternate;
        }
        .b1 { width:700px;height:700px;background:rgba(0,212,255,.1);top:-200px;right:-180px; }
        .b2 { width:550px;height:550px;background:rgba(0,80,255,.08);bottom:-150px;left:-150px;animation-delay:-5s; }
        @keyframes bd {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(35px,25px) scale(1.08); }
        }

        .page {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 8rem;
        }

        /* Header */
        .ds-header { margin-bottom: 5rem; }
        .ds-badge {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .35rem 1rem; border-radius: 99px;
          background: var(--c2-dim); border: 1px solid var(--c2-border);
          font-size: .72rem; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: var(--c2); margin-bottom: 1.2rem;
        }
        .ds-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900; letter-spacing: -2px; line-height: 1;
          margin-bottom: .75rem;
        }
        .ds-title span { color: var(--c2); text-shadow: 0 0 40px var(--c2-glow); }
        .ds-subtitle { font-size: .95rem; color: var(--muted2); }

        /* Section */
        .ds-section { margin-bottom: 5rem; }
        .ds-section-label {
          font-size: .7rem; font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase; color: var(--muted);
          border-bottom: 1px solid var(--gb);
          padding-bottom: .75rem; margin-bottom: 2rem;
        }

        /* Colors */
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }
        .color-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid var(--gb);
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(10px);
        }
        .color-swatch { height: 80px; width: 100%; }
        .color-info { padding: .85rem 1rem; }
        .color-name { font-size: .82rem; font-weight: 700; margin-bottom: .2rem; }
        .color-var  { font-size: .7rem; color: var(--c2); font-family: monospace; margin-bottom: .15rem; }
        .color-hex  { font-size: .7rem; color: var(--muted); font-family: monospace; }

        /* Typography */
        .type-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .type-card {
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--gb);
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(10px);
          display: flex; align-items: baseline;
          justify-content: space-between; gap: 2rem; flex-wrap: wrap;
        }
        .type-sample { line-height: 1.1; }
        .type-meta   { flex-shrink: 0; text-align: right; }
        .type-label  { font-size: .72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--c2); margin-bottom: .3rem; }
        .type-specs  { font-size: .75rem; color: var(--muted); font-family: monospace; line-height: 1.7; }

        /* Glass Effects */
        .glass-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .glass-card {
          border-radius: 16px; padding: 1.75rem;
          display: flex; flex-direction: column; gap: .5rem;
        }
        .glass-label { font-size: .8rem; font-weight: 700; }
        .glass-desc  { font-size: .75rem; color: var(--muted2); line-height: 1.6; }
        .glass-var   { font-size: .68rem; color: var(--c2); font-family: monospace; margin-top: .3rem; }

        /* Spacing */
        .spacing-grid { display: flex; flex-direction: column; gap: .75rem; }
        .spacing-row  {
          display: flex; align-items: center; gap: 1.5rem;
          padding: 1rem 1.5rem; border-radius: 12px;
          border: 1px solid var(--gb);
          background: rgba(255,255,255,.02);
        }
        .spacing-bar  { background: var(--c2); height: 8px; border-radius: 4px; flex-shrink: 0; opacity: .85; }
        .spacing-name { font-size: .8rem; font-weight: 700; width: 60px; flex-shrink: 0; }
        .spacing-px   { font-family: monospace; font-size: .75rem; color: var(--c2); width: 50px; flex-shrink: 0; }
        .spacing-desc { font-size: .75rem; color: var(--muted2); }

        /* Radius */
        .radius-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
        .radius-card {
          padding: 1.5rem; text-align: center;
          border: 1px solid var(--gb);
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(10px);
        }
        .radius-box  {
          width: 60px; height: 60px;
          background: var(--c2-dim); border: 1px solid var(--c2-border);
          margin: 0 auto 1rem;
        }
        .radius-label { font-size: .8rem; font-weight: 700; margin-bottom: .2rem; }
        .radius-var   { font-size: .7rem; color: var(--c2); font-family: monospace; }

        /* Buttons */
        .btn-grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
        .ds-btn-p {
          background: var(--c2); color: var(--c1);
          padding: .88rem 2.2rem; border-radius: 99px;
          font-weight: 700; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: .9rem;
          box-shadow: 0 0 22px var(--c2-glow);
          transition: all .2s;
        }
        .ds-btn-p:hover { transform: translateY(-2px); box-shadow: 0 0 40px var(--c2-glow); }
        .ds-btn-o {
          background: var(--glass); color: var(--text);
          border: 1px solid var(--gs);
          padding: .88rem 2.2rem; border-radius: 99px;
          font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: .9rem;
          backdrop-filter: blur(10px); transition: all .2s;
        }
        .ds-btn-o:hover { border-color: var(--c2-border); background: var(--c2-dim); }
        .ds-btn-sm {
          background: var(--c2); color: var(--c1);
          padding: .4rem 1.1rem; border-radius: 99px;
          font-weight: 700; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: .78rem;
        }
        .ds-badge-pill {
          background: var(--c2-dim); border: 1px solid var(--c2-border);
          color: var(--c2); padding: .3rem 1rem; border-radius: 99px;
          font-size: .72rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Animations */
        .anim-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .anim-card {
          padding: 1.75rem; border-radius: 16px;
          border: 1px solid var(--gb);
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(10px);
          display: flex; flex-direction: column; gap: .5rem;
        }
        .anim-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--c2); margin-bottom: .5rem;
        }
        .anim-pulse { animation: pulse 2s infinite; }
        .anim-float { animation: float 3s ease-in-out infinite alternate; }
        .anim-typing-wrap { display: flex; gap: 4px; margin-bottom: .5rem; }
        .td {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--c2); animation: td 1.2s infinite;
        }
        .td:nth-child(2) { animation-delay: .2s; }
        .td:nth-child(3) { animation-delay: .4s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.6)} }
        @keyframes float { from{transform:translateY(0)} to{transform:translateY(-8px)} }
        @keyframes td    { 0%,80%,100%{transform:scale(1);opacity:.5} 40%{transform:scale(1.4);opacity:1} }

        .anim-label { font-size: .8rem; font-weight: 700; }
        .anim-desc  { font-size: .75rem; color: var(--muted2); line-height: 1.6; }
        .anim-var   { font-size: .68rem; color: var(--c2); font-family: monospace; margin-top: .3rem; }
      `}</style>

      {/* Background */}
      <div className="bg-mesh">
        <div className="blob b1" />
        <div className="blob b2" />
      </div>

      <div className="page">

        {/* Header */}
        <header className="ds-header">
          <div className="ds-badge">✦ Design System</div>
          <h1 className="ds-title">IryChat <span>Design Tokens</span></h1>
          <p className="ds-subtitle">الألوان، الخطوط، المسافات، وكل عناصر الـ UI في مكان واحد</p>
        </header>

        {/* ── COLORS ── */}
        <section className="ds-section">
          <div className="ds-section-label">01 — Colors</div>
          <div className="color-grid">
            {[
              { name: 'Background',    varName: '--c1',        hex: '#05080f',                     swatch: '#05080f',                  border: '1px solid rgba(255,255,255,.1)' },
              { name: 'Cyan Primary',  varName: '--c2',        hex: '#00d4ff',                     swatch: '#00d4ff' },
              { name: 'Cyan Dim',      varName: '--c2-dim',    hex: 'rgba(0,212,255,.12)',          swatch: 'rgba(0,212,255,.9)' },
              { name: 'Cyan Glow',     varName: '--c2-glow',   hex: 'rgba(0,212,255,.22)',          swatch: 'rgba(0,212,255,.7)' },
              { name: 'Cyan Border',   varName: '--c2-border', hex: 'rgba(0,212,255,.18)',          swatch: 'rgba(0,212,255,.6)' },
              { name: 'Text',          varName: '--text',      hex: '#eef2ff',                     swatch: '#eef2ff' },
              { name: 'Muted',         varName: '--muted',     hex: 'rgba(238,242,255,.42)',        swatch: 'rgba(238,242,255,.42)' },
              { name: 'Muted 2',       varName: '--muted2',    hex: 'rgba(238,242,255,.62)',        swatch: 'rgba(238,242,255,.62)' },
              { name: 'Glass',         varName: '--glass',     hex: 'rgba(255,255,255,.035)',       swatch: 'rgba(255,255,255,.15)',  border: '1px solid rgba(255,255,255,.1)' },
              { name: 'Glass Border',  varName: '--gb',        hex: 'rgba(255,255,255,.07)',        swatch: 'rgba(255,255,255,.5)',   border: '1px solid rgba(255,255,255,.1)' },
              { name: 'Glass Strong',  varName: '--gs',        hex: 'rgba(255,255,255,.12)',        swatch: 'rgba(255,255,255,.7)',   border: '1px solid rgba(255,255,255,.1)' },
              { name: 'Stars',         varName: '—',           hex: '#ffd700',                     swatch: '#ffd700' },
            ].map((c) => (
              <div key={c.varName} className="color-card">
                <div className="color-swatch" style={{ background: c.swatch, border: c.border }} />
                <div className="color-info">
                  <div className="color-name">{c.name}</div>
                  <div className="color-var">{c.varName}</div>
                  <div className="color-hex">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TYPOGRAPHY ── */}
        <section className="ds-section">
          <div className="ds-section-label">02 — Typography</div>
          <div className="type-grid">
            {[
              { sample: 'IryChat', size: 'clamp(2.8rem, 8vw, 6.5rem)', weight: 900, font: 'Outfit', label: 'Hero H1', specs: 'font: Outfit\nweight: 900\nletter-spacing: -2px' },
              { sample: 'كل أدوات الأتمتة في مكان واحد', size: 'clamp(2rem, 4.5vw, 3.4rem)', weight: 900, font: 'Tajawal', label: 'Section Title (AR)', specs: 'font: Tajawal\nweight: 900\nletter-spacing: 0' },
              { sample: 'All Automation Tools In One Place', size: 'clamp(2rem, 4.5vw, 3.4rem)', weight: 900, font: 'Outfit', label: 'Section Title (EN)', specs: 'font: Outfit\nweight: 900\nletter-spacing: -1.5px' },
              { sample: 'قم بزيادة مبيعاتك وعزز تفاعلك مع جمهورك', size: '1.18rem', weight: 400, font: 'Tajawal', label: 'Body / Hero Sub (AR)', specs: 'font: Tajawal\nweight: 400\nline-height: 1.75' },
              { sample: 'Sell more, engage better, and grow your audience.', size: '1.18rem', weight: 400, font: 'Outfit', label: 'Body / Hero Sub (EN)', specs: 'font: Outfit\nweight: 400\nline-height: 1.75' },
              { sample: 'FEATURES', size: '.72rem', weight: 700, font: 'Outfit', label: 'Tag / Label', specs: 'font: Outfit\nweight: 700\nletter-spacing: 3px\ntext-transform: uppercase' },
              { sample: '$29', size: '3.2rem', weight: 900, font: 'Outfit', label: 'Pricing Number', specs: 'font: Outfit\nweight: 900\nfont-size: 3.2rem' },
            ].map((t) => (
              <div key={t.label} className="type-card">
                <div
                  className="type-sample"
                  style={{ fontFamily: t.font, fontSize: t.size, fontWeight: t.weight, color: 'var(--text)' }}
                >
                  {t.sample}
                </div>
                <div className="type-meta">
                  <div className="type-label">{t.label}</div>
                  <pre className="type-specs">{t.specs}</pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GLASS EFFECTS ── */}
        <section className="ds-section">
          <div className="ds-section-label">03 — Glass Effects</div>
          <div className="glass-grid">
            {[
              {
                label: '.gl — Standard Glass',
                desc:  'الكروت الأساسية، الـ navbar، الـ mockup',
                style: { background: 'var(--glass)', backdropFilter: 'blur(22px) saturate(180%)', border: '1px solid var(--gb)', boxShadow: '0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05)' },
                vars:  'blur(22px) saturate(180%)',
              },
              {
                label: '.gl2 — Strong Glass',
                desc:  'الـ CTA box والعناصر البارزة',
                style: { background: 'rgba(255,255,255,.055)', backdropFilter: 'blur(26px) saturate(200%)', border: '1px solid var(--gs)', boxShadow: '0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.09)' },
                vars:  'blur(26px) saturate(200%)',
              },
              {
                label: 'Navbar Glass',
                desc:  'ثابتة في الأعلى — شفافية عالية',
                style: { background: 'rgba(5,8,15,0.75)', backdropFilter: 'blur(30px)', border: '1px solid var(--gb)' },
                vars:  'blur(30px)',
              },
              {
                label: 'Mobile Menu Glass',
                desc:  'قائمة الموبايل المنسدلة',
                style: { background: 'rgba(5,8,15,0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--gb)' },
                vars:  'blur(20px)',
              },
            ].map((g) => (
              <div key={g.label} className="glass-card" style={g.style}>
                <div className="glass-label">{g.label}</div>
                <div className="glass-desc">{g.desc}</div>
                <div className="glass-var">{g.vars}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SPACING ── */}
        <section className="ds-section">
          <div className="ds-section-label">04 — Spacing</div>
          <div className="spacing-grid">
            {[
              { name: 'xs',   px: '4px',   width: 4,   desc: 'gap صغير جداً — مسافات داخل الكروبس' },
              { name: 'sm',   px: '8px',   width: 8,   desc: 'padding صغير — الـ tags والـ badges' },
              { name: 'md',   px: '16px',  width: 16,  desc: 'gap بين العناصر المتقاربة' },
              { name: 'lg',   px: '24px',  width: 24,  desc: 'padding الكروت الداخلية' },
              { name: 'xl',   px: '32px',  width: 32,  desc: 'padding الكروت الكبيرة' },
              { name: '2xl',  px: '48px',  width: 48,  desc: 'المسافة بين الأقسام الفرعية' },
              { name: '3xl',  px: '80px',  width: 80,  desc: 'padding الـ sections — vertical' },
              { name: 'page', px: '5%',    width: 60,  desc: 'الـ horizontal padding للصفحة' },
            ].map((s) => (
              <div key={s.name} className="spacing-row">
                <div className="spacing-name">{s.name}</div>
                <div className="spacing-bar" style={{ width: s.width * 2 }} />
                <div className="spacing-px">{s.px}</div>
                <div className="spacing-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BORDER RADIUS ── */}
        <section className="ds-section">
          <div className="ds-section-label">05 — Border Radius</div>
          <div className="radius-grid">
            {[
              { label: 'Small',   value: '8px',    var: '--rs (8px)',   usage: 'تاجز صغيرة' },
              { label: 'Medium',  value: '12px',   var: '12px',         usage: 'FAQ items' },
              { label: 'Default', value: '16px',   var: '16px',         usage: 'hcards' },
              { label: 'Large',   value: '20px',   var: '--r (20px)',   usage: 'الكروت الرئيسية' },
              { label: 'XL',      value: '24px',   var: '24px',         usage: 'الـ mockup' },
              { label: 'CTA',     value: '32px',   var: '32px',         usage: 'CTA box' },
              { label: 'Full',    value: '99px',   var: '99px',         usage: 'أزرار، badges، pills' },
            ].map((r) => (
              <div key={r.label} className="radius-card">
                <div className="radius-box" style={{ borderRadius: r.value, background: 'var(--c2-dim)', border: '1px solid var(--c2-border)' }} />
                <div className="radius-label">{r.label}</div>
                <div className="radius-var">{r.var}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginTop: '.2rem' }}>{r.usage}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BUTTONS & COMPONENTS ── */}
        <section className="ds-section">
          <div className="ds-section-label">06 — Buttons & Components</div>
          <div className="btn-grid">
            <button className="ds-btn-p">Primary Button</button>
            <button className="ds-btn-o">Outline Button</button>
            <button className="ds-btn-sm">Small Button</button>
            <span className="ds-badge-pill">FEATURES</span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              padding: '.4rem 1.2rem', borderRadius: '99px',
              background: 'var(--c2-dim)', border: '1px solid var(--c2-border)',
              color: 'var(--c2)', fontSize: '.8rem', fontWeight: 700,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c2)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Pill Badge
            </div>
          </div>
        </section>

        {/* ── ANIMATIONS ── */}
        <section className="ds-section">
          <div className="ds-section-label">07 — Animations</div>
          <div className="anim-grid">
            <div className="anim-card">
              <div className="anim-dot anim-pulse" />
              <div className="anim-label">pulse-dot</div>
              <div className="anim-desc">مؤشر النشاط في الـ pill وstatus</div>
              <div className="anim-var">animation: pulse 2s infinite</div>
            </div>
            <div className="anim-card">
              <div className="anim-typing-wrap">
                <div className="td" />
                <div className="td" />
                <div className="td" />
              </div>
              <div className="anim-label">typing-dot</div>
              <div className="anim-desc">مؤشر الكتابة في الـ chat mockup</div>
              <div className="anim-var">animation: td 1.2s infinite</div>
            </div>
            <div className="anim-card">
              <div className="anim-dot" style={{ background: 'var(--c2)', animation: 'float 3s ease-in-out infinite alternate', marginBottom: '.5rem' }} />
              <div className="anim-label">float</div>
              <div className="anim-desc">الـ floating badges في الـ hero</div>
              <div className="anim-var">animation: float 4s infinite alternate</div>
            </div>
            <div className="anim-card">
              <div className="anim-dot" style={{ background: 'var(--c2)', animation: 'bd 12s ease-in-out infinite alternate', marginBottom: '.5rem' }} />
              <div className="anim-label">blob-drift</div>
              <div className="anim-desc">حركة الـ background blobs</div>
              <div className="anim-var">animation: blob-drift 12s ease-in-out infinite</div>
            </div>
            <div className="anim-card">
              <div style={{ fontSize: '.75rem', color: 'var(--muted2)', marginBottom: '.5rem', fontFamily: 'monospace' }}>
                {"{ opacity: 0, y: 40 }"}<br />
                {"→ { opacity: 1, y: 0 }"}
              </div>
              <div className="anim-label">fadeUp (Framer)</div>
              <div className="anim-desc">كل العناصر عند الظهور في الـ viewport</div>
              <div className="anim-var">duration: 0.6s, stagger: 0.15s</div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}