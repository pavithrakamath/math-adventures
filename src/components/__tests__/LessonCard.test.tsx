import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemoizedLessonCard from '../optimized/MemoizedLessonCard';
import type { Lesson } from '../../types/lesson.types';

// Mock lesson data
const mockLesson: Lesson = {
  id: 'test-lesson',
  title: 'Test Lesson',
  description: 'This is a test lesson description',
  difficulty: 'Beginner',
  estimatedTime: '10 min',
  emoji: '🧪',
  learningObjectives: ['Learn something', 'Practice skills'],
  sections: [],
};

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('MemoizedLessonCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders lesson information correctly', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={false}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
    expect(screen.getByText('This is a test lesson description')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('2 objectives')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={false}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith('test-lesson');
  });

  it('does not call onClick when locked', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={true}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows completion status', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={true}
          isLocked={false}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('check-circle')).toBeInTheDocument();
  });

  it('shows lock status', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={true}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={false}
          progress={0}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledWith('test-lesson');

    fireEvent.keyDown(card, { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('shows progress bar when progress > 0', () => {
    render(
      <TestWrapper>
        <MemoizedLessonCard
          lesson={mockLesson}
          isCompleted={false}
          isLocked={false}
          progress={50}
          onClick={mockOnClick}
        />
      </TestWrapper>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
});
