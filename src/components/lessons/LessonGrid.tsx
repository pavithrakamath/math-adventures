import React from 'react';
import { motion } from 'framer-motion';
import LessonCard from './LessonCard';
import type { Lesson } from '../../types/lesson.types';

export interface LessonGridProps {
  lessons: Lesson[];
  lessonProgress: Record<string, any>;
  completedLessons: Set<string>;
  onLessonClick: (lessonId: string) => void;
  className?: string;
}

const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  lessonProgress,
  completedLessons,
  onLessonClick,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  const getLessonStatus = (lesson: Lesson) => {
    const isCompleted = completedLessons.has(lesson.id);
    const isLocked = false; // Remove linear progression - all lessons are accessible
    const progress = lessonProgress[lesson.id]?.progress || 0;
    
    return { isCompleted, isLocked, progress };
  };

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lessons.map((lesson) => {
        const { isCompleted, isLocked, progress } = getLessonStatus(lesson);
        
        return (
          <motion.div
            key={lesson.id}
            variants={itemVariants}
            className="h-full"
          >
            <LessonCard
              lesson={lesson}
              progress={progress}
              isCompleted={isCompleted}
              isLocked={isLocked}
              onClick={() => onLessonClick(lesson.id)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LessonGrid;
