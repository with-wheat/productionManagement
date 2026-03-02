import Link from 'next/link';

/* ---- Decorative background pattern ---- */
function BgPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-right circle */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/[0.04]" />
      {/* Bottom-left circle */}
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/[0.03]" />
      {/* Grid dots */}
      <svg className="absolute top-8 left-8 opacity-[0.06]" width="80" height="80" viewBox="0 0 80 80">
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={10 + (i % 4) * 20} cy={10 + Math.floor(i / 4) * 20} r="1.5" fill="var(--primary)" />
        ))}
      </svg>
      <svg className="absolute bottom-12 right-10 opacity-[0.05]" width="60" height="60" viewBox="0 0 60 60">
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx={10 + (i % 3) * 20} cy={10 + Math.floor(i / 3) * 20} r="1.5" fill="var(--primary)" />
        ))}
      </svg>
    </div>
  );
}

/* ---- Shield illustration (compact) ---- */
function ShieldIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M28 6L10 16V28C10 40 17.5 50 28 53C38.5 50 46 40 46 28V16L28 6Z" fill="var(--primary)" fillOpacity="0.1" stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="11" fill="var(--primary)" fillOpacity="0.15" />
      <path d="M23 28L26.5 31.5L33.5 24.5" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Module card illustrations ---- */
function QuizIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
      {/* Paper stack */}
      <rect x="18" y="14" width="36" height="44" rx="6" fill="var(--primary)" fillOpacity="0.08" stroke="var(--primary)" strokeWidth="1.5" />
      <rect x="22" y="10" width="36" height="44" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" />
      {/* Lines */}
      <line x1="28" y1="24" x2="48" y2="24" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      <line x1="28" y1="31" x2="44" y2="31" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="28" y1="38" x2="40" y2="38" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.25" />
      {/* Check circle */}
      <circle cx="49" cy="44" r="10" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M44.5 44L47.5 47L53.5 41" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
      {/* Gear outer */}
      <circle cx="36" cy="36" r="18" fill="var(--muted)" stroke="var(--border)" strokeWidth="1.5" />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="33.5"
          y="15"
          width="5"
          height="8"
          rx="2"
          fill="var(--muted-foreground)"
          fillOpacity="0.2"
          transform={`rotate(${deg} 36 36)`}
        />
      ))}
      {/* Inner circle */}
      <circle cx="36" cy="36" r="10" fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Wrench */}
      <path d="M32 36L36 32L40 36L36 40Z" fill="var(--muted-foreground)" fillOpacity="0.2" />
      <circle cx="36" cy="36" r="3" fill="var(--muted-foreground)" fillOpacity="0.15" stroke="var(--muted-foreground)" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M7 4.5L11.5 9L7 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Stats row ---- */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="h-dvh flex flex-col bg-background relative overflow-hidden">
      <BgPattern />

      {/* Top section - branding */}
      <header className="relative z-10 flex flex-col items-center pt-8 sm:pt-12 pb-4 px-4 shrink-0">
        <div className="animate-fade-in">
          <ShieldIcon />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground text-center text-balance mt-3 animate-fade-in">
          机械类专职安全生产管理人员
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1.5 animate-fade-in">
          C1 认证备考刷题系统
        </p>

        {/* Mini stats */}
        <div className="flex items-center gap-6 mt-5 animate-fade-in">
          <StatBadge value="500+" label="精选题库" />
          <div className="w-px h-6 bg-border" />
          <StatBadge value="C1" label="专项认证" />
          <div className="w-px h-6 bg-border" />
          <StatBadge value="100%" label="考点覆盖" />
        </div>
      </header>

      {/* Center section - two module cards */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-4 py-4">
        {/* Quiz module card */}
        <Link
          href="/quiz"
          className="group w-full max-w-md bg-card rounded-2xl border border-border p-5 flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250 touch-manipulation"
        >
          <QuizIllustration />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors duration-200">
              开始刷题
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              按顺序逐题练习，答对自动跳转，答错详细解析
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                顺序模式
              </span>
              <span className="inline-flex items-center rounded-full bg-[#22c55e]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                即时反馈
              </span>
            </div>
          </div>
          <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        </Link>

        {/* Admin module card */}
        <Link
          href="/admin"
          className="group w-full max-w-md bg-card rounded-2xl border border-border p-5 flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-muted-foreground/20 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250 touch-manipulation"
        >
          <AdminIllustration />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-card-foreground group-hover:text-muted-foreground transition-colors duration-200">
              题库管理
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              导入、编辑和管理题库内容，支持 JSON 批量操作
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                批量导入
              </span>
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                在线编辑
              </span>
            </div>
          </div>
          <ArrowRight className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        </Link>
      </section>

      {/* Bottom tagline */}
      <footer className="relative z-10 pb-6 sm:pb-8 text-center shrink-0 px-4">
        <p className="text-[11px] text-muted-foreground/40">
          支持移动端与桌面端 / 数据本地存储
        </p>
      </footer>
    </main>
  );
}
