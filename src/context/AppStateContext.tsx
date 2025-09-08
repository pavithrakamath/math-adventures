import { useReducer, useMemo, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { debounce } from 'lodash-es';
import type { AppState, AppAction } from './AppStateContext.types';
import { AppStateContext } from './AppStateContextProvider';

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
    
    case 'COMPLETE_LESSON': {
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
    }
    
    case 'ADD_MISTAKE': {
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
    }
    
    case 'UPDATE_SCORE': {
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
    }
    
    case 'MARK_AS_COMPLETED': {
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
    }
    
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


// Provider component
export const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
                  completedSections: Array.from(lp.completedSections || new Set()),
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
  useEffect(() => {
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
          lessonProgress.completedSections = new Set(lessonProgress.completedSections as unknown[] || []);
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
  useEffect(() => {
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