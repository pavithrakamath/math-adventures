import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './context/AppStateContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Main App component with all improvements
const App: React.FC = () => {
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