export interface Question {
  id: string;
  title: string;
  options: string[];
  answer: string; // 正确答案，如 "A"、"B"、"1" 等
  createdAt?: string;
}

export interface QuizSession {
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, { selected: string; correct: boolean }>;
  startedAt: number;
}
