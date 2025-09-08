import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { debounce } from 'lodash-es';
import type { UserProgress, LessonProgress } from '../types/progress.types';
import type { Lesson } from '../types/lesson.types';

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
type AppAction =
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

// Initial state
const initialState: AppState = {
  progress: {
    completedLessons: new Set(),
    lessonProgress: {},
    currentStreak: 0,
    totalTimeSpent: 0,
    achievements: [],
    totalScore: 0,
    lastActivity: new Date(),
  },
  currentLesson: null,
  isLoading: true,
  error: null,
  settings: {
    theme: 'light',
    language: 'en',
    soundEnabled: true,
    animationsEnabled: true,
  },
  ui: {
    sidebarOpen: false,
    currentView: 'home',
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      };
    
    case 'COMPLETE_LESSON':
      const { lessonId, score, timeSpent } = action.payload;
      const newCompletedLessons = new Set(state.progress.completedLessons);
      newCompletedLessons.add(lessonId);
      
      const newTotalScore = state.progress.totalScore + score;
      const newTotalTimeSpent = state.progress.totalTimeSpent + timeSpent;
      
      // Update streak
      const today = new Date().toDateString();
      const lastActivity = state.progress.lastActivity.toDateString();
      const newStreak = today === lastActivity ? state.progress.currentStreak : state.progress.currentStreak + 1;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLessons: newCompletedLessons,
          totalScore: newTotalScore,
          totalTimeSpent: newTotalTimeSpent,
          currentStreak: newStreak,
          lastActivity: new Date(),
          lessonProgress: {
            ...state.progress.lessonProgress,
            [lessonId]: {
              ...state.progress.lessonProgress[lessonId],
              lessonId,
              isCompleted: true,
              score,
              timeSpent,
              lastAccessed: new Date(),
              mistakes: state.progress.lessonProgress[lessonId]?.mistakes || [],
            },
          },
        },
      };
    
    case 'ADD_MISTAKE':
      const { lessonId: mistakeLessonId, question, errorDescription } = action.payload;
      const currentLessonProgress = state.progress.lessonProgress[mistakeLessonId];
      const newMistake = {
        question,
        errorDescription,
        timestamp: Date.now(),
      };
      
      return {
        ...state,
        progress: {
          ...state.progress,
          lessonProgress: {
            ...state.progress.lessonProgress,
            [mistakeLessonId]: {
              ...currentLessonProgress,
              lessonId: mistakeLessonId,
              mistakes: [...(currentLessonProgress?.mistakes || []), newMistake],
              lastAccessed: new Date(),
            },
          },
        },
      };
    
    case 'UPDATE_SCORE':
      const { lessonId: scoreLessonId, scoreIncrement } = action.payload;
      const currentScore = state.progress.lessonProgress[scoreLessonId]?.score || 0;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          lessonProgress: {
            ...state.progress.lessonProgress,
            [scoreLessonId]: {
              ...state.progress.lessonProgress[scoreLessonId],
              lessonId: scoreLessonId,
              score: currentScore + scoreIncrement,
              lastAccessed: new Date(),
              mistakes: state.progress.lessonProgress[scoreLessonId]?.mistakes || [],
            },
          },
        },
      };
    
    case 'MARK_AS_COMPLETED':
      const completedLessonId = action.payload;
      const completedLessons = new Set(state.progress.completedLessons);
      completedLessons.add(completedLessonId);
      
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLessons: completedLessons,
          lessonProgress: {
            ...state.progress.lessonProgress,
            [completedLessonId]: {
              ...state.progress.lessonProgress[completedLessonId],
              lessonId: completedLessonId,
              isCompleted: true,
              lastAccessed: new Date(),
              mistakes: state.progress.lessonProgress[completedLessonId]?.mistakes || [],
            },
          },
        },
      };
    
    case 'SET_CURRENT_LESSON':
      return { ...state, currentLesson: action.payload };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'UPDATE_UI':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
    
    case 'RESET_APP':
      return initialState;
    
    default:
      return state;
  }
};

// Context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Debounced save to localStorage
  const debouncedSave = useMemo(
    () => debounce((appState: AppState) => {
      try {
        const stateToSave = {
          ...appState,
          progress: {
            ...appState.progress,
            completedLessons: Array.from(appState.progress.completedLessons),
            lastActivity: appState.progress.lastActivity.toISOString(),
            lessonProgress: Object.fromEntries(
              Object.entries(appState.progress.lessonProgress).map(([key, lp]) => [
                key,
                {
                  ...lp,
                  completedSections: Array.from(lp.completedSections),
                  lastAccessed: lp.lastAccessed.toISOString(),
                },
              ])
            ),
          },
        };
        localStorage.setItem('math-adventures-app-state', JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving app state:', error);
      }
    }, 500),
    []
  );

  // Load state from localStorage on mount
  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem('math-adventures-app-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Convert Set back from array
        parsed.progress.completedLessons = new Set(parsed.progress.completedLessons);
        // Convert dates back from strings
        parsed.progress.lastActivity = new Date(parsed.progress.lastActivity);
        Object.values(parsed.progress.lessonProgress).forEach((lp: unknown) => {
          const lessonProgress = lp as Record<string, unknown>;
          lessonProgress.completedSections = new Set(lessonProgress.completedSections as unknown[]);
          lessonProgress.lastAccessed = new Date(lessonProgress.lastAccessed as string);
        });
        dispatch({ type: 'UPDATE_PROGRESS', payload: parsed.progress });
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed.settings });
        dispatch({ type: 'UPDATE_UI', payload: parsed.ui });
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    if (!state.isLoading) {
      debouncedSave(state);
    }
  }, [state, debouncedSave]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hooks for accessing state
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const useProgress = () => {
  const { state, dispatch } = useAppState();
  
  const updateLessonProgress = useCallback((lessonId: string, updates: Partial<LessonProgress>) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        lessonProgress: {
          ...state.progress.lessonProgress,
          [lessonId]: {
            ...state.progress.lessonProgress[lessonId],
            lessonId,
            currentSection: 0,
            completedSections: new Set(),
            answers: {},
            score: 0,
            timeSpent: 0,
            isCompleted: false,
            lastAccessed: new Date(),
            ...updates,
          },
        },
      },
    });
  }, [state.progress.lessonProgress, dispatch]);

  const completeLesson = useCallback((lessonId: string, score: number, timeSpent: number) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: { lessonId, score, timeSpent } });
  }, [dispatch]);

  const addMistake = useCallback((lessonId: string, question: string, errorDescription: string) => {
    dispatch({ type: 'ADD_MISTAKE', payload: { lessonId, question, errorDescription } });
  }, [dispatch]);

  const updateScore = useCallback((lessonId: string, scoreIncrement: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { lessonId, scoreIncrement } });
  }, [dispatch]);

  const markAsCompleted = useCallback((lessonId: string) => {
    dispatch({ type: 'MARK_AS_COMPLETED', payload: lessonId });
  }, [dispatch]);

  const getLessonProgress = useCallback((lessonId: string) => {
    return state.progress.lessonProgress[lessonId];
  }, [state.progress.lessonProgress]);

  const getPastErrors = useCallback((lessonId: string): string => {
    const lessonProgress = state.progress.lessonProgress[lessonId];
    if (!lessonProgress || lessonProgress.mistakes.length === 0) {
      return "No past errors recorded for this lesson.";
    }
    // Return a summary of the last few mistakes
    return lessonProgress.mistakes
      .slice(-3)
      .map(m => `On question "${m.question}", the student had this issue: ${m.errorDescription}`)
      .join('\n');
  }, [state.progress.lessonProgress]);

  const getOverallProgress = useCallback((totalLessons: number): number => {
    return (state.progress.completedLessons.size / totalLessons) * 100;
  }, [state.progress.completedLessons.size]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return state.progress.completedLessons.has(lessonId);
  }, [state.progress.completedLessons]);

  return {
    progress: state.progress,
    isLoading: state.isLoading,
    updateLessonProgress,
    completeLesson,
    addMistake,
    updateScore,
    markAsCompleted,
    getLessonProgress,
    getPastErrors,
    getOverallProgress,
    isLessonCompleted,
  };
};

export const useSettings = () => {
  const { state, dispatch } = useAppState();
  
  const updateSettings = useCallback((settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, [dispatch]);

  return {
    settings: state.settings,
    updateSettings,
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppState();
  
  const updateUI = useCallback((ui: Partial<AppState['ui']>) => {
    dispatch({ type: 'UPDATE_UI', payload: ui });
  }, [dispatch]);

  return {
    ui: state.ui,
    updateUI,
  };
};
