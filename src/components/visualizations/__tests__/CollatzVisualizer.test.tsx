import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import CollatzVisualizer from '../CollatzVisualizer';

// Mock the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('CollatzVisualizer', () => {
  it('renders with default props', () => {
    render(<CollatzVisualizer />);
    
    expect(screen.getByText('The Collatz Conjecture Journey')).toBeInTheDocument();
    expect(screen.getByText('Enter a starting number:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('27')).toBeInTheDocument();
  });

  it('renders with custom initial number', () => {
    render(<CollatzVisualizer initialNumber={15} />);
    
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
  });

  it('allows user to input a number', () => {
    render(<CollatzVisualizer />);
    
    const input = screen.getByDisplayValue('27');
    fireEvent.change(input, { target: { value: '10' } });
    
    expect(input).toHaveValue(10);
  });

  it('starts the journey when Start Journey is clicked', () => {
    render(<CollatzVisualizer />);
    
    const startButton = screen.getByText('Start Journey');
    fireEvent.click(startButton);
    
    // Should show the starting number in the sequence
    const all27s = screen.getAllByText('27');
    const sequence27 = all27s.find(el => el.closest('.flex.flex-wrap.items-center.gap-2'));
    expect(sequence27).toBeInTheDocument();
  });

  it('calculates next step correctly for even numbers', () => {
    render(<CollatzVisualizer initialNumber={4} />);
    
    const startButton = screen.getByText('Start Journey');
    fireEvent.click(startButton);
    
    const nextButton = screen.getByText('Calculate Next Number');
    fireEvent.click(nextButton);
    
    // 4 is even, so next should be 2
    const sequenceContainer = screen.getByText('4').closest('.flex.flex-wrap');
    expect(sequenceContainer).toHaveTextContent('2');
  });

  it('calculates next step correctly for odd numbers', () => {
    render(<CollatzVisualizer initialNumber={3} />);
    
    const startButton = screen.getByText('Start Journey');
    fireEvent.click(startButton);
    
    const nextButton = screen.getByText('Calculate Next Number');
    fireEvent.click(nextButton);
    
    // 3 is odd, so next should be 10 (3*3+1)
    const sequenceContainer = screen.getByText('3').closest('.flex.flex-wrap');
    expect(sequenceContainer).toHaveTextContent('10');
  });

  it('shows completion message when reaching 1', async () => {
    render(<CollatzVisualizer initialNumber={1} />);
    
    const startButton = screen.getByText('Start Journey');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText('You reached 1!')).toBeInTheDocument();
    });
  });

  it('runs all steps when Run All Steps is clicked', async () => {
    render(<CollatzVisualizer initialNumber={5} />);
    
    const runAllButton = screen.getByText('Run All Steps');
    fireEvent.click(runAllButton);
    
    await waitFor(() => {
      expect(screen.getByText('You reached 1!')).toBeInTheDocument();
    });
  });

  it('resets the sequence when Reset is clicked', () => {
    render(<CollatzVisualizer />);
    
    const startButton = screen.getByText('Start Journey');
    fireEvent.click(startButton);
    
    // Should show the starting number in the sequence
    const all27s = screen.getAllByText('27');
    const sequence27 = all27s.find(el => el.closest('.flex.flex-wrap.items-center.gap-2'));
    expect(sequence27).toBeInTheDocument();
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    // Should not show the sequence container anymore
    expect(screen.queryByText('27')).not.toBeInTheDocument();
  });

  it('disables buttons when input is invalid', () => {
    render(<CollatzVisualizer />);
    
    const input = screen.getByDisplayValue('27');
    fireEvent.change(input, { target: { value: '0' } });
    
    const startButton = screen.getByText('Start Journey');
    expect(startButton).toBeDisabled();
  });
});
