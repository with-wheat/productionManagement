'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@/types/question';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/* ---- Icons ---- */
function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4.5L12 9L7 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Progress Ring ---- */
function ProgressRing({ current, total }: { current: number; total: number }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-11 h-11">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} stroke="var(--muted)" strokeWidth="4" fill="none" />
        <circle
          cx="22" cy="22" r={r}
          stroke="var(--primary)" strokeWidth="4" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-primary">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

/* ---- Answer Feedback Banner ---- */
function AnswerFeedback({
  correct,
  correctAnswer,
}: {
  correct: boolean;
  correctAnswer: string;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3.5 flex items-start gap-3 animate-slide-up ${
        correct
          ? 'bg-success/10 border-2 border-success/30'
          : 'bg-destructive/10 border-2 border-destructive/30'
      }`}
    >
      <div
        className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          correct ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
        }`}
      >
        {correct ? <IconCheck size={16} /> : <IconX size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${correct ? 'text-success' : 'text-destructive'}`}>
          {correct ? '回答正确' : '回答错误'}
        </p>
        {!correct && (
          <p className="text-sm text-muted-foreground mt-0.5">
            正确答案是 <span className="font-bold text-success">{correctAnswer}</span>
          </p>
        )}
      </div>
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
  const correctCount = Object.values(answered).filter((a) => a.correct).length;

  useEffect(() => {
    if (!current) return;
    const info = answered[current.id];
    setSelected(info?.selected ?? null);
  }, [current, answered]);

  const getCorrectLabel = () => {
    const raw = current?.answer?.toUpperCase()?.trim() ?? '';
    // If answer is like "A", "B" etc., return it directly
    if (OPTION_LABELS.includes(raw.slice(0, 1))) return raw.slice(0, 1);
    return raw;
  };

  const handleSelect = (optionLabel: string) => {
    if (hasAnswered) return;
    setSelected(optionLabel);
    const correct =
      optionLabel.toUpperCase() ===
      (current.answer?.toUpperCase()?.slice(0, 1) ?? '');
    setAnswered((prev) => ({
      ...prev,
      [current.id]: { selected: optionLabel, correct },
    }));
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (isLast) {
      const wrongIds = list
        .filter((q) => answered[q.id] && !answered[q.id].correct)
        .map((q) => q.id);
      const correctTotal = list.filter((q) => answered[q.id]?.correct).length;
      router.push(
        `/result?total=${list.length}&correct=${correctTotal}&wrong=${wrongIds.join(',')}`
      );
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  /* ----------- Loading ----------- */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">加载题目中...</p>
        </div>
      </main>
    );
  }

  /* ----------- Error ----------- */
  if (error || !list.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="var(--destructive)" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="var(--destructive)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-destructive text-sm text-center">{error || '暂无题目'}</p>
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

  /* ----------- Main Quiz ----------- */
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth touch-manipulation rounded-md py-1 -ml-1 px-1"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4.5L6 9L11 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            退出
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground leading-tight">
                第 <span className="font-semibold text-foreground">{index + 1}</span> / {list.length} 题
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                正确 <span className="text-success font-medium">{correctCount}</span>
                {answeredCount - correctCount > 0 && (
                  <> &middot; 错误 <span className="text-destructive font-medium">{answeredCount - correctCount}</span></>
                )}
              </p>
            </div>
            <ProgressRing current={answeredCount} total={list.length} />
          </div>
        </div>

        {/* Full-width progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${list.length > 0 ? (answeredCount / list.length) * 100 : 0}%` }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-32">
        {/* Question number navigation */}
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
                  className={`flex items-center justify-center rounded-lg min-w-[34px] h-[34px] text-xs font-semibold shrink-0 touch-manipulation transition-smooth active:scale-95 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : isDone
                        ? isCorrect
                          ? 'bg-success/15 text-success ring-1 ring-success/30'
                          : 'bg-destructive/15 text-destructive ring-1 ring-destructive/30'
                        : 'bg-card text-muted-foreground ring-1 ring-border hover:ring-primary/40'
                  }`}
                >
                  {isDone && !isCurrent ? (
                    isCorrect ? <IconCheck size={13} /> : <IconX size={13} />
                  ) : (
                    i + 1
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden animate-fade-in">
          {/* Question header with number badge */}
          <div className="bg-primary/5 border-b border-primary/10 px-5 py-3 flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
              {index + 1}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {current.options.length === 2 ? '判断题' : '单选题'}
            </span>
          </div>

          {/* Question body */}
          <div className="px-5 py-5 sm:px-6">
            <h2 className="text-base sm:text-lg font-medium text-card-foreground whitespace-pre-wrap leading-relaxed mb-5">
              {current.title}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {current.options.map((opt, i) => {
                const label = OPTION_LABELS[i] ?? String(i + 1);
                const isChosen = selected === label;
                const correctLabel = getCorrectLabel();
                const isCorrectOption = correctLabel === label;
                const showResult = hasAnswered;
                const isWrong = showResult && isChosen && !isCorrectOption;
                const isRight = showResult && isCorrectOption;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelect(label)}
                    className={`group w-full text-left rounded-xl px-4 py-3.5 min-h-[52px] transition-all duration-200 touch-manipulation active:scale-[0.99] flex items-center gap-3.5 relative ${
                      showResult
                        ? isRight
                          ? 'bg-success/10 ring-2 ring-success shadow-[0_0_0_1px_rgba(16,185,129,0.1)]'
                          : isWrong
                            ? 'bg-destructive/10 ring-2 ring-destructive shadow-[0_0_0_1px_rgba(239,68,68,0.1)]'
                            : 'bg-muted/40 ring-1 ring-border/60 opacity-60'
                        : isChosen
                          ? 'bg-primary/8 ring-2 ring-primary shadow-sm'
                          : 'bg-muted/30 ring-1 ring-border hover:ring-primary/50 hover:bg-primary/5 active:bg-primary/8'
                    }`}
                  >
                    {/* Option label circle */}
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all duration-200 ${
                        showResult
                          ? isRight
                            ? 'bg-success text-success-foreground scale-110'
                            : isWrong
                              ? 'bg-destructive text-destructive-foreground scale-110'
                              : 'bg-muted text-muted-foreground'
                          : isChosen
                            ? 'bg-primary text-primary-foreground scale-105'
                            : 'bg-card text-muted-foreground ring-1 ring-border group-hover:ring-primary/40 group-hover:text-primary'
                      }`}
                    >
                      {showResult && isRight ? (
                        <IconCheck size={16} />
                      ) : showResult && isWrong ? (
                        <IconX size={16} />
                      ) : (
                        label
                      )}
                    </span>

                    {/* Option text */}
                    <span
                      className={`text-[15px] sm:text-base leading-relaxed flex-1 ${
                        showResult
                          ? isRight
                            ? 'text-foreground font-medium'
                            : isWrong
                              ? 'text-foreground line-through decoration-destructive/40'
                              : 'text-muted-foreground'
                          : isChosen
                            ? 'text-foreground font-medium'
                            : 'text-foreground/80'
                      }`}
                    >
                      {opt}
                    </span>

                    {/* Right-side status tag for answered state */}
                    {showResult && isRight && (
                      <span className="text-[11px] font-bold text-success bg-success/15 rounded-md px-2 py-0.5 shrink-0">
                        正确
                      </span>
                    )}
                    {showResult && isWrong && (
                      <span className="text-[11px] font-bold text-destructive bg-destructive/15 rounded-md px-2 py-0.5 shrink-0">
                        你的答案
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback banner after answering */}
            {hasAnswered && (
              <div className="mt-4">
                <AnswerFeedback
                  correct={answered[current.id].correct}
                  correctAnswer={getCorrectLabel()}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      {hasAnswered && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-2px_20px_rgba(0,0,0,0.06)] animate-slide-up"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
            {/* Left: Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-success">{correctCount}</span> 对
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-destructive">{answeredCount - correctCount}</span> 错
                </span>
              </div>
            </div>

            {/* Right: Next button */}
            <button
              onClick={handleNext}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 min-h-[44px] font-semibold text-primary-foreground active:bg-primary-hover touch-manipulation active:scale-[0.98] transition-smooth shadow-md shadow-primary/20"
            >
              {isLast ? '查看结果' : '下一题'}
              <IconArrowRight />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
