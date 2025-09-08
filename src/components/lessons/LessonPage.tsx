import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getLessonById } from '../../data/lessons';
import LessonView from './LessonView';
import { useProgress } from '../../hooks/useProgress';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { completeLesson } = useProgress();
  const [currentSection, setCurrentSection] = useState(0);
  
  if (!lessonId) {
    return <Navigate to="/" replace />;
  }
  
  const lesson = getLessonById(lessonId);
  
  if (!lesson) {
    return <Navigate to="/" replace />;
  }
  
  const handleLessonComplete = (score: number, timeSpent: number) => {
    completeLesson(lessonId, score, timeSpent);
  };
  
  return (
    <LessonView 
      lesson={lesson} 
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onComplete={handleLessonComplete} 
    />
  );
};

export default LessonPage;
