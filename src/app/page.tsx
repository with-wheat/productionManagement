import Link from 'next/link';

/* ---- Illustrations as SVG components ---- */

function HeroIllustration() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full max-w-[280px] h-auto">
      {/* Background shield shape */}
      <path d="M140 20L60 55V105C60 145 93 178 140 190C187 178 220 145 220 105V55L140 20Z" fill="var(--primary)" fillOpacity="0.08" stroke="var(--primary)" strokeWidth="2" strokeOpacity="0.15" />
      {/* Inner shield */}
      <path d="M140 40L80 67V107C80 138 105 164 140 174C175 164 200 138 200 107V67L140 40Z" fill="var(--primary)" fillOpacity="0.06" />
      {/* Checkmark circle */}
      <circle cx="140" cy="105" r="32" fill="var(--primary)" fillOpacity="0.12" />
      <circle cx="140" cy="105" r="24" fill="var(--primary)" fillOpacity="0.2" />
      <path d="M128 105L136 113L154 95" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Decorative dots */}
      <circle cx="90" cy="85" r="3" fill="var(--primary)" fillOpacity="0.2" />
      <circle cx="190" cy="85" r="3" fill="var(--primary)" fillOpacity="0.2" />
      <circle cx="105" cy="145" r="2.5" fill="var(--primary)" fillOpacity="0.15" />
      <circle cx="175" cy="145" r="2.5" fill="var(--primary)" fillOpacity="0.15" />
      <circle cx="70" cy="115" r="2" fill="var(--primary)" fillOpacity="0.1" />
      <circle cx="210" cy="115" r="2" fill="var(--primary)" fillOpacity="0.1" />
      {/* Small stars */}
      <path d="M230 45L232 50L237 50L233 53L234 58L230 55L226 58L227 53L223 50L228 50Z" fill="var(--primary)" fillOpacity="0.2" />
      <path d="M50 50L51.5 54L56 54L52.5 56.5L53.5 60.5L50 58L46.5 60.5L47.5 56.5L44 54L48.5 54Z" fill="var(--primary)" fillOpacity="0.15" />
    </svg>
  );
}

function QuizCardIllustration() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--primary)" fillOpacity="0.1" />
      {/* Clipboard */}
      <rect x="14" y="12" width="20" height="26" rx="3" stroke="var(--primary)" strokeWidth="1.8" />
      <rect x="18" y="9" width="12" height="6" rx="2" fill="var(--secondary)" stroke="var(--primary)" strokeWidth="1.5" />
      {/* Lines */}
      <line x1="18" y1="21" x2="30" y2="21" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="18" y1="26" x2="27" y2="26" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="18" y1="31" x2="24" y2="31" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Check */}
      <path d="M28 29L30 31L34 27" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeedbackIllustration() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#22c55e" fillOpacity="0.1" />
      {/* Lightning bolt */}
      <path d="M26 12L18 26H24L22 36L30 22H24L26 12Z" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReviewIllustration() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#f59e0b" fillOpacity="0.1" />
      {/* Refresh arrows */}
      <path d="M30 18A8 8 0 0 0 16 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 30A8 8 0 0 0 32 26" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 22L16 22L16 20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 26L32 26L32 28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3V5M10 15V17M3 10H5M15 10H17M5.05 5.05L6.46 6.46M13.54 13.54L14.95 14.95M14.95 5.05L13.54 6.46M6.46 13.54L5.05 14.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div className="max-w-lg w-full flex flex-col items-center">
          {/* Illustration */}
          <div className="animate-fade-in mb-6">
            <HeroIllustration />
          </div>

          {/* Badge */}
          <div className="animate-fade-in mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 ring-1 ring-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-secondary-foreground">C1 认证备考</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-center text-balance animate-fade-in mb-2">
            机械类专职安全生产管理人员
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base text-center leading-relaxed max-w-sm animate-fade-in mb-8">
            刷题备考，助你高效拿证
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs animate-fade-in mb-10">
            <Link
              href="/quiz"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:bg-primary-hover active:bg-primary-hover active:scale-[0.98] transition-all duration-200 touch-manipulation"
            >
              开始刷题
              <ArrowRight />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-base font-medium text-card-foreground shadow-sm hover:bg-muted active:bg-muted active:scale-[0.98] transition-all duration-200 touch-manipulation"
            >
              <SettingsIcon />
              题库管理
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 pb-10 sm:pb-14">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <QuizCardIllustration />
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">顺序刷题</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  按题库顺序逐题练习，覆盖全部考点
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 shadow-sm hover:shadow-md hover:border-[#22c55e]/20 transition-all duration-200">
              <FeedbackIllustration />
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">即时反馈</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  选对自动跳下一题，选错详细提示正确答案
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 shadow-sm hover:shadow-md hover:border-[#f59e0b]/20 transition-all duration-200">
              <ReviewIllustration />
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">错题回顾</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  自动统计错题，完成后一键查看复习
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          支持移动端与桌面端访问
        </p>
      </footer>
    </main>
  );
}
