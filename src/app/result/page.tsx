'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/types/question';

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? 'var(--success)' : percentage >= 60 ? 'var(--warning)' : 'var(--destructive)';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          className="transition-all duration-1000 ease-out"
          style={{ animation: 'progressGrow 1s ease-out forwards' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{percentage}%</span>
        <span className="text-xs text-muted-foreground">正确率</span>
      </div>
    </div>
  );
}

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
      const res = await fetch('/questions.json');
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
  const wrong = total - correct;
  const passed = rate >= 80;

  return (
    <main className="min-h-screen px-4 py-6 pb-12 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">答题结果</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            返回首页
          </Link>
        </div>

        {/* Score Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex flex-col items-center gap-5">
            <CircularProgress percentage={rate} />

            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
              passed
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {passed ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 4v4M8 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {passed ? '恭喜通过' : '继续加油'}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{total}</div>
                <div className="text-xs text-muted-foreground mt-0.5">总题数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{correct}</div>
                <div className="text-xs text-muted-foreground mt-0.5">正确</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{wrong}</div>
                <div className="text-xs text-muted-foreground mt-0.5">错误</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wrong Questions Review */}
        {wrongIds.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">错题回顾</h2>
              <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-medium px-2 py-0.5">
                {wrongIds.length} 题
              </span>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                加载中...
              </div>
            ) : (
              <ul className="space-y-3">
                {wrongList.map((q, idx) => (
                  <li
                    key={q.id}
                    className="bg-card rounded-xl border border-border p-4 shadow-sm transition-smooth hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10 text-destructive text-xs font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed mb-2">{q.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                              <path d="M2 5L4.5 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            正确答案：{q.answer}
                            {q.options.length ? ` - ${q.options[['A','B','C','D'].indexOf(q.answer)] ?? q.options[0]}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 animate-fade-in">
          <Link
            href="/quiz"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 min-h-[52px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover active:bg-primary-hover touch-manipulation transition-smooth"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3.33 10C3.33 6.32 6.32 3.33 10 3.33C13.68 3.33 16.67 6.32 16.67 10C16.67 13.68 13.68 16.67 10 16.67" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 6.67V10L12.5 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.33 13.33L5 16.67L8.33 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            再刷一遍
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg border border-border bg-card py-4 min-h-[52px] font-medium text-card-foreground shadow-sm hover:bg-muted active:bg-muted touch-manipulation transition-smooth"
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm sm:text-base">加载中...</p>
        </div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
