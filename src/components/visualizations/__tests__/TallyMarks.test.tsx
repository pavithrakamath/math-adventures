import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TallyMarks from '../TallyMarks';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: Record<string, unknown>) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children}</button>,
  },
}));

describe('TallyMarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Static Mode', () => {
    it('renders correct number of tally marks for count 5', () => {
      render(<TallyMarks count={5} mode="static" />);
      
      expect(screen.getByText('= 5')).toBeInTheDocument();
    });

    it('renders correct number of tally marks for count 12', () => {
      render(<TallyMarks count={12} mode="static" />);
      
      expect(screen.getByText('= 12')).toBeInTheDocument();
    });

    it('renders groups of 5 with diagonal lines', () => {
      render(<TallyMarks count={7} mode="static" />);
      
      expect(screen.getByText('= 7')).toBeInTheDocument();
      // Should have 1 complete group of 5 and 2 remaining marks
    });

    it('handles count of 0', () => {
      render(<TallyMarks count={0} mode="static" />);
      
      expect(screen.getByText('No marks')).toBeInTheDocument();
    });

    it('displays different sizes correctly', () => {
      const { rerender } = render(<TallyMarks count={3} mode="static" size="sm" />);
      expect(screen.getByText('= 3')).toBeInTheDocument();
      
      rerender(<TallyMarks count={3} mode="static" size="lg" />);
      expect(screen.getByText('= 3')).toBeInTheDocument();
    });

    it('uses custom color when provided', () => {
      render(<TallyMarks count={3} mode="static" color="#ff0000" />);
      
      expect(screen.getByText('= 3')).toBeInTheDocument();
    });

    it('disables animation when animated is false', () => {
      render(<TallyMarks count={3} mode="static" animated={false} />);
      
      expect(screen.getByText('= 3')).toBeInTheDocument();
    });
  });

  describe('Interactive Mode', () => {
    it('renders interactive tally marks with controls', () => {
      render(<TallyMarks count={0} mode="interactive" />);
      
      expect(screen.getByRole('button', { name: /add one tally mark/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove one tally mark/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset all tally marks/i })).toBeInTheDocument();
    });

    it('adds marks when add button is clicked', () => {
      const onCountChange = vi.fn();
      render(
        <TallyMarks 
          count={0} 
          mode="interactive" 
          onCountChange={onCountChange} 
        />
      );
      
      const addButton = screen.getByRole('button', { name: /add one tally mark/i });
      fireEvent.click(addButton);
      
      expect(onCountChange).toHaveBeenCalledWith(1);
    });

    it('removes marks when remove button is clicked', () => {
      const onCountChange = vi.fn();
      render(
        <TallyMarks 
          count={3} 
          mode="interactive" 
          onCountChange={onCountChange} 
        />
      );
      
      const removeButton = screen.getByRole('button', { name: /remove one tally mark/i });
      fireEvent.click(removeButton);
      
      expect(onCountChange).toHaveBeenCalledWith(2);
    });

    it('does not remove marks when count is 0', () => {
      const onCountChange = vi.fn();
      render(
        <TallyMarks 
          count={0} 
          mode="interactive" 
          onCountChange={onCountChange} 
        />
      );
      
      const removeButton = screen.getByRole('button', { name: /remove one tally mark/i });
      expect(removeButton).toBeDisabled();
      
      fireEvent.click(removeButton);
      expect(onCountChange).not.toHaveBeenCalled();
    });

    it('resets count when reset button is clicked', () => {
      const onCountChange = vi.fn();
      render(
        <TallyMarks 
          count={5} 
          mode="interactive" 
          onCountChange={onCountChange} 
        />
      );
      
      const resetButton = screen.getByRole('button', { name: /reset all tally marks/i });
      fireEvent.click(resetButton);
      
      expect(onCountChange).toHaveBeenCalledWith(0);
    });

    it('shows target feedback when targetCount is provided', () => {
      render(
        <TallyMarks 
          count={3} 
          mode="interactive" 
          targetCount={5} 
        />
      );
      
      expect(screen.getByText('Target: 5 marks')).toBeInTheDocument();
      expect(screen.getByText(/Add 2 more!/)).toBeInTheDocument();
    });

    it('shows perfect feedback when target is reached', () => {
      render(
        <TallyMarks 
          count={5} 
          mode="interactive" 
          targetCount={5} 
        />
      );
      
      expect(screen.getByText('🎉 Perfect!')).toBeInTheDocument();
    });

    it('shows close feedback when near target', () => {
      render(
        <TallyMarks 
          count={4} 
          mode="interactive" 
          targetCount={5} 
        />
      );
      
      expect(screen.getByText('Close! Keep going!')).toBeInTheDocument();
    });

    it('shows remove feedback when over target', () => {
      render(
        <TallyMarks 
          count={7} 
          mode="interactive" 
          targetCount={5} 
        />
      );
      
      expect(screen.getByText(/Remove 2!/)).toBeInTheDocument();
    });

    it('displays tally mark rules', () => {
      render(<TallyMarks count={0} mode="interactive" />);
      
      expect(screen.getByText('Tally Mark Rules:')).toBeInTheDocument();
      expect(screen.getByText('• Each mark represents 1 item')).toBeInTheDocument();
      expect(screen.getByText('• Group marks in sets of 5')).toBeInTheDocument();
    });

    it('shows instructions when showInstructions is true', () => {
      render(
        <TallyMarks 
          count={0} 
          mode="interactive" 
          showInstructions={true} 
        />
      );
      
      expect(screen.getByText('Interactive Tally Marks')).toBeInTheDocument();
      expect(screen.getAllByText(/click "add mark"/i)).toHaveLength(2);
    });

    it('hides instructions when showInstructions is false', () => {
      render(
        <TallyMarks 
          count={0} 
          mode="interactive" 
          showInstructions={false} 
        />
      );
      
      expect(screen.queryByText('Interactive Tally Marks')).not.toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('animates marks when animated is true', () => {
      render(<TallyMarks count={3} mode="static" animated={true} />);
      
      expect(screen.getByText('= 3')).toBeInTheDocument();
    });

    it('disables animation when animated is false', () => {
      render(<TallyMarks count={3} mode="static" animated={false} />);
      
      expect(screen.getByText('= 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', () => {
      render(<TallyMarks count={0} mode="interactive" />);
      
      const addButton = screen.getByRole('button', { name: /add one tally mark/i });
      const removeButton = screen.getByRole('button', { name: /remove one tally mark/i });
      const resetButton = screen.getByRole('button', { name: /reset all tally marks/i });
      
      expect(addButton).toBeInTheDocument();
      expect(removeButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<TallyMarks count={0} mode="interactive" />);
      
      const addButton = screen.getByRole('button', { name: /add one tally mark/i });
      addButton.focus();
      expect(addButton).toHaveFocus();
    });

    it('has proper button states', () => {
      const { rerender } = render(<TallyMarks count={0} mode="interactive" />);
      
      const removeButton = screen.getByRole('button', { name: /remove one tally mark/i });
      expect(removeButton).toBeDisabled();
      
      rerender(<TallyMarks count={1} mode="interactive" />);
      expect(removeButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('handles negative count gracefully', () => {
      render(<TallyMarks count={-1} mode="static" />);
      
      expect(screen.getByText('No marks')).toBeInTheDocument();
    });

    it('handles very large counts gracefully', () => {
      render(<TallyMarks count={1000} mode="static" />);
      
      expect(screen.getByText('= 1000')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TallyMarks 
          count={3} 
          mode="static" 
          className="custom-tally" 
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-tally');
    });

    it('handles different screen sizes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400,
      });
      
      render(<TallyMarks count={5} mode="static" />);
      
      expect(screen.getByText('= 5')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles count that is multiple of 5', () => {
      render(<TallyMarks count={15} mode="static" />);
      
      expect(screen.getByText('= 15')).toBeInTheDocument();
    });

    it('handles count that is 1 less than multiple of 5', () => {
      render(<TallyMarks count={14} mode="static" />);
      
      expect(screen.getByText('= 14')).toBeInTheDocument();
    });

    it('handles single mark', () => {
      render(<TallyMarks count={1} mode="static" />);
      
      expect(screen.getByText('= 1')).toBeInTheDocument();
    });
  });
});
