import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, CheckCircle, Play } from 'lucide-react';
import type { Lesson } from '../../types/lesson.types';

export interface LessonCardProps {
  lesson: Lesson;
  progress?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick: () => void;
  className?: string;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progress = 0,
  isCompleted = false,
  isLocked = false,
  onClick,
  className = '',
}) => {
  const difficultyColors = {
    Beginner: 'bg-success-100 text-success-800 border-success-200',
    Intermediate: 'bg-warning-100 text-warning-800 border-warning-200',
    Advanced: 'bg-error-100 text-error-800 border-error-200',
  };

  const difficultyIcons = {
    Beginner: '⭐',
    Intermediate: '⭐⭐',
    Advanced: '⭐⭐⭐',
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${className} ${
        isLocked ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onClick={isLocked ? undefined : onClick}
      whileHover={isLocked ? {} : { scale: 1.02, y: -2 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{lesson.emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-display">
                {lesson.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {lesson.description}
              </p>
            </div>
          </div>
          
                  {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-success-600" />
        ) : (
          <Play className="w-6 h-6 text-primary-600" />
        )}
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[lesson.difficulty]}`}
          >
            <span className="mr-1">{difficultyIcons[lesson.difficulty]}</span>
            {lesson.difficulty}
          </span>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {lesson.estimatedTime}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              What you'll learn:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {lesson.learningObjectives.slice(0, 3).map((objective, index) => (
                <li key={index} className="flex items-start">
                  <Star className="w-3 h-3 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                  {objective}
                </li>
              ))}
              {lesson.learningObjectives.length > 3 && (
                <li className="text-primary-600 font-medium">
                  +{lesson.learningObjectives.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCompleted ? (
            <div className="w-full py-2 px-4 bg-success-100 text-success-700 rounded-lg text-center font-medium flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </div>
          ) : (
            <div className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg text-center font-medium hover:bg-primary-700 transition-colors duration-200">
              {progress > 0 ? 'Continue' : 'Start Lesson'}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LessonCard;
