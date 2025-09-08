import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import LessonCard from '../components/lessons/LessonCard';
import { lessons } from '../data/lessons';
import { useProgress } from '../context/AppStateHooks';

const HomePage = () => {
  const navigate = useNavigate();
  const { progress, isLessonCompleted } = useProgress();

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Math Adventures"
        subtitle="Grade 6 Mathematics Learning Platform"
        progress={0}
        totalLessons={lessons.length}
        completedLessons={0}
        currentStreak={0}
        totalScore={0}
      />
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Choose any lesson to start learning with interactive visualizations!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const lessonProgress = progress.lessonProgress[lesson.id];
              const isCompleted = isLessonCompleted(lesson.id);
              const progressPercentage = lessonProgress && lessonProgress.completedSections ? 
                (lessonProgress.completedSections.size / lesson.sections.length) * 100 : 0;

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={progressPercentage}
                  isCompleted={isCompleted}
                  onClick={() => handleLessonClick(lesson.id)}
                />
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;