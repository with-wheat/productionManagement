import { NextResponse } from 'next/server';
import { getQuestions, saveQuestions } from '@/lib/questions';
import type { Question } from '@/types/question';

export async function GET() {
  try {
    const questions = await getQuestions();
    return NextResponse.json(questions);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '获取题目失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Vercel 部署环境下不支持写入，请在本地修改后提交 data/questions.json' },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const questions = body.questions as Question[] | undefined;
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: '请提供 questions 数组' },
        { status: 400 }
      );
    }
    const normalized = questions.map((q) => ({
      id: q.id || `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: String(q.title ?? ''),
      options: Array.isArray(q.options) ? q.options : [],
      answer: String(q.answer ?? '').trim().toUpperCase().slice(0, 1),
      createdAt: q.createdAt || new Date().toISOString(),
    }));
    await saveQuestions(normalized);
    return NextResponse.json({ success: true, count: normalized.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '保存题目失败' },
      { status: 500 }
    );
  }
}
