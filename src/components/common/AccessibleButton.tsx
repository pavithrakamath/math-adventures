import { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Button } from '../ui/button';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  motionProps?: MotionProps;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      motionProps,
      ariaLabel,
      ariaDescribedBy,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space key presses
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled && !loading) {
          props.onClick?.(e as any);
        }
      }
      onKeyDown?.(e);
    };

    const buttonContent = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        className={`relative ${className}`}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-describedby={ariaDescribedBy}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      </Button>
    );

    if (motionProps) {
      return (
        <motion.div {...motionProps}>
          {buttonContent}
        </motion.div>
      );
    }

    return buttonContent;
  }
);

AccessibleButton.displayName = 'AccessibleButton';
