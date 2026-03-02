'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/types/question';

const QUESTIONS_URL = '/questions.json';

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [hasApi, setHasApi] = useState<boolean | null>(null);

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

  return (
    <main className="min-h-screen px-4 py-6 pb-12 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">题库管理</h1>
          <Link
            href="/"
            className="shrink-0 py-2 px-2 text-slate-600 hover:text-slate-800 active:text-slate-800 touch-manipulation"
          >
            返回首页
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-medium text-slate-800 mb-3">Excel 导入</h2>
          {hasApi === false && (
            <p className="text-amber-600 text-sm mb-3 bg-amber-50 rounded-lg p-3">
              当前为静态部署（Gitee Pages），题库为只读。如需更新题目，请在本地运行 <code className="bg-amber-100 px-1 rounded">npm run import-excel "你的Excel.xlsx"</code> 后重新构建并部署。
            </p>
          )}
          {hasApi !== false && (
            <>
              <p className="text-xs sm:text-sm text-slate-500 mb-3">
                支持 .xlsx，表头需包含：题干、A/B/C/D（或 选项A 等）、答案。单文件不超过 5MB。
              </p>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 min-h-[48px] cursor-pointer hover:bg-slate-50 active:bg-slate-100 touch-manipulation">
                <input
                  type="file"
                  accept=".xlsx"
                  className="sr-only"
                  disabled={uploading}
                  onChange={onFileChange}
                />
                {uploading ? '上传中...' : '选择 Excel 文件'}
              </label>
              {uploadError && (
                <p className="mt-2 text-red-600 text-sm">{uploadError}</p>
              )}
              {uploadSuccess && (
                <p className="mt-2 text-emerald-600 text-sm">{uploadSuccess}</p>
              )}
            </>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-medium text-slate-800 mb-3">
          题目列表（共 {questions.length} 题）
        </h2>
        {loading ? (
          <p className="text-slate-500 text-sm">加载中...</p>
        ) : questions.length === 0 ? (
          <p className="text-slate-500 text-sm">暂无题目，请先导入 Excel。</p>
        ) : (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex justify-between items-start gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-slate-800 font-medium text-sm sm:text-base line-clamp-2">{q.title}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">答案：{q.answer}</p>
                </div>
                {hasApi && (
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="shrink-0 py-2 px-3 min-h-[44px] flex items-center text-red-600 hover:text-red-700 active:text-red-800 text-sm touch-manipulation rounded-lg"
                  >
                    删除
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
