import Link from 'next/link';

function ShieldIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="var(--primary)" fillOpacity="0.1" />
      <path
        d="M24 12L14 17V23C14 29.63 18.27 35.82 24 37C29.73 35.82 34 29.63 34 23V17L24 12Z"
        fill="var(--primary)"
        fillOpacity="0.2"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 24L23 27L28 21"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.1667 12.5C16.0557 12.7513 16.0226 13.0302 16.0716 13.3005C16.1206 13.5708 16.2495 13.8203 16.4417 14.0167L16.4917 14.0667C16.6466 14.2215 16.7695 14.4053 16.8534 14.6076C16.9373 14.8099 16.9805 15.0268 16.9805 15.2458C16.9805 15.4649 16.9373 15.6817 16.8534 15.884C16.7695 16.0864 16.6466 16.2702 16.4917 16.425C16.3369 16.5799 16.1531 16.7028 15.9507 16.7867C15.7484 16.8706 15.5316 16.9138 15.3125 16.9138C15.0934 16.9138 14.8766 16.8706 14.6743 16.7867C14.472 16.7028 14.2881 16.5799 14.1333 16.425L14.0833 16.375C13.887 16.1828 13.6374 16.054 13.3671 16.005C13.0968 15.956 12.818 15.989 12.5667 16.1C12.3202 16.2056 12.1124 16.3831 11.97 16.6097C11.8276 16.8363 11.7572 17.1016 11.7667 17.37V17.5C11.7667 17.942 11.5911 18.3659 11.2785 18.6785C10.9659 18.9911 10.542 19.1667 10.1 19.1667C9.65797 19.1667 9.23405 18.9911 8.92149 18.6785C8.60893 18.3659 8.43333 17.942 8.43333 17.5V17.4333C8.41838 17.1573 8.33528 16.8898 8.18267 16.6617C8.03006 16.4336 7.81369 16.254 7.56 16.145C7.30868 16.034 7.02986 16.001 6.75959 16.05C6.48932 16.099 6.23969 16.2278 6.04333 16.42L5.99333 16.47C5.83854 16.6249 5.65475 16.7478 5.45241 16.8317C5.25007 16.9156 5.03324 16.9588 4.81417 16.9588C4.59509 16.9588 4.37826 16.9156 4.17592 16.8317C3.97358 16.7478 3.78979 16.6249 3.635 16.47C3.4801 16.3152 3.35721 16.1314 3.27332 15.929C3.18943 15.7267 3.14625 15.5099 3.14625 15.2908C3.14625 15.0717 3.18943 14.8549 3.27332 14.6526C3.35721 14.4502 3.4801 14.2664 3.635 14.1117L3.685 14.0617C3.87718 13.8653 4.00601 13.6157 4.05502 13.3455C4.10402 13.0752 4.07098 12.7963 3.96 12.545C3.85441 12.2985 3.67687 12.0907 3.4503 11.9483C3.22374 11.8059 2.95838 11.7356 2.69 11.745H2.56C2.11797 11.745 1.69405 11.5694 1.38149 11.2569C1.06893 10.9443 0.893333 10.5204 0.893333 10.0783C0.893333 9.63631 1.06893 9.21239 1.38149 8.89983C1.69405 8.58727 2.11797 8.41167 2.56 8.41167H2.62667C2.90274 8.39672 3.17016 8.31362 3.39828 8.161C3.6264 8.00839 3.80601 7.79203 3.915 7.53833C4.02598 7.28701 4.05902 7.0082 4.01002 6.73792C3.96102 6.46765 3.83218 6.21803 3.64 6.02167L3.59 5.97167C3.4351 5.81687 3.31221 5.63309 3.22832 5.43074C3.14443 5.2284 3.10125 5.01158 3.10125 4.7925C3.10125 4.57342 3.14443 4.3566 3.22832 4.15426C3.31221 3.95191 3.4351 3.76813 3.59 3.61333C3.74479 3.45844 3.92858 3.33554 4.13092 3.25165C4.33326 3.16776 4.55009 3.12458 4.76917 3.12458C4.98824 3.12458 5.20507 3.16776 5.40741 3.25165C5.60975 3.33554 5.79354 3.45844 5.94833 3.61333L5.99833 3.66333C6.19469 3.85552 6.44432 3.98435 6.71459 4.03335C6.98486 4.08236 7.26368 4.04932 7.515 3.93833H7.56C7.80651 3.83274 8.01421 3.6552 8.15661 3.42864C8.29902 3.20207 8.36934 2.93672 8.36 2.66833V2.5C8.36 2.05797 8.5356 1.63405 8.84816 1.32149C9.16072 1.00893 9.58464 0.833333 10.0267 0.833333C10.4687 0.833333 10.8926 1.00893 11.2052 1.32149C11.5177 1.63405 11.6933 2.05797 11.6933 2.5V2.56667C11.684 2.83505 11.7543 3.1004 11.8967 3.32697C12.0391 3.55354 12.2468 3.73107 12.4933 3.83667C12.7447 3.94765 13.0235 3.98069 13.2937 3.93169C13.564 3.88268 13.8136 3.75385 14.01 3.56167L14.06 3.51167C14.2148 3.35677 14.3985 3.23388 14.6009 3.14999C14.8032 3.0661 15.0201 3.02292 15.2391 3.02292C15.4582 3.02292 15.675 3.0661 15.8774 3.14999C16.0797 3.23388 16.2635 3.35677 16.4183 3.51167C16.5732 3.66646 16.6961 3.85025 16.78 4.05259C16.8639 4.25493 16.9071 4.47176 16.9071 4.69083C16.9071 4.90991 16.8639 5.12674 16.78 5.32908C16.6961 5.53142 16.5732 5.71521 16.4183 5.87L16.3683 5.92C16.1762 6.11636 16.0473 6.36599 15.9983 6.63625C15.9493 6.90652 15.9824 7.18534 16.0933 7.43667V7.48333C16.1989 7.72985 16.3765 7.93754 16.603 8.07995C16.8296 8.22235 17.0949 8.29267 17.3633 8.28333H17.5C17.942 8.28333 18.3659 8.45893 18.6785 8.77149C18.9911 9.08405 19.1667 9.50797 19.1667 9.95C19.1667 10.392 18.9911 10.8159 18.6785 11.1285C18.3659 11.4411 17.942 11.6167 17.5 11.6167H17.4333C17.165 11.6073 16.8996 11.6776 16.673 11.82C16.4465 11.9624 16.2689 12.1701 16.1633 12.4167L16.1667 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center animate-fade-in">
          <ShieldIcon />
        </div>

        {/* Title */}
        <div className="space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
            <span className="text-xs font-medium text-secondary-foreground">C1 认证备考</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance">
            机械类专职安全生产管理人员
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            顺序刷题，每题即时反馈，支持错题回顾，助你高效备考
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.33V14.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M1.33 8H14.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>题库覆盖</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4.67V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>即时反馈</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4.67 8L7 10.33L11.33 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>错题回顾</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full animate-fade-in">
          <Link
            href="/quiz"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 min-h-[52px] text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover active:bg-primary-hover transition-smooth touch-manipulation"
          >
            开始刷题
            <ArrowRight />
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-4 min-h-[52px] text-base font-medium text-card-foreground shadow-sm hover:bg-muted active:bg-muted transition-smooth touch-manipulation"
          >
            <SettingsIcon />
            题库管理
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-muted-foreground/60 animate-fade-in">
          支持移动端与桌面端访问
        </p>
      </div>
    </main>
  );
}
