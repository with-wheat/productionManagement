'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/types/question';

const QUESTIONS_URL = '/questions.json';

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17.5 12.5V15.83C17.5 16.29 17.32 16.73 17 17.05C16.68 17.37 16.25 17.55 15.83 17.55H4.17C3.75 17.55 3.32 17.37 3 17.05C2.68 16.73 2.5 16.29 2.5 15.83V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.17 6.67L10 2.5L5.83 6.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 2.5V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.33 4V2.67C5.33 2.31 5.48 1.96 5.73 1.71C5.98 1.45 6.33 1.33 6.67 1.33H9.33C9.69 1.33 10.02 1.45 10.27 1.71C10.52 1.96 10.67 2.31 10.67 2.67V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.67 4V13.33C12.67 13.69 12.52 14.04 12.27 14.29C12.02 14.54 11.67 14.67 11.33 14.67H4.67C4.31 14.67 3.96 14.54 3.71 14.29C3.46 14.04 3.33 13.69 3.33 13.33V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [hasApi, setHasApi] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(QUESTIONS_URL);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetch('/api/questions').then((r) => setHasApi(r.ok)).catch(() => setHasApi(false));
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploadSuccess('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || '上传失败');
        return;
      }
      setUploadSuccess(`解析 ${data.parsed} 题，新增 ${data.added} 题，当前共 ${data.total} 题`);
      await load();
    } catch {
      setUploadError('上传失败');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该题？')) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (res.ok) await load();
    } catch {
      // ignore
    }
  };

  const filteredQuestions = searchTerm
    ? questions.filter((q) => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : questions;

  return (
    <main className="min-h-screen px-4 py-6 pb-12 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card hover:bg-muted active:bg-muted transition-smooth touch-manipulation shadow-sm"
              aria-label="返回首页"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">题库管理</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            共 {questions.length} 题
          </span>
        </div>

        {/* Upload Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="16" height="14" rx="2" stroke="var(--primary)" strokeWidth="1.5"/>
              <path d="M6 8H14M6 11H10" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Excel 导入</h2>
          </div>

          {hasApi === false && (
            <div className="flex items-start gap-3 rounded-lg bg-warning/10 border border-warning/20 p-4 mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
                <path d="M10 7V10M10 13H10.01" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="8" stroke="var(--warning)" strokeWidth="1.5"/>
              </svg>
              <p className="text-sm text-foreground leading-relaxed">
                当前为静态部署，题库为只读。如需更新题目，请在本地运行{' '}
                <code className="rounded-sm bg-warning/15 px-1.5 py-0.5 text-xs font-mono">npm run import-excel &quot;你的Excel.xlsx&quot;</code>{' '}
                后重新构建并部署。
              </p>
            </div>
          )}

          {hasApi !== false && (
            <>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                支持 .xlsx 格式，表头需包含：题干、A/B/C/D（或选项A等）、答案。单文件不超过 5MB。
              </p>
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-5 py-4 min-h-[48px] cursor-pointer hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10 transition-smooth touch-manipulation">
                <input
                  type="file"
                  accept=".xlsx"
                  className="sr-only"
                  disabled={uploading}
                  onChange={onFileChange}
                />
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-muted-foreground">上传中...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <span className="text-sm font-medium text-foreground">选择 Excel 文件</span>
                  </>
                )}
              </label>
              {uploadError && (
                <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 4.5V7.5M7 9.5H7.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="mt-3 flex items-center gap-2 text-success text-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4.5 7L6.5 9L9.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {uploadSuccess}
                </div>
              )}
            </>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">题目列表</h2>
          </div>

          {/* Search */}
          {questions.length > 0 && (
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="搜索题目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-smooth"
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              加载中...
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" stroke="var(--muted-foreground)" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">暂无题目，请先导入 Excel</p>
            </div>
          ) : (
            <>
              {searchTerm && (
                <p className="text-xs text-muted-foreground">
                  找到 {filteredQuestions.length} 个结果
                </p>
              )}
              <ul className="space-y-2.5">
                {filteredQuestions.map((q, idx) => (
                  <li
                    key={q.id}
                    className="group bg-card rounded-lg border border-border p-4 shadow-sm flex items-start gap-3 transition-smooth hover:shadow-md hover:border-primary/20"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground text-xs font-semibold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm sm:text-base leading-relaxed line-clamp-2">{q.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                          答案：{q.answer}
                        </span>
                      </div>
                    </div>
                    {hasApi && (
                      <button
                        type="button"
                        onClick={() => handleDelete(q.id)}
                        className="shrink-0 p-2 text-muted-foreground hover:text-destructive active:text-destructive transition-smooth rounded-md opacity-0 group-hover:opacity-100 touch-manipulation"
                        aria-label="删除此题"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
