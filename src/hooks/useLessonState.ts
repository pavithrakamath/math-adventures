import { useState, useCallback } from 'react';
// import type { Question } from '../types/lesson.types';

export interface LessonState {
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, any>;
  showHint: boolean;
  timeSpent: number;
  startTime: Date;
  isCompleted: boolean;
  score: number;
  attempts: Record<string, number>;
}

export const useLessonState = (_lessonId: string) => {
  const [state, setState] = useState<LessonState>({
    currentSection: 0,
    currentQuestion: 0,
    answers: {},
    showHint: false,
    timeSpent: 0,
    startTime: new Date(),
    isCompleted: false,
    score: 0,
    attempts: {},
  });

  const updateSection = useCallback((section: number) => {
    setState(prev => ({
      ...prev,
      currentSection: section,
    }));
  }, []);

  const updateQuestion = useCallback((question: number) => {
    setState(prev => ({
      ...prev,
      currentQuestion: question,
    }));
  }, []);

  const addAnswer = useCallback((questionId: string, answer: any, isCorrect: boolean) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: {
          answer,
          isCorrect,
          timestamp: new Date(),
        },
      },
      attempts: {
        ...prev.attempts,
        [questionId]: (prev.attempts[questionId] || 0) + 1,
      },
      score: isCorrect ? prev.score + 10 : prev.score, // 10 points per correct answer
    }));
  }, []);

  const toggleHint = useCallback(() => {
    setState(prev => ({
      ...prev,
      showHint: !prev.showHint,
    }));
  }, []);

  const updateTimeSpent = useCallback(() => {
    const now = new Date();
    const timeSpent = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
    setState(prev => ({
      ...prev,
      timeSpent,
    }));
    return timeSpent;
  }, [state.startTime]);

  const completeLesson = useCallback(() => {
    const now = new Date();
    const timeSpent = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
    setState(prev => ({
      ...prev,
      isCompleted: true,
      timeSpent,
    }));
  }, [state.startTime]);

  const resetLesson = useCallback(() => {
    setState({
      currentSection: 0,
      currentQuestion: 0,
      answers: {},
      showHint: false,
      timeSpent: 0,
      startTime: new Date(),
      isCompleted: false,
      score: 0,
      attempts: {},
    });
  }, []);

  const getAnswer = useCallback((questionId: string) => {
    return state.answers[questionId];
  }, [state.answers]);

  const getAttempts = useCallback((questionId: string) => {
    return state.attempts[questionId] || 0;
  }, [state.attempts]);

  const getAccuracy = useCallback(() => {
    const totalAnswers = Object.keys(state.answers).length;
    if (totalAnswers === 0) return 0;
    
    const correctAnswers = Object.values(state.answers).filter(answer => answer.isCorrect).length;
    return (correctAnswers / totalAnswers) * 100;
  }, [state.answers]);

  const getProgress = useCallback((totalQuestions: number) => {
    return (Object.keys(state.answers).length / totalQuestions) * 100;
  }, [state.answers]);

  return {
    state,
    updateSection,
    updateQuestion,
    addAnswer,
    toggleHint,
    updateTimeSpent,
    completeLesson,
    resetLesson,
    getAnswer,
    getAttempts,
    getAccuracy,
    getProgress,
  };
};
