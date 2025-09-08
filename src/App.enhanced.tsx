import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './context/AppStateContext';
import { useTranslation } from './hooks/useTranslation';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your math adventure...</p>
    </div>
  </div>
);

// Main App component with all improvements
const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <AppStateProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AppStateProvider>
    </ErrorBoundary>
  );
};

export default App;
