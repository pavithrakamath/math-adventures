// Accessibility utilities
export const generateId = (prefix: string = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

export const getAriaLabel = (element: HTMLElement): string => {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim() ||
    ''
  );
};

export const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const scrollIntoViewIfNeeded = (element: HTMLElement) => {
  if (!isElementVisible(element)) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// ARIA attributes helpers
export const createAriaProps = (props: {
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
}) => {
  const ariaProps: Record<string, string | boolean> = {};
  
  if (props.label) ariaProps['aria-label'] = props.label;
  if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy;
  if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded;
  if (props.selected !== undefined) ariaProps['aria-selected'] = props.selected;
  if (props.disabled !== undefined) ariaProps['aria-disabled'] = props.disabled;
  if (props.hidden !== undefined) ariaProps['aria-hidden'] = props.hidden;
  if (props.live) ariaProps['aria-live'] = props.live;
  
  return ariaProps;
};

// Keyboard navigation helpers
export const handleKeyNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onSpace?: () => void;
  }
) => {
  switch (event.key) {
    case 'Enter':
      options.onEnter?.();
      break;
    case 'Escape':
      options.onEscape?.();
      break;
    case 'ArrowUp':
      options.onArrowUp?.();
      break;
    case 'ArrowDown':
      options.onArrowDown?.();
      break;
    case 'ArrowLeft':
      options.onArrowLeft?.();
      break;
    case 'ArrowRight':
      options.onArrowRight?.();
      break;
    case ' ':
      event.preventDefault();
      options.onSpace?.();
      break;
  }
};
