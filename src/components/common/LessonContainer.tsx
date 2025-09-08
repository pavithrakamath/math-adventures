import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Target } from 'lucide-react';
import { Button } from '../ui/button';
import type { Lesson } from '../../types/lesson.types';

interface LessonContainerProps {
  lesson: Lesson;
  children: ReactNode;
  onBack?: () => void;
  showProgress?: boolean;
  currentSection?: number;
  totalSections?: number;
  onSectionChange?: (section: number) => void;
  className?: string;
}

export const LessonContainer: React.FC<LessonContainerProps> = ({
  lesson,
  children,
  onBack,
  showProgress = true,
  currentSection = 0,
  totalSections = 1,
  className = '',
}) => {
  const progressPercentage = (currentSection / totalSections) * 100;

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                  {lesson.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.estimatedTime}
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {lesson.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            {showProgress && (
              <div className="text-sm text-gray-600">
                Section {currentSection + 1} of {totalSections}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
