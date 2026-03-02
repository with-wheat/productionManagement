import type { Question } from '@/types/question';
import * as XLSX from 'xlsx';

const ALLOWED_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * 校验上传文件：仅允许 .xlsx，且限制大小
 */
export function validateExcelFile(file: File): { ok: boolean; error?: string } {
  const isXlsx =
    file.name.toLowerCase().endsWith('.xlsx') ||
    file.type === ALLOWED_MIME;
  if (!isXlsx)
    return { ok: false, error: '仅支持 .xlsx 格式的 Excel 文件' };
  if (file.size > MAX_SIZE)
    return { ok: false, error: '文件大小不能超过 5MB' };
  return { ok: true };
}

/**
 * 从 Excel 二进制解析题目
 * 约定：第一行为表头，支持列名：题干/题目/题目内容、A/B/C/D 或 选项A 等、答案/正确答案
 */
export function parseExcelToQuestions(buffer: ArrayBuffer): Question[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
    defval: '',
  }) as unknown[][];

  if (!rows.length) return [];

  const header = (rows[0] as string[]).map((h) => String(h ?? '').trim());
  const titleCol = findColumn(header, ['题干', '题目', '题目内容', '题目内容']);
  const optionCols = [
    findColumn(header, ['A', '选项A', '选项a']),
    findColumn(header, ['B', '选项B', '选项b']),
    findColumn(header, ['C', '选项C', '选项c']),
    findColumn(header, ['D', '选项D', '选项d']),
  ].filter((i) => i >= 0) as number[];
  const answerCol = findColumn(header, ['答案', '正确答案', '正确选项']);

  if (titleCol < 0 || answerCol < 0) return [];

  const questions: Question[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const title = String(row[titleCol] ?? '').trim();
    if (!title) continue;

    const options: string[] = [];
    for (const col of optionCols) {
      const val = String(row[col] ?? '').trim();
      if (val) options.push(val);
    }
    const answer = normalizeAnswer(String(row[answerCol] ?? '').trim());

    questions.push({
      id: `excel-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title,
      options,
      answer,
      createdAt: new Date().toISOString(),
    });
  }
  return questions;
}

function findColumn(header: string[], names: string[]): number {
  for (const name of names) {
    const i = header.findIndex(
      (h) => h === name || h?.toLowerCase() === name?.toLowerCase()
    );
    if (i >= 0) return i;
  }
  return -1;
}

function normalizeAnswer(s: string): string {
  s = s.replace(/\s/g, '').toUpperCase();
  if (/^[A-D]$/.test(s)) return s;
  if (/^[1-4]$/.test(s)) return String.fromCharCode(64 + parseInt(s, 10));
  return s;
}
