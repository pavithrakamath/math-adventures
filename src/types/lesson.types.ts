export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  emoji: string;
  sections: LessonSection[];
  prerequisites?: string[];
  learningObjectives: string[];
}

export interface LessonSection {
  id: string;
  type: 'intro' | 'interactive' | 'practice' | 'assessment' | 'quiz';
  title: string;
  content: React.ComponentType<Record<string, unknown>> | string;
  props?: Record<string, unknown>;
  order: number;
}

export type InteractiveHint =
  | {
      type: 'factor-checker';
      number: number;
    }
  | {
      type: 'pattern-visualizer';
      sequence: number[];
      operation: 'add' | 'subtract' | 'multiply' | 'divide';
      value: number;
    }
  | {
      type: 'shape-visualizer';
      shape: 'rectangle' | 'square';
      width: number;
      height: number;
      calculation: 'perimeter' | 'area';
    }
  | {
      type: 'symmetry-visualizer';
      shape: 'square' | 'letter-r';
    }
  | {
      type: 'fraction-visualizer';
      fraction1: { numerator: number; denominator: number };
      fraction2: { numerator: number; denominator: number };
      operation: 'add' | 'subtract';
    }
  | {
      type: 'pattern-hint-visualizer';
      patternType: 'triangular' | 'square' | 'fibonacci' | 'arithmetic' | 'geometric' | 'custom';
      sequence: number[];
      customPattern?: string;
    }
  | {
      type: 'perimeter-visual';
      shape: 'rectangle' | 'square' | 'triangle' | 'polygon';
      dimensions: number[];
      unit?: string;
    };

export type Question =
  | {
      id: string;
      type: 'text' | 'number' | 'pictograph' | 'true-false' | 'input' | 'visual-select';
      text: string;
      answer: string | string[];
      correctAnswer?: string | string[];
      errorDescription: string;
      hint: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      explanation?: string;
      question?: string;
      visualization?: React.ComponentType<Record<string, unknown>>;
      interactiveHint?: never;
      data?: { name: string; value: number }[]; // For reference charts
      symbol?: string;
      scale?: number;
      title?: string;
      points?: number;
      options?: string[];
    }
  | {
      id: string;
      type: 'chart';
      component: 'BarChart';
      text: string;
      data: { name: string; value: number }[];
      question: string;
      answer: string | string[];
      correctAnswer?: string | string[];
      errorDescription: string;
      hint: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      explanation?: string;
      visualization?: React.ComponentType<Record<string, unknown>>;
      interactiveHint?: never;
      points?: number;
    }
  | {
      id: string;
      type: 'text' | 'number' | 'multiple-choice';
      text: string;
      options?: string[];
      answer: string | string[];
      correctAnswer?: string | string[];
      errorDescription: string;
      hint: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      explanation?: string;
      question?: string;
      visualization?: React.ComponentType<Record<string, unknown>>;
      interactiveHint: InteractiveHint;
      points?: number;
    }
  | {
      id: string;
      type: 'multiple-choice';
      text: string;
      options: string[];
      answer: string | string[];
      correctAnswer?: string | string[];
      errorDescription: string;
      hint: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      explanation?: string;
      question?: string;
      visualization?: React.ComponentType<Record<string, unknown>>;
      interactiveHint?: never;
      points?: number;
    };

export interface LessonProgress {
  lessonId: string;
  currentSection: number;
  completedSections: Set<number>;
  answers: Record<string, string | number | boolean | string[]>;
  score: number;
  timeSpent: number;
  isCompleted: boolean;
  lastAccessed: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserProgress {
  completedLessons: Set<string>;
  lessonProgress: Record<string, LessonProgress>;
  currentStreak: number;
  totalTimeSpent: number;
  achievements: string[];
  totalScore: number;
  lastActivity: Date;
}

export interface MathConcept {
  id: string;
  name: string;
  description: string;
  examples: string[];
  visualizations: React.ComponentType<Record<string, unknown>>[];
  relatedConcepts: string[];
}
