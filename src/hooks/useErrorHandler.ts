import { useCallback } from 'react';

export interface ErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void;
  showToast?: boolean;
  logError?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, showToast = true, logError = true } = options;

  const handleError = useCallback((error: Error, context?: string) => {
    if (logError) {
      console.error(`Error in ${context || 'unknown context'}:`, error);
    }

    if (onError) {
      onError(error, context);
    }

    if (showToast) {
      // You could integrate with a toast notification system here
      console.warn(`User notification: ${error.message}`);
    }
  }, [onError, showToast, logError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};
