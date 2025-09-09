import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BarChart from '../BarChart';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children}</button>,
  },
}));

// Mock canvas context for canvas-based rendering
const mockCanvasContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  setLineDash: vi.fn(),
  arc: vi.fn(),
  rect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  font: '',
  textAlign: '',
  textBaseline: '',
};


// Mock canvas creation
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => mockCanvasContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: vi.fn(() => ({
    left: 0,
    top: 0,
    width: 600,
    height: 400,
  })),
});

const mockData = [
  { label: 'Apples', value: 15, color: '#3b82f6', emoji: '🍎' },
  { label: 'Bananas', value: 12, color: '#ef4444', emoji: '🍌' },
  { label: 'Oranges', value: 8, color: '#10b981', emoji: '🍊' },
  { label: 'Grapes', value: 10, color: '#f59e0b', emoji: '🍇' },
];

describe('BarChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Static Mode', () => {
    it('renders basic bar chart with data', () => {
      render(<BarChart data={mockData} mode="static" />);
      
      expect(screen.getByText('Apples')).toBeInTheDocument();
      expect(screen.getByText('Bananas')).toBeInTheDocument();
      expect(screen.getByText('Oranges')).toBeInTheDocument();
      expect(screen.getByText('Grapes')).toBeInTheDocument();
    });

    it('displays values on bars when showValues is true', () => {
      render(<BarChart data={mockData} mode="static" showValues={true} />);
      
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('hides values on bars when showValues is false', () => {
      render(<BarChart data={mockData} mode="static" showValues={false} />);
      
      expect(screen.queryByText('15')).not.toBeInTheDocument();
      expect(screen.queryByText('12')).not.toBeInTheDocument();
    });

    it('displays title when provided', () => {
      render(<BarChart data={mockData} mode="static" title="Fruit Sales" />);
      
      expect(screen.getByText('Fruit Sales')).toBeInTheDocument();
    });

    it('displays axis labels when provided', () => {
      render(
        <BarChart 
          data={mockData} 
          mode="static" 
          xAxisLabel="Fruits" 
          yAxisLabel="Quantity" 
        />
      );
      
      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('uses custom maxValue when provided', () => {
      render(<BarChart data={mockData} mode="static" maxValue={20} />);
      
      // The bars should be scaled to the custom max value
      // This would be tested by checking the actual bar heights in a real implementation
    });
  });

  describe('Interactive Mode', () => {
    it('renders interactive bar chart with canvas', () => {
      render(<BarChart data={mockData} mode="interactive" />);
      
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('allows adding data points when allowEdit is true', () => {
      const onDataChange = vi.fn();
      render(
        <BarChart 
          data={mockData} 
          mode="interactive" 
          allowEdit={true} 
          onDataChange={onDataChange} 
        />
      );
      
      const addButton = screen.getByText('+ Add Data Point');
      expect(addButton).toBeInTheDocument();
      
      fireEvent.click(addButton);
      expect(onDataChange).toHaveBeenCalled();
    });

    it('shows data point editor when allowEdit is true', () => {
      render(<BarChart data={mockData} mode="interactive" allowEdit={true} />);
      
      expect(screen.getByText('Data Points:')).toBeInTheDocument();
    });

    it('shows graph statistics when data is present', () => {
      render(<BarChart data={mockData} mode="interactive" />);
      
      expect(screen.getByText('Graph Statistics:')).toBeInTheDocument();
      expect(screen.getByText('Total Items:')).toBeInTheDocument();
      expect(screen.getByText('Highest Value:')).toBeInTheDocument();
    });
  });

  describe('Lesson Mode', () => {
    it('renders lesson bar chart with question when provided', () => {
      render(
        <BarChart 
          data={mockData} 
          mode="lesson" 
          question="Which fruit has the highest value?"
        />
      );
      
      expect(screen.getByText('Which fruit has the highest value?')).toBeInTheDocument();
    });

    it('shows edit/view mode toggle', () => {
      render(<BarChart data={mockData} mode="lesson" />);
      
      const toggleButton = screen.getByText('Edit Mode');
      expect(toggleButton).toBeInTheDocument();
    });

    it('handles bar clicks for answers', () => {
      const onAnswer = vi.fn();
      render(
        <BarChart 
          data={mockData} 
          mode="lesson" 
          correctAnswer="Apples"
          onAnswer={onAnswer}
        />
      );
      
      // Click on a bar (this would need to be implemented in the component)
      // For now, we'll test that the click handler is set up
      expect(screen.getAllByText('Apples')).toHaveLength(2); // One in chart, one in table
    });

    it('shows feedback when answer is provided', () => {
      render(
        <BarChart 
          data={mockData} 
          mode="lesson" 
          correctAnswer="Apples"
          showFeedback={true}
        />
      );
      
      // This would be tested after clicking a bar
      expect(screen.getByText('Click on any bar')).toBeInTheDocument();
    });

    it('displays data table in lesson mode', () => {
      render(<BarChart data={mockData} mode="lesson" />);
      
      expect(screen.getByText('Data Table')).toBeInTheDocument();
      expect(screen.getByText('Item')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<BarChart data={mockData} mode="static" title="Fruit Chart" />);
      
      // Check for accessibility attributes
      const chart = screen.getByRole('img', { name: /fruit chart/i });
      expect(chart).toBeInTheDocument();
    });

    it('supports keyboard navigation in interactive mode', () => {
      render(<BarChart data={mockData} mode="interactive" allowEdit={true} />);
      
      const addButton = screen.getByText('+ Add Data Point');
      addButton.focus();
      expect(addButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles empty data gracefully', () => {
      render(<BarChart data={[]} mode="static" />);
      
      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('handles invalid data gracefully', () => {
      const invalidData = [
        { label: 'Invalid', value: -5, color: '#ff0000' },
        { label: 'Valid', value: 10, color: '#00ff00' },
      ];
      
      render(<BarChart data={invalidData} mode="static" />);
      
      // Should handle negative values appropriately
      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('disables animation when animated prop is false', () => {
      render(<BarChart data={mockData} mode="static" animated={false} />);
      
      // Animation should be disabled
      // This would be tested by checking that animation classes are not applied
    });

    it('enables animation by default', () => {
      render(<BarChart data={mockData} mode="static" />);
      
      // Animation should be enabled by default
      // This would be tested by checking that animation classes are applied
    });
  });

  describe('Responsive Design', () => {
    it('applies custom className', () => {
      const { container } = render(
        <BarChart data={mockData} mode="static" className="custom-chart" />
      );
      
      expect(container.firstChild).toHaveClass('custom-chart');
    });

    it('handles different screen sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      
      render(<BarChart data={mockData} mode="static" />);
      
      // Component should render without errors
      expect(screen.getByText('Apples')).toBeInTheDocument();
    });
  });
});
