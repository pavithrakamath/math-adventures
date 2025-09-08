import type { UserProgress } from '../types/progress.types';

// Enhanced app state interface
export interface AppState {
  progress: UserProgress;
  currentLesson: string | null;
  isLoading: boolean;
  error: string | null;
  settings: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
  ui: {
    sidebarOpen: boolean;
    currentView: 'home' | 'lesson' | 'achievements' | 'settings';
  };
}

// Action types
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string; score: number; timeSpent: number } }
  | { type: 'ADD_MISTAKE'; payload: { lessonId: string; question: string; errorDescription: string } }
  | { type: 'UPDATE_SCORE'; payload: { lessonId: string; scoreIncrement: number } }
  | { type: 'MARK_AS_COMPLETED'; payload: string }
  | { type: 'SET_CURRENT_LESSON'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_UI'; payload: Partial<AppState['ui']> }
  | { type: 'RESET_APP' };
