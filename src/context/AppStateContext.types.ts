export interface AppState {
  progress: {
    completedLessons: Set<string>;
    lessonProgress: Record<string, LessonProgress>;
    currentStreak: number;
    totalTimeSpent: number;
    achievements: string[];
    totalScore: number;
    lastActivity: Date;
  };
  currentLesson: string | null;
  isLoading: boolean;
  error: string | null;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'es' | 'fr' | 'de';
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
  ui: {
    sidebarOpen: boolean;
    currentView: string;
  };
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
  mistakes: Mistake[];
}

export interface Mistake {
  question: string;
  errorDescription: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<AppState['progress']> }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string; score: number; timeSpent: number } }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: { lessonId: string; progress: Partial<LessonProgress> } }
  | { type: 'SET_CURRENT_LESSON'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'RESET_PROGRESS' }
  | { type: 'ADD_MISTAKE'; payload: { lessonId: string; question: string; errorDescription: string } }
  | { type: 'UPDATE_SCORE'; payload: { lessonId: string; scoreIncrement: number } }
  | { type: 'MARK_AS_COMPLETED'; payload: string }
  | { type: 'UPDATE_UI'; payload: Partial<AppState['ui']> }
  | { type: 'RESET_APP' };