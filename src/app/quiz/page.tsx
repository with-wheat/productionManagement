'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@/types/question';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = total > 0 ? ((current) / total) * 100 : 0;
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [list, setList] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<
    Record<string, { selected: string; correct: boolean }>
  >({});

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/questions.json');
      if (!res.ok) throw new Error('加载题目失败');
      const data: Question[] = await res.json();
      if (!data.length) {
        setError('暂无题目，请先在「题库管理」中导入 Excel');
        setList([]);
        return;
      }
      setList(data);
      setIndex(0);
      setSelected(null);
      setAnswered({});
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const current = list[index];
  const isLast = index === list.length - 1;
  const hasAnswered = current && current.id in answered;
  const answeredCount = Object.keys(answered).length;

  useEffect(() => {
    if (!current) return;
    const info = answered[current.id];
    setSelected(info?.selected ?? null);
  }, [current, answered]);

  const handleSelect = (optionLabel: string) => {
    if (hasAnswered) return;
    setSelected(optionLabel);
    const correct = optionLabel.toUpperCase() === (current.answer?.toUpperCase()?.slice(0, 1) ?? '');
    setAnswered((prev) => ({
      ...prev,
      [current.id]: { selected: optionLabel, correct },
    }));
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (isLast) {
      const wrongIds = list.filter(
        (q) => answered[q.id] && !answered[q.id].correct
      ).map((q) => q.id);
      const correctCount = list.filter(
        (q) => answered[q.id]?.correct
      ).length;
      router.push(
        `/result?total=${list.length}&correct=${correctCount}&wrong=${wrongIds.join(',')}`
      );
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm sm:text-base">加载题目中...</p>
        </div>
      </main>
    );
  }

  if (error || !list.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="var(--destructive)" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="var(--destructive)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-destructive text-sm sm:text-base text-center">{error || '暂无题目'}</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="py-3 px-5 min-h-[48px] text-primary font-medium active:underline touch-manipulation"
        >
          返回首页
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 pb-28 sm:p-6 sm:pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {index + 1} / {list.length}
              </span>
              <span className="text-xs text-muted-foreground">
                已答 {answeredCount} 题
              </span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="py-2 -my-2 px-3 text-sm text-muted-foreground hover:text-foreground active:text-foreground transition-smooth touch-manipulation rounded-md"
            >
              退出
            </button>
          </div>
          <ProgressBar current={answeredCount} total={list.length} />
        </div>

        {/* Question Number Navigation */}
        <div className="mb-4">
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 quiz-nav-scroll">
            {list.map((q, i) => {
              const info = answered[q.id];
              const isCurrent = i === index;
              const isDone = !!info;
              const isCorrect = info?.correct;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`flex items-center justify-center rounded-md min-w-[32px] h-8 text-xs font-medium shrink-0 touch-manipulation transition-smooth active:scale-95 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : isDone
                        ? isCorrect
                          ? 'bg-success/15 text-success border border-success/30'
                          : 'bg-destructive/10 text-destructive border border-destructive/30'
                        : 'bg-card text-muted-foreground border border-border hover:border-primary/30'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 sm:p-6 mb-6 animate-fade-in">
          <h2 className="text-base sm:text-lg font-medium text-card-foreground mb-5 sm:mb-6 whitespace-pre-wrap leading-relaxed">
            {current.title}
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {current.options.map((opt, i) => {
              const label = OPTION_LABELS[i] ?? String(i + 1);
              const isChosen = selected === label;
              const correct = current.answer?.toUpperCase()?.slice(0, 1) === label;
              const showResult = hasAnswered;
              const isWrong = showResult && isChosen && !correct;
              const isRight = showResult && correct;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelect(label)}
                  className={`w-full text-left rounded-lg border-2 px-4 py-3.5 min-h-[48px] sm:min-h-0 transition-smooth touch-manipulation active:scale-[0.99] flex items-start gap-3 ${
                    showResult
                      ? isRight
                        ? 'border-success bg-success/5 text-foreground'
                        : isWrong
                          ? 'border-destructive bg-destructive/5 text-foreground'
                          : 'border-border bg-muted/50 text-muted-foreground'
                      : isChosen
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 mt-0.5 ${
                    showResult
                      ? isRight
                        ? 'bg-success text-success-foreground'
                        : isWrong
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-muted text-muted-foreground'
                      : isChosen
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {showResult && isRight ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : showResult && isWrong ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      label
                    )}
                  </span>
                  <span className="text-[15px] sm:text-base leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        {hasAnswered && (
          <div
            className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.05)] animate-slide-up"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-2xl mx-auto flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                {answered[current.id]?.correct ? (
                  <div className="flex items-center gap-2 text-success">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" fill="currentColor" fillOpacity="0.15"/>
                      <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium text-sm sm:text-base">回答正确</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" fill="currentColor" fillOpacity="0.15"/>
                      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="font-medium text-sm sm:text-base">回答错误</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleNext}
                className="shrink-0 rounded-lg bg-primary px-6 py-3 min-h-[44px] font-semibold text-primary-foreground active:bg-primary-hover touch-manipulation active:scale-[0.98] transition-smooth shadow-sm"
              >
                {isLast ? '查看结果' : '下一题'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
