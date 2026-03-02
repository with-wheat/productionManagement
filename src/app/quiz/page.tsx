'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="10.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---- Progress Ring ---- */
function ProgressRing({ current, total }: { current: number; total: number }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} stroke="var(--muted)" strokeWidth="3.5" fill="none" />
        <circle
          cx="20" cy="20" r={r}
          stroke="var(--primary)" strokeWidth="3.5" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-primary">
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
      className={`rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-up ${
        correct
          ? 'bg-[#22c55e]/10 border-2 border-[#22c55e]/40'
          : 'bg-[#ef4444]/10 border-2 border-[#ef4444]/40'
      }`}
    >
      <div
        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          correct ? 'bg-[#22c55e] text-[#fff]' : 'bg-[#ef4444] text-[#fff]'
        }`}
      >
        {correct ? <IconCheck size={14} /> : <IconX size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${correct ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {correct ? '回答正确！' : '回答错误'}
        </p>
        {!correct && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {'正确答案是 '}
            <span className="font-bold text-[#16a34a] bg-[#22c55e]/15 px-1.5 py-0.5 rounded">
              {correctAnswer}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---- Question Number Grid ---- */
function QuestionGrid({
  list,
  index,
  answered,
  onSelect,
}: {
  list: Question[];
  index: number;
  answered: Record<string, { selected: string; correct: boolean }>;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {list.map((q, i) => {
        const info = answered[q.id];
        const isCurrent = i === index;
        const isDone = !!info;
        const isCorrect = info?.correct;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex items-center justify-center rounded-md aspect-square text-[11px] font-bold touch-manipulation transition-all duration-150 active:scale-95 ${
              isCurrent
                ? isDone
                  ? isCorrect
                    ? 'bg-[#22c55e] text-[#fff] shadow-sm shadow-[#22c55e]/30 ring-2 ring-[#22c55e]'
                    : 'bg-[#ef4444] text-[#fff] shadow-sm shadow-[#ef4444]/30 ring-2 ring-[#ef4444]'
                  : 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 ring-2 ring-primary'
                : isDone
                  ? isCorrect
                    ? 'bg-[#22c55e]/10 text-[#16a34a] font-extrabold ring-2 ring-[#22c55e]'
                    : 'bg-[#ef4444]/10 text-[#dc2626] font-extrabold ring-2 ring-[#ef4444]'
                  : 'bg-card text-muted-foreground ring-1 ring-border hover:ring-primary/40 hover:bg-primary/5'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [list, setList] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<
    Record<string, { selected: string; correct: boolean }>
  >({});
  const [showNav, setShowNav] = useState(false);

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
  const wrongCount = answeredCount - correctCount;

  useEffect(() => {
    if (!current) return;
    const info = answered[current.id];
    setSelected(info?.selected ?? null);
  }, [current, answered]);

  // Scroll content area to top when question changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  const getCorrectLabel = () => {
    const raw = current?.answer?.toUpperCase()?.trim() ?? '';
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

  const handleNavSelect = (i: number) => {
    setIndex(i);
    setShowNav(false);
  };

  /* ----------- Loading ----------- */
  if (loading) {
    return (
      <main className="h-dvh flex items-center justify-center px-4">
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
      <main className="h-dvh flex flex-col items-center justify-center px-4 gap-4">
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

  /* ----------- Main Quiz (full viewport, no page scroll) ----------- */
  return (
    <main className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* ===== Top bar (fixed height) ===== */}
      <header className="shrink-0 bg-card border-b border-border z-30">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
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
            {/* Mobile nav toggle */}
            <button
              onClick={() => setShowNav(!showNav)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth touch-manipulation rounded-lg py-1.5 px-2.5 bg-muted/50 ring-1 ring-border"
            >
              <IconGrid />
              <span className="text-xs font-medium">题号</span>
            </button>

            <div className="text-right">
              <p className="text-xs text-muted-foreground leading-tight">
                {'第 '}
                <span className="font-semibold text-foreground">{index + 1}</span>
                {' / '}
                {list.length}
                {' 题'}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                {'对 '}
                <span className="text-[#16a34a] font-semibold">{correctCount}</span>
                {' / 错 '}
                <span className="text-[#dc2626] font-semibold">{wrongCount}</span>
              </p>
            </div>
            <ProgressRing current={answeredCount} total={list.length} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${list.length > 0 ? (answeredCount / list.length) * 100 : 0}%` }}
          />
        </div>
      </header>

      {/* Mobile nav panel (overlay) */}
      {showNav && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowNav(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-lg animate-slide-up">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">题目导航</h3>
              <button
                onClick={() => setShowNav(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <IconX size={18} />
              </button>
            </div>
            <div className="px-4 pb-2 flex gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> 当前
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm ring-2 ring-[#22c55e] bg-[#22c55e]/10" /> 正确
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm ring-2 ring-[#ef4444] bg-[#ef4444]/10" /> 错误
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-border bg-card" /> 未做
              </span>
            </div>
            <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
              <QuestionGrid list={list} index={index} answered={answered} onSelect={handleNavSelect} />
            </div>
          </div>
        </>
      )}

      {/* ===== Content area (fills remaining height) ===== */}
      <div className="flex-1 flex min-h-0 max-w-6xl mx-auto w-full">
        {/* Left sidebar - question nav (desktop) */}
        <aside className="hidden lg:flex flex-col w-[200px] shrink-0 border-r border-border bg-card/50">
          {/* Sidebar header */}
          <div className="shrink-0 px-3 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground">题目导航</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {'共 '}{list.length}{' 题，已答 '}{answeredCount}{' 题'}
            </p>
          </div>

          {/* Legend */}
          <div className="shrink-0 px-3 py-2 flex flex-wrap gap-x-3 gap-y-1 border-b border-border text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-primary" /> 当前
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm ring-1.5 ring-[#22c55e] bg-[#22c55e]/10" /> 正确
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm ring-1.5 ring-[#ef4444] bg-[#ef4444]/10" /> 错误
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm ring-1 ring-border bg-card" /> 未做
            </span>
          </div>

          {/* Grid (scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 quiz-nav-scroll">
            <QuestionGrid list={list} index={index} answered={answered} onSelect={setIndex} />
          </div>

          {/* Stats footer */}
          <div className="shrink-0 px-3 py-2.5 border-t border-border bg-muted/30 flex justify-between text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-muted-foreground"><span className="font-bold text-[#16a34a]">{correctCount}</span> 对</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              <span className="text-muted-foreground"><span className="font-bold text-[#dc2626]">{wrongCount}</span> 错</span>
            </span>
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">{list.length - answeredCount}</span> 剩余
            </span>
          </div>
        </aside>

        {/* Right: Question content (scrollable) */}
        <div ref={contentRef} className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Question card */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden animate-fade-in max-w-2xl mx-auto" key={current.id}>
              {/* Question header */}
              <div className="bg-primary/5 border-b border-primary/10 px-4 py-3 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground font-medium">
                    {current.options.length === 2 ? '判断题' : '单选题'}
                  </span>
                </div>
                {hasAnswered && (
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      answered[current.id].correct
                        ? 'bg-[#22c55e]/15 text-[#16a34a]'
                        : 'bg-[#ef4444]/15 text-[#dc2626]'
                    }`}
                  >
                    {answered[current.id].correct ? '已答对' : '已答错'}
                  </span>
                )}
              </div>

              {/* Question body */}
              <div className="px-4 py-5 lg:px-6">
                <h2 className="text-base lg:text-lg font-medium text-card-foreground whitespace-pre-wrap leading-relaxed text-pretty mb-5">
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
                        className={`group w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200 touch-manipulation active:scale-[0.99] flex items-center gap-3.5 relative ${
                          showResult
                            ? isRight
                              ? 'bg-[#22c55e]/8 ring-2 ring-[#22c55e] shadow-sm shadow-[#22c55e]/10'
                              : isWrong
                                ? 'bg-[#ef4444]/8 ring-2 ring-[#ef4444] shadow-sm shadow-[#ef4444]/10'
                                : 'bg-muted/30 ring-1 ring-border/50 opacity-50'
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
                                ? 'bg-[#22c55e] text-[#fff] scale-110'
                                : isWrong
                                  ? 'bg-[#ef4444] text-[#fff] scale-110'
                                  : 'bg-muted text-muted-foreground'
                              : isChosen
                                ? 'bg-primary text-primary-foreground scale-105'
                                : 'bg-card text-muted-foreground ring-1 ring-border group-hover:ring-primary/40 group-hover:text-primary'
                          }`}
                        >
                          {showResult && isRight ? (
                            <IconCheck size={14} />
                          ) : showResult && isWrong ? (
                            <IconX size={14} />
                          ) : (
                            label
                          )}
                        </span>

                        {/* Option text */}
                        <span
                          className={`text-sm lg:text-base leading-relaxed flex-1 ${
                            showResult
                              ? isRight
                                ? 'text-[#16a34a] font-semibold'
                                : isWrong
                                  ? 'text-[#dc2626] font-medium'
                                  : 'text-muted-foreground'
                              : isChosen
                                ? 'text-foreground font-medium'
                                : 'text-foreground/80'
                          }`}
                        >
                          {opt}
                        </span>

                        {/* Right-side status tag */}
                        {showResult && isRight && (
                          <span className="text-[11px] font-bold text-[#fff] bg-[#22c55e] rounded-full px-2 py-0.5 shrink-0">
                            正确答案
                          </span>
                        )}
                        {showResult && isWrong && (
                          <span className="text-[11px] font-bold text-[#fff] bg-[#ef4444] rounded-full px-2 py-0.5 shrink-0">
                            你的选择
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback banner */}
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

          {/* Bottom action bar (inside flow, not fixed) */}
          <div
            className={`shrink-0 border-t border-border bg-card/95 backdrop-blur-md transition-all duration-200 ${
              hasAnswered ? 'py-3' : 'py-0 h-0 overflow-hidden border-t-0'
            }`}
          >
            {hasAnswered && (
              <div className="max-w-2xl mx-auto px-4 flex justify-between items-center gap-4">
                {/* Left: Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span className="text-muted-foreground text-xs">
                      <span className="font-semibold text-[#16a34a]">{correctCount}</span> 对
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                    <span className="text-muted-foreground text-xs">
                      <span className="font-semibold text-[#dc2626]">{wrongCount}</span> 错
                    </span>
                  </div>
                </div>

                {/* Right: Next button */}
                <button
                  onClick={handleNext}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground active:bg-primary-hover touch-manipulation active:scale-[0.98] transition-smooth shadow-md shadow-primary/20 text-sm"
                >
                  {isLast ? '查看结果' : '下一题'}
                  <IconArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
