'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@/types/question';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

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
      // 保持 Excel 中的原始顺序，不再打乱
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

  // 当切换题目时，根据已答记录恢复当前题的选中状态
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
        <p className="text-slate-600 text-sm sm:text-base">加载题目中...</p>
      </main>
    );
  }

  if (error || !list.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 gap-4">
        <p className="text-red-600 text-sm sm:text-base text-center">{error || '暂无题目'}</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="py-3 px-5 min-h-[48px] text-emerald-600 active:underline touch-manipulation"
        >
          返回首页
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 pb-28 sm:p-6 sm:pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
            <span>
              第 {index + 1} / {list.length} 题
            </span>
            <button
              onClick={() => router.push('/')}
              className="py-2 -my-2 px-2 text-slate-500 active:text-slate-700 touch-manipulation"
            >
              退出
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 mb-1">
            <span>点击题号可快速跳转</span>
            <span>
              已答 {answeredCount} / {list.length}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
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
                  className={`flex items-center justify-center rounded-full border min-w-[32px] h-8 text-xs font-medium shrink-0 touch-manipulation active:scale-[0.96] ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : isDone
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-medium text-slate-800 mb-4 sm:mb-6 whitespace-pre-wrap leading-snug">
            {current.title}
          </h2>
          <div className="space-y-2 sm:space-y-3">
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
                  className={`w-full text-left rounded-xl border-2 px-4 py-3.5 min-h-[48px] sm:min-h-0 transition touch-manipulation active:scale-[0.98] ${
                    showResult
                      ? isRight
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : isWrong
                          ? 'border-red-400 bg-red-50 text-red-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      : isChosen
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <span className="font-medium">{label}.</span>{' '}
                  <span className="text-[15px] sm:text-base">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasAnswered && (
          <div
            className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-2xl mx-auto flex justify-between items-center gap-3">
              <span className="text-slate-600 text-sm sm:text-base truncate">
                {answered[current.id]?.correct ? '回答正确' : '回答错误'}
              </span>
              <button
                onClick={handleNext}
                className="shrink-0 rounded-xl bg-emerald-600 px-6 py-3.5 min-h-[48px] font-medium text-white active:bg-emerald-700 touch-manipulation active:scale-[0.98]"
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
