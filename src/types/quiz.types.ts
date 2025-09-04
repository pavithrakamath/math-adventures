export interface QuizState {
  currentQuestion: number;
  answers: Record<string, QuizAnswer>;
  showResults: boolean;
  timeRemaining?: number;
  isComplete: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[] | boolean;
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
  hintsUsed: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'drag-drop' | 'input' | 'visual-select' | 'true-false';
  options?: QuizOption[];
  correctAnswer: string | number | string[] | boolean;
  explanation: string;
  hint: string;
  visualization?: React.ComponentType<any>;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string | number;
  isCorrect?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  accuracy: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  feedback: string;
  recommendations: string[];
}

export interface QuizSettings {
  showHints: boolean;
  timeLimit: number | null;
  allowRetry: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}
