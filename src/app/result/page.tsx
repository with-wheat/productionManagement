'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/types/question';

function ResultContent() {
  const searchParams = useSearchParams();
  const total = Number(searchParams.get('total')) || 0;
  const correct = Number(searchParams.get('correct')) || 0;
  const wrongIds = (searchParams.get('wrong') || '').split(',').filter(Boolean);

  const [wrongList, setWrongList] = useState<Question[]>([]);
  const [loading, setLoading] = useState(!!wrongIds.length);

  const loadWrong = useCallback(async () => {
    if (!wrongIds.length) return;
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) return;
      const all: Question[] = await res.json();
      const map = new Map(all.map((q) => [q.id, q]));
      setWrongList(wrongIds.map((id) => map.get(id)).filter(Boolean) as Question[]);
    } finally {
      setLoading(false);
    }
  }, [wrongIds.join(',')]);

  useEffect(() => {
    loadWrong();
  }, [loadWrong]);

  const rate = total ? Math.round((correct / total) * 100) : 0;

  return (
    <main className="min-h-screen px-4 py-6 pb-12 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">答题结果</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-50 min-h-[80px] flex flex-col justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">{correct}/{total}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">正确题数</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 min-h-[80px] flex flex-col justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{rate}%</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">正确率</div>
            </div>
          </div>
        </div>

        {wrongIds.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">错题回顾</h2>
            {loading ? (
              <p className="text-slate-500 text-sm">加载中...</p>
            ) : (
              <ul className="space-y-3 sm:space-y-4">
                {wrongList.map((q) => (
                  <li
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                  >
                    <p className="text-slate-800 font-medium mb-2 text-sm sm:text-base">{q.title}</p>
                    <p className="text-xs sm:text-sm text-emerald-600">
                      正确答案：{q.answer}
                      {q.options.length ? ` - ${q.options[['A','B','C','D'].indexOf(q.answer)] ?? q.options[0]}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/quiz"
            className="block text-center rounded-xl bg-emerald-600 px-6 py-4 min-h-[52px] flex items-center justify-center font-medium text-white hover:bg-emerald-700 active:bg-emerald-700 touch-manipulation"
          >
            再刷一遍
          </Link>
          <Link
            href="/"
            className="block text-center rounded-xl border border-slate-300 py-4 min-h-[52px] flex items-center justify-center font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-4 py-6">
        <p className="text-slate-500 text-sm sm:text-base">加载中...</p>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
