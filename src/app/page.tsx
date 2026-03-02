import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:p-6">
      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight px-1">
          机械类专职安全生产管理人员 (C1)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          随机顺序刷题，每题仅出现一次，即时反馈，支持错题回顾
        </p>
        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-4 min-h-[52px] text-lg font-medium text-white shadow-lg hover:bg-emerald-700 active:bg-emerald-700 transition touch-manipulation"
          >
            开始刷题
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 min-h-[52px] text-lg font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition touch-manipulation"
          >
            题库管理
          </Link>
        </div>
      </div>
    </main>
  );
}
