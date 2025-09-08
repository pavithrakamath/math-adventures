import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Clock, Target } from 'lucide-react';
import type { Lesson } from '../../types/lesson.types';

interface MemoizedLessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
  onClick: (lessonId: string) => void;
  className?: string;
}

const MemoizedLessonCard = memo<MemoizedLessonCardProps>(({
  lesson,
  isCompleted,
  isLocked,
  progress,
  onClick,
  className = '',
}) => {
  const handleClick = useCallback(() => {
    if (!isLocked) {
      onClick(lesson.id);
    }
  }, [onClick, lesson.id, isLocked]);

  const difficultyColor = useMemo(() => {
    switch (lesson.difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }, [lesson.difficulty]);

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
    hover: {
      scale: 1.02,
    },
  }), []);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isLocked ? "hover" : undefined}
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`${lesson.title} - ${lesson.difficulty} difficulty`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Progress Bar */}
      {progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <motion.div
            className="h-full bg-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{lesson.emoji}</div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {isLocked && (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {lesson.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {lesson.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
              {lesson.difficulty}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {lesson.estimatedTime}
            </span>
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            {lesson.learningObjectives.length} objectives
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      {!isLocked && (
        <motion.div
          className="absolute inset-0 bg-primary-600 bg-opacity-0 hover:bg-opacity-10 transition-all duration-200"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
});

MemoizedLessonCard.displayName = 'MemoizedLessonCard';

export default MemoizedLessonCard;
