import type { Question } from '@/types/question';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getQuestions(): Promise<Question[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.questions ?? [];
  } catch {
    return [];
  }
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    QUESTIONS_FILE,
    JSON.stringify(questions, null, 2),
    'utf-8'
  );
}

export async function appendQuestions(newQuestions: Question[]): Promise<{ added: number; total: number }> {
  const existing = await getQuestions();
  const existingIds = new Set(existing.map((q) => q.id));
  let added = 0;
  for (const q of newQuestions) {
    if (!existingIds.has(q.id)) {
      existing.push(q);
      existingIds.add(q.id);
      added++;
    }
  }
  await saveQuestions(existing);
  return { added, total: existing.length };
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const questions = await getQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  if (filtered.length === questions.length) return false;
  await saveQuestions(filtered);
  return true;
}

export async function updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
  const questions = await getQuestions();
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return null;
  questions[index] = { ...questions[index], ...updates };
  await saveQuestions(questions);
  return questions[index];
}
