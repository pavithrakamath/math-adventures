export interface ProgressState {
  userProgress: UserProgress;
  isLoading: boolean;
  error: string | null;
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

export interface LessonProgress {
  lessonId: string;
  currentSection: number;
  completedSections: Set<number>;
  answers: Record<string, any>;
  score: number;
  timeSpent: number;
  isCompleted: boolean;
  lastAccessed: Date;
}

export interface ProgressAction {
  type: 'LOAD_PROGRESS' | 'UPDATE_LESSON_PROGRESS' | 'COMPLETE_LESSON' | 'UNLOCK_ACHIEVEMENT' | 'RESET_PROGRESS';
  payload?: any;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: Date;
}

export interface AnalyticsData {
  totalLessonsCompleted: number;
  averageScore: number;
  timeSpentPerLesson: Record<string, number>;
  mostDifficultConcepts: string[];
  learningStreak: StreakData;
  achievementsUnlocked: number;
}
