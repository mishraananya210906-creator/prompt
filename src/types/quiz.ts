export type QuestionDifficulty = 'easy' | 'medium' | 'challenging';

export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string]; // Exactly 4 options: A, B, C, D
  correctAnswer: number; // 0, 1, 2, 3 index
  explanation: string;
  topic: string;
  difficulty: QuestionDifficulty;
}

export interface QuizPayload {
  title: string;
  documentSummary: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  answers: Record<number, number>; // questionId -> selectedOptionIndex
}

export interface WeakTopic {
  topic: string;
  count: number;
  explanationSummary: string;
  relatedQuestions: number[];
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  feedbackMessage: string;
  weakTopics: WeakTopic[];
  questionReviews: {
    question: QuizQuestion;
    selectedAnswer: number | null;
    isCorrect: boolean;
  }[];
}
