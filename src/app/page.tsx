import Link from 'next/link'
import { ArrowRight, MapPin, Shield, Bell, CheckCircle, Users, Zap, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#030712] text-slate-100">

      {/* ─── Animated background layers ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Deep space gradient */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,165,233,0.15) 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 hex-grid opacity-60" />

        {/* Glowing orbs */}
        <div className="absolute top-[15%] right-[10%] h-80 w-80 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
        <div className="absolute bottom-[20%] left-[5%] h-60 w-60 rounded-full opacity-15 blur-3xl animate-float-slow delay-1000"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute top-[50%] left-[40%] h-40 w-40 rounded-full opacity-10 blur-2xl animate-float-slow delay-500"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        {/* Floating particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-float"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 23 + 10) % 90}%`,
              background: i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#10b981' : '#8b5cf6',
              animationDuration: `${4 + (i % 4)}s`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* ─── NAV ─── */}
      <nav className="relative z-20 flex items-center justify-between border-b border-slate-800/60 px-6 py-4 glass md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl
            bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/30">
            <MapPin size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-sky-400">Civic</span>
            <span className="text-slate-100">Connect</span>
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {['Features', 'How It Works', 'Stats'].map(item => (
            <button key={item} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300
              hover:border-sky-500/60 hover:text-sky-400 hover:bg-sky-500/5 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white
              hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: Text */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full
              border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-blink" />
              Live GPS Verification · Real-Time Issue Resolution
            </div>

            {/* Heading */}
            <div className="animate-fade-up delay-100">
              <h1 className="font-black text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                <span className="text-slate-100">Your City.</span>
                <br />
                <span className="shimmer-text">Your Voice.</span>
                <br />
                <span className="text-slate-100">Resolved </span>
                <span className="text-sky-400">Fast.</span>
              </h1>
            </div>

            <p className="animate-fade-up delay-200 max-w-md text-lg text-slate-400 leading-relaxed">
              CivicConnect bridges citizens and government teams — report potholes, waterlogging,
              broken streetlights, and more with GPS-verified evidence that demands action.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl
                  bg-gradient-to-r from-sky-500 to-cyan-400 px-7 py-3.5 text-base font-bold text-white
                  shadow-xl shadow-sky-500/30 transition-all duration-300 hover:shadow-sky-500/50 hover:scale-105"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] skew-x-12
                  group-hover:translate-x-[150%] transition-transform duration-500" />
                🏙️ Citizen Portal
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10
                  px-7 py-3.5 text-base font-semibold text-purple-300
                  hover:bg-purple-500/20 hover:border-purple-400/60 transition-all duration-300 hover:scale-105"
              >
                🏛️ Admin / Government
              </Link>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up delay-400 flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-[#030712] flex items-center justify-center text-xs font-bold"
                    style={{ background: c }}>
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Trusted by 10,000+ citizens</p>
              </div>
            </div>
          </div>

          {/* Right: 3D Visual Globe / Status Widget */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in delay-300">
            {/* Outer orbit ring */}
            <div className="relative h-72 w-72 md:h-96 md:w-96">

              {/* Rotating ring 1 */}
              <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/10 animate-counter-spin" />
              <div className="absolute inset-12 rounded-full border border-purple-500/10 animate-spin-slow" style={{ animationDuration: '12s' }} />

              {/* Pulse rings from center */}
              <div className="absolute inset-[40%] flex items-center justify-center">
                <div className="absolute h-8 w-8 rounded-full bg-sky-500/30 animate-pulse-ring" />
                <div className="absolute h-8 w-8 rounded-full bg-sky-500/20 animate-pulse-ring delay-700" />
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl
                  bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-500/30
                  animate-float animate-glow-pulse shadow-2xl shadow-sky-500/20 backdrop-blur-sm">
                  <MapPin size={40} className="text-sky-400" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#030712] animate-blink" />
                </div>
              </div>

              {/* Orbiting feature chips */}
              {[
                { label: 'GPS Verified', color: 'sky', icon: '📍', angle: 0 },
                { label: 'Secure', color: 'emerald', icon: '🛡️', angle: 120 },
                { label: 'Real-time', color: 'purple', icon: '⚡', angle: 240 },
              ].map(({ label, color, icon, angle }) => {
                const rad = (angle - 90) * (Math.PI / 180)
                const r = 130
                const cx = 50 + (r / 3.84) * Math.cos(rad)
                const cy = 50 + (r / 3.84) * Math.sin(rad)
                return (
                  <div
                    key={label}
                    className="absolute flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold glass animate-float"
                    style={{
                      left: `${cx}%`,
                      top: `${cy}%`,
                      transform: 'translate(-50%,-50%)',
                      borderColor: color === 'sky' ? 'rgba(14,165,233,0.4)' : color === 'emerald' ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.4)',
                      color: color === 'sky' ? '#38bdf8' : color === 'emerald' ? '#34d399' : '#a78bfa',
                      animationDelay: `${angle / 120}s`,
                    }}
                  >
                    {icon} {label}
                  </div>
                )
              })}

              {/* Live report cards floating */}
              <div className="absolute -right-4 top-4 w-48 glass rounded-xl p-3 animate-float delay-200 shadow-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-blink" />
                  <span className="text-xs font-semibold text-emerald-400">Issue Resolved!</span>
                </div>
                <p className="text-xs text-slate-300">Pothole on MG Road</p>
                <p className="text-xs text-slate-500 mt-0.5">2 min ago · Visakhapatnam</p>
              </div>

              <div className="absolute -left-4 bottom-8 w-44 glass rounded-xl p-3 animate-float delay-500 shadow-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-2 w-2 rounded-full bg-sky-400 animate-blink" />
                  <span className="text-xs font-semibold text-sky-400">New Report</span>
                </div>
                <p className="text-xs text-slate-300">Street light broken</p>
                <p className="text-xs text-slate-500 mt-0.5">Just now · GPS ✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="relative z-10 py-10 border-y border-slate-800/60 glass">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '50K+', label: 'Issues Reported', color: '#0ea5e9' },
              { value: '94%', label: 'Resolution Rate', color: '#10b981' },
              { value: '48hrs', label: 'Avg. Resolve Time', color: '#f59e0b' },
              { value: '120+', label: 'City Zones Active', color: '#8b5cf6' },
            ].map(({ value, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center animate-fade-up">
                <span className="text-3xl font-black md:text-4xl" style={{ color }}>{value}</span>
                <span className="text-xs text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-14 text-center">
          <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple 3-Step Process</p>
          <h2 className="text-3xl font-black md:text-5xl">
            Report Issues in <span className="text-sky-400">Minutes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              icon: '📍',
              title: 'Enter Location',
              desc: 'Select your state, city, and pincode. We geocode it to find the exact coordinates on the map.',
              color: '#0ea5e9',
              glow: 'rgba(14,165,233,0.15)',
            },
            {
              step: '02',
              icon: '📸',
              title: 'Photograph the Issue',
              desc: 'Upload clear photos of the civic problem — potholes, flooded roads, broken lights, garbage dumps.',
              color: '#10b981',
              glow: 'rgba(16,185,129,0.15)',
            },
            {
              step: '03',
              icon: '🔔',
              title: 'Track Resolution',
              desc: 'Get real-time push notifications as your report moves: Submitted → Assigned → In Progress → Resolved.',
              color: '#8b5cf6',
              glow: 'rgba(139,92,246,0.15)',
            },
          ].map(({ step, icon, title, desc, color, glow }, i) => (
            <div
              key={step}
              className="card-3d relative rounded-2xl border border-slate-700/50 bg-slate-900/60 p-7 backdrop-blur-sm overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Glow bg */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${glow}, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-4xl">{icon}</span>
                  <span className="text-5xl font-black opacity-10" style={{ color }}>{step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>

                {/* Connector line (not on last) */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <ArrowRight size={20} className="text-slate-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative z-10 py-20" style={{ background: 'rgba(14,165,233,0.02)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Why CivicConnect</p>
            <h2 className="text-3xl font-black md:text-5xl">
              A Platform Built for <span className="text-emerald-400">Trust</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <MapPin className="text-sky-400" size={24} />,
                bg: 'from-sky-500/20 to-cyan-500/5   border-sky-500/20',
                title: 'GPS + Address Verification',
                desc: 'Geocoded address + optional device GPS ensures every report is tied to the exact real-world location.',
              },
              {
                icon: <Shield className="text-emerald-400" size={24} />,
                bg: 'from-emerald-500/20 to-green-500/5 border-emerald-500/20',
                title: 'Photo Evidence Required',
                desc: 'Mandatory photo uploads prevent fake reports and give field teams instant visual context.',
              },
              {
                icon: <Bell className="text-purple-400" size={24} />,
                bg: 'from-purple-500/20 to-violet-500/5  border-purple-500/20',
                title: 'Real-time Notifications',
                desc: 'Toast + push notifications keep citizens informed at every stage of the resolution lifecycle.',
              },
              {
                icon: <Zap className="text-amber-400" size={24} />,
                bg: 'from-amber-500/20 to-yellow-500/5  border-amber-500/20',
                title: 'Severity Classification',
                desc: 'Issues are tagged Low → Critical so government resources are dispatched by priority, not arrival order.',
              },
              {
                icon: <Users className="text-rose-400" size={24} />,
                bg: 'from-rose-500/20 to-pink-500/5   border-rose-500/20',
                title: 'Anonymous Reporting',
                desc: 'Citizens can report issues anonymously while the system still maintains internal accountability.',
              },
              {
                icon: <CheckCircle className="text-cyan-400" size={24} />,
                bg: 'from-cyan-500/20 to-sky-500/5    border-cyan-500/20',
                title: 'Admin Dashboard',
                desc: 'Powerful government portal with heatmaps, status management, and team assignment tools.',
              },
            ].map(({ icon, bg, title, desc }, i) => (
              <div
                key={title}
                className={`card-3d rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm ${bg} animate-fade-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/60 shadow-inner">
                  {icon}
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(16,185,129,0.1) 100%)',
            border: '1px solid rgba(14,165,233,0.2)',
          }}
        >
          {/* BG animation */}
          <div className="absolute inset-0 hex-grid opacity-30" />
          <div className="absolute top-0 left-0 h-full w-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.08), transparent 70%)' }} />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs text-sky-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-blink" />
              Join the Movement
            </div>
            <h2 className="text-3xl font-black md:text-5xl mb-5">
              Make Your City <span className="text-sky-400">Better Today</span>
            </h2>
            <p className="max-w-lg mx-auto text-slate-400 mb-8 leading-relaxed">
              Every unresolved pothole, broken streetlight, or overflowing drain starts with one citizen
              who cared enough to report it. Be that citizen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl
                  bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-base font-bold text-white
                  shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] skew-x-12
                  group-hover:translate-x-[150%] transition-transform duration-500" />
                🏙️ Report Your First Issue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/login"
                className="rounded-xl border border-slate-600 px-8 py-4 text-sm font-semibold text-slate-300
                  hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                Government Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 py-8 glass">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400">
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-sky-400">Civic</span>Connect
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © 2026 CivicConnect · Empowering citizens, building better cities
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-blink" />
              System Online
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}