import { useState, useEffect, useCallback, useMemo } from 'react';
import { useErrorHandler } from './useErrorHandler';
import type { Lesson, Question } from '../types/lesson.types';

// Enhanced lesson data interface
export interface LessonData {
  lesson: Lesson;
  questions: Question[];
  metadata: {
    lastUpdated: Date;
    version: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
}

// Cache for loaded lessons
const lessonCache = new Map<string, LessonData>();

export const useLessonData = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { handleAsyncError } = useErrorHandler();

  // Load all lessons metadata
  const loadLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import all lesson metadata
      const lessonModules = await Promise.all([
        import('../data/lessons/patterns-mathematics.json'),
        import('../data/lessons/lines-angles.json'),
        import('../data/lessons/number-play.json'),
        import('../data/lessons/data-handling.json'),
        import('../data/lessons/prime-time.json'),
        import('../data/lessons/perimeter-area.json'),
        import('../data/lessons/fractions.json'),
        import('../data/lessons/symmetry.json'),
        import('../data/lessons/integers.json'),
      ]);

      const loadedLessons = lessonModules.map(module => module.default);
      setLessons(loadedLessons);
    } catch (err) {
      const error = err as Error;
      setError(`Failed to load lessons: ${error.message}`);
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific lesson data with caching
  const loadLessonData = useCallback(async (lessonId: string): Promise<LessonData | null> => {
    // Check cache first
    if (lessonCache.has(lessonId)) {
      return lessonCache.get(lessonId)!;
    }

    const result = await handleAsyncError(async () => {
      const [lessonData, questionData] = await Promise.all([
        import(`../data/lessons/${lessonId}.json`),
        import(`../data/questions/${lessonId}.json`)
      ]);

      const lessonDataWithMetadata: LessonData = {
        lesson: lessonData.default,
        questions: questionData.default,
        metadata: {
          lastUpdated: new Date(),
          version: '1.0.0',
          difficulty: lessonData.default.difficulty || 'Beginner',
        },
      };

      // Cache the result
      lessonCache.set(lessonId, lessonDataWithMetadata);
      
      return lessonDataWithMetadata;
    }, `loadLessonData-${lessonId}`);

    return result;
  }, [handleAsyncError]);

  // Load questions for a specific lesson
  const loadQuestions = useCallback(async (lessonId: string) => {
    const result = await handleAsyncError(async () => {
      const questionData = await import(`../data/questions/${lessonId}.json`);
      return questionData.default;
    }, `loadQuestions-${lessonId}`);

    if (result) {
      setQuestions(prev => ({
        ...prev,
        [lessonId]: result,
      }));
    }

    return result;
  }, [handleAsyncError]);

  // Preload lessons for better performance
  const preloadLessons = useCallback(async (lessonIds: string[]) => {
    const promises = lessonIds.map(id => loadLessonData(id));
    await Promise.allSettled(promises);
  }, [loadLessonData]);

  // Get lesson by ID
  const getLessonById = useCallback((id: string): Lesson | undefined => {
    return lessons.find(lesson => lesson.id === id);
  }, [lessons]);

  // Get questions for lesson
  const getQuestionsForLesson = useCallback((lessonId: string) => {
    return questions[lessonId] || [];
  }, [questions]);

  // Memoized lesson statistics
  const lessonStats = useMemo(() => {
    const totalLessons = lessons.length;
    const completedLessons = 0; // This would come from progress context
    const averageDifficulty = lessons.reduce((acc, lesson) => {
      const difficultyScore = lesson.difficulty === 'Beginner' ? 1 : 
                            lesson.difficulty === 'Intermediate' ? 2 : 3;
      return acc + difficultyScore;
    }, 0) / totalLessons;

    return {
      totalLessons,
      completedLessons,
      averageDifficulty,
      difficultyDistribution: {
        beginner: lessons.filter(l => l.difficulty === 'Beginner').length,
        intermediate: lessons.filter(l => l.difficulty === 'Intermediate').length,
        advanced: lessons.filter(l => l.difficulty === 'Advanced').length,
      },
    };
  }, [lessons]);

  // Load lessons on mount
  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return {
    lessons,
    questions,
    loading,
    error,
    loadLessonData,
    loadQuestions,
    preloadLessons,
    getLessonById,
    getQuestionsForLesson,
    lessonStats,
  };
};
