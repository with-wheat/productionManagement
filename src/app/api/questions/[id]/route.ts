import { NextResponse } from 'next/server';
import { updateQuestion, deleteQuestion } from '@/lib/questions';
import type { Question } from '@/types/question';

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Vercel 部署环境下不支持修改题库' },
      { status: 503 }
    );
  }
  try {
    const { id } = await params;
    const body = (await _request.json()) as Partial<Question>;
    const updated = await updateQuestion(id, {
      title: body.title,
      options: body.options,
      answer: body.answer,
    });
    if (!updated) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Vercel 部署环境下不支持删除题目' },
      { status: 503 }
    );
  }
  try {
    const { id } = await params;
    const ok = await deleteQuestion(id);
    if (!ok) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}
