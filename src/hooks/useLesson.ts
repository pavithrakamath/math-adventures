import { useState, useEffect, useCallback, useMemo, useTransition, useDeferredValue } from 'react';
import { useLessonData } from './useLessonData';
import { useErrorHandler } from './useErrorHandler';
import type { Lesson } from '../types/lesson.types';

interface UseLessonOptions {
  preload?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export const useLesson = (lessonId: string, options: UseLessonOptions = {}) => {
  const { preload = false, retryCount = 3, retryDelay = 1000 } = options;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isPending, startTransition] = useTransition();
  
  const { loadLessonData, getLessonById } = useLessonData();
  const { handleAsyncError } = useErrorHandler();

  // Deferred value for smooth UI updates
  const deferredLesson = useDeferredValue(lesson);

  // Load lesson with retry logic
  const loadLesson = useCallback(async (id: string, attempt: number = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const lessonData = await loadLessonData(id);
      if (lessonData) {
        setLesson(lessonData.lesson);
        setRetryAttempts(0);
      } else {
        throw new Error(`Failed to load lesson: ${id}`);
      }
    } catch (err) {
      const error = err as Error;
      
      if (attempt < retryCount) {
        // Retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        setTimeout(() => {
          setRetryAttempts(attempt + 1);
          loadLesson(id, attempt + 1);
        }, delay);
      } else {
        setError(error);
        setRetryAttempts(0);
      }
    } finally {
      setLoading(false);
    }
  }, [loadLessonData, retryCount, retryDelay]);

  // Load lesson on mount or when lessonId changes
  useEffect(() => {
    if (lessonId) {
      startTransition(() => {
        loadLesson(lessonId);
      });
    }
  }, [lessonId, loadLesson]);

  // Preload lesson if requested
  useEffect(() => {
    if (preload && lessonId) {
      loadLessonData(lessonId);
    }
  }, [preload, lessonId, loadLessonData]);

  // Retry function
  const retry = useCallback(() => {
    if (lessonId) {
      startTransition(() => {
        loadLesson(lessonId);
      });
    }
  }, [lessonId, loadLesson]);

  // Memoized lesson statistics
  const lessonStats = useMemo(() => {
    if (!lesson) return null;

    return {
      totalSections: lesson.sections.length,
      interactiveSections: lesson.sections.filter(s => s.type === 'interactive').length,
      practiceSections: lesson.sections.filter(s => s.type === 'practice').length,
      estimatedTime: lesson.estimatedTime,
      difficulty: lesson.difficulty,
      learningObjectives: lesson.learningObjectives.length,
    };
  }, [lesson]);

  // Memoized section navigation
  const sectionNavigation = useMemo(() => {
    if (!lesson) return null;

    return {
      currentSection: 0, // This would come from lesson state
      totalSections: lesson.sections.length,
      canGoNext: true, // This would be calculated based on completion
      canGoPrevious: false, // This would be calculated based on current position
    };
  }, [lesson]);

  return {
    lesson: deferredLesson,
    loading: loading || isPending,
    error,
    retryAttempts,
    retry,
    lessonStats,
    sectionNavigation,
  };
};

// Hook for lesson progress tracking
export const useLessonProgress = (lessonId: string) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(() => new Date());

  const updateSection = useCallback((section: number) => {
    setCurrentSection(section);
  }, []);

  const completeSection = useCallback((section: number) => {
    setCompletedSections(prev => new Set([...prev, section]));
  }, []);

  const addAnswer = useCallback((questionId: string, answer: any, isCorrect: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { answer, isCorrect, timestamp: new Date() },
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  }, []);

  const updateTimeSpent = useCallback(() => {
    const now = new Date();
    const spent = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    setTimeSpent(spent);
    return spent;
  }, [startTime]);

  const progress = useMemo(() => {
    return (completedSections.size / 10) * 100; // Assuming 10 total sections
  }, [completedSections.size]);

  const accuracy = useMemo(() => {
    const totalAnswers = Object.keys(answers).length;
    if (totalAnswers === 0) return 0;
    
    const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
    return (correctAnswers / totalAnswers) * 100;
  }, [answers]);

  return {
    currentSection,
    completedSections,
    answers,
    score,
    timeSpent,
    progress,
    accuracy,
    updateSection,
    completeSection,
    addAnswer,
    updateTimeSpent,
  };
};
