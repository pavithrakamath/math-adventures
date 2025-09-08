import React, { Suspense, lazy } from 'react';
import { VisualizationErrorBoundary } from '../ErrorBoundary';

// Lazy loading wrapper for visualizations
const LazyVisualization: React.FC<{
  componentName: string;
  fallback?: React.ReactNode;
  [key: string]: unknown;
}> = ({ componentName, fallback, ...props }) => {
  // Dynamically import the visualization component
  const LazyComponent = lazy(() => 
    import(`../visualizations/${componentName}`)
      .catch(() => {
        // Fallback to a default component if import fails
        return import('../visualizations/DefaultVisualization');
      })
  );

  const defaultFallback = (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading visualization...</p>
      </div>
    </div>
  );

  return (
    <VisualizationErrorBoundary>
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </VisualizationErrorBoundary>
  );
};

export default LazyVisualization;
