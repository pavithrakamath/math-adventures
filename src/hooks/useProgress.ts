import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, LessonProgress } from '../types/progress.types';

const STORAGE_KEY = 'math-adventures-progress';

const initialProgress: UserProgress = {
  completedLessons: new Set(),
  lessonProgress: {},
  currentStreak: 0,
  totalTimeSpent: 0,
  achievements: [],
  totalScore: 0,
  lastActivity: new Date(),
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Convert Set back from array
        parsed.completedLessons = new Set(parsed.completedLessons);
        // Convert dates back from strings
        parsed.lastActivity = new Date(parsed.lastActivity);
        Object.values(parsed.lessonProgress).forEach((lp: Record<string, unknown>) => {
          lp.completedSections = new Set(lp.completedSections);
          lp.lastAccessed = new Date(lp.lastAccessed);
        });
        setProgress(parsed);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        const progressToSave = {
          ...progress,
          completedLessons: Array.from(progress.completedLessons),
          lastActivity: progress.lastActivity.toISOString(),
          lessonProgress: Object.fromEntries(
            Object.entries(progress.lessonProgress).map(([key, lp]) => [
              key,
              {
                ...lp,
                completedSections: Array.from(lp.completedSections),
                lastAccessed: lp.lastAccessed.toISOString(),
              },
            ])
          ),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }, [progress, isLoading]);

  const updateLessonProgress = useCallback((lessonId: string, updates: Partial<LessonProgress>) => {
    setProgress(prev => ({
      ...prev,
      lessonProgress: {
        ...prev.lessonProgress,
        [lessonId]: {
          ...prev.lessonProgress[lessonId],
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
    }));
  }, []);

  const completeLesson = useCallback((lessonId: string, score: number, timeSpent: number) => {
    setProgress(prev => {
      const newCompletedLessons = new Set(prev.completedLessons);
      newCompletedLessons.add(lessonId);
      
      const newTotalScore = prev.totalScore + score;
      const newTotalTimeSpent = prev.totalTimeSpent + timeSpent;
      
      // Update streak
      const today = new Date().toDateString();
      const lastActivity = prev.lastActivity.toDateString();
      const newStreak = today === lastActivity ? prev.currentStreak : prev.currentStreak + 1;
      
      return {
        ...prev,
        completedLessons: newCompletedLessons,
        totalScore: newTotalScore,
        totalTimeSpent: newTotalTimeSpent,
        currentStreak: newStreak,
        lastActivity: new Date(),
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: {
            ...prev.lessonProgress[lessonId],
            lessonId,
            isCompleted: true,
            score,
            timeSpent,
            lastAccessed: new Date(),
          },
        },
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setProgress(prev => {
      if (prev.achievements.includes(achievementId)) {
        return prev; // Already unlocked
      }
      
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getLessonProgress = useCallback((lessonId: string): LessonProgress | undefined => {
    return progress.lessonProgress[lessonId];
  }, [progress.lessonProgress]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return progress.completedLessons.has(lessonId);
  }, [progress.completedLessons]);

  const getOverallProgress = useCallback((totalLessons: number): number => {
    return (progress.completedLessons.size / totalLessons) * 100;
  }, [progress.completedLessons.size]);

  return {
    progress,
    isLoading,
    updateLessonProgress,
    completeLesson,
    unlockAchievement,
    resetProgress,
    getLessonProgress,
    isLessonCompleted,
    getOverallProgress,
  };
};
