/**
 * 本地将 Excel 导入为 data/questions.json
 * 用法: node scripts/import-excel.mjs "路径/到/题目.xlsx"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const questionsPath = path.join(dataDir, 'questions.json');

function findColumn(header, names) {
  for (const name of names) {
    const i = header.findIndex(
      (h) => h === name || (h && h.toLowerCase() === name.toLowerCase())
    );
    if (i >= 0) return i;
  }
  return -1;
}

function normalizeAnswer(s) {
  s = String(s).replace(/\s/g, '').toUpperCase();
  if (/^[A-D]$/.test(s)) return s;
  if (/^[1-4]$/.test(s)) return String.fromCharCode(64 + parseInt(s, 10));
  return s;
}

function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
    defval: '',
  });

  if (!rows.length) return [];
  const header = rows[0].map((h) => String(h ?? '').trim());
  const titleCol = findColumn(header, ['题干', '题目', '题目内容']);
  const optionCols = [
    findColumn(header, ['A', '选项A', '选项a']),
    findColumn(header, ['B', '选项B', '选项b']),
    findColumn(header, ['C', '选项C', '选项c']),
    findColumn(header, ['D', '选项D', '选项d']),
  ].filter((i) => i >= 0);
  const answerCol = findColumn(header, ['答案', '正确答案', '正确选项']);

  if (titleCol < 0 || answerCol < 0) {
    console.error('未找到表头，需要包含：题干/题目、A/B/C/D、答案');
    process.exit(1);
  }

  const questions = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = String(row[titleCol] ?? '').trim();
    if (!title) continue;
    const options = optionCols.map((col) => String(row[col] ?? '').trim()).filter(Boolean);
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

const filePath = process.argv[2];
if (!filePath) {
  console.log('用法: node scripts/import-excel.mjs "路径/到/题目.xlsx"');
  process.exit(1);
}

const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
if (!fs.existsSync(absPath)) {
  console.error('文件不存在:', absPath);
  process.exit(1);
}

const buffer = fs.readFileSync(absPath);
const questions = parseExcel(buffer);
if (!questions.length) {
  console.error('未解析到任何题目');
  process.exit(1);
}

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  questionsPath,
  JSON.stringify(questions, null, 2),
  'utf-8'
);
console.log(`已导入 ${questions.length} 题到 ${questionsPath}`);
