import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-gray-700');
    
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('should render with different types', () => {
    const { rerender } = render(<Button type="button">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    
    rerender(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    
    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });
});
