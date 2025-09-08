import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { LessonErrorBoundary } from '../components/ErrorBoundary';
import { useLesson } from '../hooks/useLesson';
import { LessonContainer } from '../components/common/LessonContainer';
import LessonView from '../components/lessons/LessonView';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lesson, loading, error, retry } = useLesson(lessonId || '');
  const [currentSection, setCurrentSection] = useState(0);
  
  if (!lessonId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading lesson..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Lesson</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  return (
    <LessonErrorBoundary>
      <LessonContainer
        lesson={lesson}
        onBack={() => window.history.back()}
        showProgress={true}
        currentSection={currentSection}
        totalSections={lesson.sections.length}
        onSectionChange={setCurrentSection}
      >
        <LessonView 
          lesson={lesson}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onComplete={(score, timeSpent) => {
            console.log('Lesson completed!', { score, timeSpent });
            // Here you could update progress, show achievements, etc.
          }}
        />
      </LessonContainer>
    </LessonErrorBoundary>
  );
};

export default LessonPage;