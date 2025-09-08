import { useContext, useCallback } from 'react';
import { AppStateContext } from './AppStateContext';
import type { AppState } from './AppStateContext.types';
import type { LessonProgress } from '../types/progress.types';

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
