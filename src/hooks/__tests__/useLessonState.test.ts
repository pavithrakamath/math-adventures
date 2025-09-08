import { renderHook, act } from '@testing-library/react';
import { useLessonState } from '../useLessonState';

describe('useLessonState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLessonState());
    
    expect(result.current.state).toEqual({
      currentSection: 0,
      currentQuestion: 0,
      answers: {},
      showHint: false,
      timeSpent: 0,
      startTime: expect.any(Date),
      isCompleted: false,
      score: 0,
      attempts: {},
    });
  });

  it('should update section', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.updateSection(2);
    });
    
    expect(result.current.state.currentSection).toBe(2);
  });

  it('should update question', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.updateQuestion(3);
    });
    
    expect(result.current.state.currentQuestion).toBe(3);
  });

  it('should add answer and update score', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
    });
    
    expect(result.current.state.answers.q1).toEqual({
      answer: 'answer1',
      isCorrect: true,
      timestamp: expect.any(Date),
    });
    expect(result.current.state.score).toBe(10);
    expect(result.current.state.attempts.q1).toBe(1);
  });

  it('should toggle hint', () => {
    const { result } = renderHook(() => useLessonState());
    
    expect(result.current.state.showHint).toBe(false);
    
    act(() => {
      result.current.toggleHint();
    });
    
    expect(result.current.state.showHint).toBe(true);
  });

  it('should complete lesson', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.completeLesson();
    });
    
    expect(result.current.state.isCompleted).toBe(true);
  });

  it('should reset lesson', () => {
    const { result } = renderHook(() => useLessonState());
    
    // First, add some state
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
      result.current.updateSection(2);
    });
    
    // Then reset
    act(() => {
      result.current.resetLesson();
    });
    
    expect(result.current.state).toEqual({
      currentSection: 0,
      currentQuestion: 0,
      answers: {},
      showHint: false,
      timeSpent: 0,
      startTime: expect.any(Date),
      isCompleted: false,
      score: 0,
      attempts: {},
    });
  });

  it('should get answer', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
    });
    
    const answer = result.current.getAnswer('q1');
    expect(answer).toEqual({
      answer: 'answer1',
      isCorrect: true,
      timestamp: expect.any(Date),
    });
  });

  it('should get attempts', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
      result.current.addAnswer('q1', 'answer2', false);
    });
    
    expect(result.current.getAttempts('q1')).toBe(2);
  });

  it('should calculate accuracy', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
      result.current.addAnswer('q2', 'answer2', false);
    });
    
    expect(result.current.getAccuracy()).toBe(50);
  });

  it('should calculate progress', () => {
    const { result } = renderHook(() => useLessonState());
    
    act(() => {
      result.current.addAnswer('q1', 'answer1', true);
      result.current.addAnswer('q2', 'answer2', false);
    });
    
    expect(result.current.getProgress(4)).toBe(50);
  });
});
