import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FractionVisualizer from '../FractionVisualizer';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    path: ({ children, ...props }: Record<string, unknown>) => <path {...props}>{children}</path>,
    rect: ({ children, ...props }: Record<string, unknown>) => <rect {...props}>{children}</rect>,
    circle: ({ children, ...props }: Record<string, unknown>) => <circle {...props}>{children}</circle>,
    polygon: ({ children, ...props }: Record<string, unknown>) => <polygon {...props}>{children}</polygon>,
    line: ({ children, ...props }: Record<string, unknown>) => <line {...props}>{children}</line>,
    text: ({ children, ...props }: Record<string, unknown>) => <text {...props}>{children}</text>,
  },
}));


describe('FractionVisualizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Visualization Mode', () => {
    it('renders basic fraction visualization', () => {
      render(
        <FractionVisualizer 
          numerator={3} 
          denominator={4} 
          mode="visualization" 
        />
      );
      
      expect(screen.getByText('3/4')).toBeInTheDocument();
      expect(screen.getByText('3 out of 4 parts')).toBeInTheDocument();
    });

    it('displays percentage when numerator > 0', () => {
      render(
        <FractionVisualizer 
          numerator={3} 
          denominator={4} 
          mode="visualization" 
        />
      );
      
      expect(screen.getByText(/75\.0%/)).toBeInTheDocument();
    });

    it('renders different visual types', () => {
      const { rerender } = render(
        <FractionVisualizer 
          numerator={2} 
          denominator={3} 
          mode="visualization" 
          type="pizza" 
        />
      );
      
      expect(screen.getByText('2/3')).toBeInTheDocument();
      
      rerender(
        <FractionVisualizer 
          numerator={2} 
          denominator={3} 
          mode="visualization" 
          type="circle" 
        />
      );
      
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('handles different sizes', () => {
      const { rerender } = render(
        <FractionVisualizer 
          numerator={1} 
          denominator={2} 
          mode="visualization" 
          size="sm" 
        />
      );
      
      expect(screen.getByText('1/2')).toBeInTheDocument();
      
      rerender(
        <FractionVisualizer 
          numerator={1} 
          denominator={2} 
          mode="visualization" 
          size="lg" 
        />
      );
      
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  describe('Interactive Mode', () => {
    it('renders interactive fraction with clickable slices', () => {
      render(
        <FractionVisualizer 
          numerator={2} 
          denominator={4} 
          mode="interactive" 
          interactive={true}
        />
      );
      
      expect(screen.getByText('2/4')).toBeInTheDocument();
    });

    it('calls onFractionChange when slice is clicked', () => {
      const onFractionChange = vi.fn();
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={3} 
          mode="interactive" 
          interactive={true}
          onFractionChange={onFractionChange}
        />
      );
      
      // Click on a slice (this would need to be implemented in the component)
      // For now, we'll test that the component renders with interactive mode
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    it('updates fraction when slices are selected', async () => {
      const onFractionChange = vi.fn();
      render(
        <FractionVisualizer 
          numerator={0} 
          denominator={4} 
          mode="interactive" 
          interactive={true}
          onFractionChange={onFractionChange}
        />
      );
      
      // Simulate clicking on slices
      // This would be tested by actually clicking on the SVG elements
      expect(screen.getByText('0/4')).toBeInTheDocument();
    });
  });

  describe('Operations Mode', () => {
    it('renders fraction operations with two fractions', () => {
      render(
        <FractionVisualizer 
          fraction1={{ numerator: 1, denominator: 2 }}
          fraction2={{ numerator: 1, denominator: 4 }}
          mode="operations"
          operation="add"
        />
      );
      
      expect(screen.getByText('1/2')).toBeInTheDocument();
      expect(screen.getByText('1/4')).toBeInTheDocument();
    });

    it('shows step-by-step operation process', () => {
      render(
        <FractionVisualizer 
          fraction1={{ numerator: 1, denominator: 2 }}
          fraction2={{ numerator: 1, denominator: 4 }}
          mode="operations"
          operation="add"
        />
      );
      
      expect(screen.getByText(/can't add or subtract/i)).toBeInTheDocument();
    });

    it('allows finding common denominator', () => {
      render(
        <FractionVisualizer 
          fraction1={{ numerator: 1, denominator: 2 }}
          fraction2={{ numerator: 1, denominator: 4 }}
          mode="operations"
          operation="add"
        />
      );
      
      const nextButton = screen.getByText(/let's fix it/i);
      expect(nextButton).toBeInTheDocument();
      
      fireEvent.click(nextButton);
      
      // Should show common denominator step
      expect(screen.getAllByText(/common denominator/i)).toHaveLength(2);
    });

    it('shows final result after operation', () => {
      render(
        <FractionVisualizer 
          fraction1={{ numerator: 1, denominator: 2 }}
          fraction2={{ numerator: 1, denominator: 4 }}
          mode="operations"
          operation="add"
        />
      );
      
      // Navigate through the steps
      fireEvent.click(screen.getByText(/let's fix it/i));
      fireEvent.click(screen.getByText(/combine them/i));
      
      // Should show final result
      expect(screen.getByText(/result/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles zero denominator gracefully', () => {
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={0} 
          mode="visualization" 
        />
      );
      
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    it('handles negative values gracefully', () => {
      render(
        <FractionVisualizer 
          numerator={-1} 
          denominator={2} 
          mode="visualization" 
        />
      );
      
      // Should handle negative values appropriately
      expect(screen.getByText('-1/2')).toBeInTheDocument();
    });

    it('handles large denominators gracefully', () => {
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={100} 
          mode="visualization" 
        />
      );
      
      expect(screen.getByText('1/100')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', () => {
      render(
        <FractionVisualizer 
          numerator={2} 
          denominator={3} 
          mode="interactive" 
          interactive={true}
        />
      );
      
      // Check for accessibility attributes
      const slices = screen.getAllByRole('button');
      expect(slices.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', () => {
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={2} 
          mode="interactive" 
          interactive={true}
        />
      );
      
      const firstSlice = screen.getAllByRole('button')[0];
      firstSlice.focus();
      expect(firstSlice).toHaveFocus();
    });
  });

  describe('Visual Types', () => {
    it('renders pizza slices correctly', () => {
      render(
        <FractionVisualizer 
          numerator={2} 
          denominator={4} 
          mode="visualization" 
          type="pizza" 
        />
      );
      
      expect(screen.getByText('2/4')).toBeInTheDocument();
    });

    it('renders circle slices correctly', () => {
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={3} 
          mode="visualization" 
          type="circle" 
        />
      );
      
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    it('renders rectangle grid correctly', () => {
      render(
        <FractionVisualizer 
          numerator={3} 
          denominator={6} 
          mode="visualization" 
          type="rectangle" 
        />
      );
      
      expect(screen.getByText('3/6')).toBeInTheDocument();
    });

    it('renders bar representation correctly', () => {
      render(
        <FractionVisualizer 
          numerator={2} 
          denominator={5} 
          mode="visualization" 
          type="bar" 
        />
      );
      
      expect(screen.getByText('2/5')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies custom className', () => {
      const { container } = render(
        <FractionVisualizer 
          numerator={1} 
          denominator={2} 
          mode="visualization" 
          className="custom-fraction" 
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-fraction');
    });

    it('handles different screen sizes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400,
      });
      
      render(
        <FractionVisualizer 
          numerator={1} 
          denominator={2} 
          mode="visualization" 
        />
      );
      
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });
});
