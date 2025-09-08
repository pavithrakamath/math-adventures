// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import LessonGrid from './components/lessons/LessonGrid';
import LessonPage from './components/lessons/LessonPage';
import { lessons } from './data/lessons';
import { useProgress } from './hooks/useProgress';
import './App.css';

function App() {
  const { progress, isLoading, getOverallProgress } = useProgress();

  const handleLessonClick = (lessonId: string) => {
    window.location.href = `/lesson/${lessonId}`;
  };

  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.size;
  const overallProgress = getOverallProgress(totalLessons);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your math adventure...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Math Adventures"
          subtitle="Grade 6 Mathematics Learning Platform"
          progress={overallProgress}
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          currentStreak={progress.currentStreak}
          totalScore={progress.totalScore}
        />
        
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Math Adventures! 🎯
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Embark on an exciting journey through Grade 6 mathematics. 
                    Choose any lesson to start learning with interactive visualizations, solve problems, and unlock achievements!
                  </p>
                </div>
                
                <LessonGrid
                  lessons={lessons}
                  completedLessons={progress.completedLessons}
                  onLessonClick={handleLessonClick}
                />
              </motion.div>
            } />
            
            <Route path="/lessons" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    All Lessons
                  </h2>
                  <p className="text-lg text-gray-600">
                    Explore all available math lessons. Choose any lesson to start learning - no restrictions!
                  </p>
                </div>
                
                <LessonGrid
                  lessons={lessons}
                  completedLessons={progress.completedLessons}
                  onLessonClick={handleLessonClick}
                />
              </motion.div>
            } />
            
            <Route path="/achievements" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🏆 Achievements
                  </h2>
                  <p className="text-lg text-gray-600">
                    Your learning milestones and accomplishments.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Achievements Coming Soon!
                  </h3>
                  <p className="text-gray-600">
                    Complete lessons to unlock amazing achievements and badges.
                  </p>
                </div>
              </motion.div>
            } />
            
            <Route path="/settings" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    ⚙️ Settings
                  </h2>
                  <p className="text-lg text-gray-600">
                    Customize your learning experience.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Settings Coming Soon!
                  </h3>
                  <p className="text-gray-600">
                    Personalize your learning journey with custom settings.
                  </p>
                </div>
              </motion.div>
            } />
            
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;