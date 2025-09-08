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
  type: 'intro' | 'interactive' | 'practice' | 'assessment';
  title: string;
  content: React.ComponentType<Record<string, unknown>> | string;
  order: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'drag-drop' | 'input' | 'visual-select' | 'true-false';
  options?: string[];
  correctAnswer: string | number | string[] | boolean;
  explanation: string;
  hint: string;
  visualization?: React.ComponentType<Record<string, unknown>>;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

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
