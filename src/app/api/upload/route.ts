import { NextResponse } from 'next/server';
import { parseExcelToQuestions, validateExcelFile } from '@/lib/excelParser';
import { appendQuestions } from '@/lib/questions';

export async function POST(request: Request) {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Vercel 部署环境下不支持上传，请在本地导入题目后提交 data/questions.json 到仓库' },
      { status: 503 }
    );
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: '请选择要上传的 Excel 文件' },
        { status: 400 }
      );
    }

    const validation = validateExcelFile(file);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const questions = parseExcelToQuestions(buffer);
    if (questions.length === 0) {
      return NextResponse.json(
        { error: '未能从 Excel 中解析出题目，请检查表头（题干、A/B/C/D、答案）' },
        { status: 400 }
      );
    }

    const { added, total } = await appendQuestions(questions);
    return NextResponse.json({
      success: true,
      parsed: questions.length,
      added,
      total,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '解析或保存失败' },
      { status: 500 }
    );
  }
}
