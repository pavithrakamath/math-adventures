import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, User } from 'lucide-react';
import ProgressBar from './ProgressBar';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  currentStreak?: number;
  totalScore?: number;
  showStats?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  progress = 0,
  totalLessons = 0,
  completedLessons = 0,
  currentStreak = 0,
  totalScore = 0,
  showStats = true,
  className = '',
}) => {
  return (
    <motion.header
      className={`bg-gradient-to-r from-primary-600 to-primary-700 text-white ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Title Section */}
          <div className="text-center mb-6">
            <motion.h1
              className="text-3xl md:text-4xl font-bold font-display mb-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="text-lg text-primary-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Progress Section */}
          {showStats && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Overall Progress */}
              <ProgressBar
                progress={progress}
                label="Overall Progress"
                showPercentage={true}
                size="lg"
                color="success"
              />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <motion.div
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary-200" />
                  <div className="text-2xl font-bold">{completedLessons}</div>
                  <div className="text-sm text-primary-200">Lessons Done</div>
                </motion.div>

                <motion.div
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-warning-300" />
                  <div className="text-2xl font-bold">{totalScore}</div>
                  <div className="text-sm text-primary-200">Total Score</div>
                </motion.div>

                <motion.div
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2 text-success-300" />
                  <div className="text-2xl font-bold">{currentStreak}</div>
                  <div className="text-sm text-primary-200">Day Streak</div>
                </motion.div>

                <motion.div
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-primary-200" />
                  <div className="text-2xl font-bold">{totalLessons}</div>
                  <div className="text-sm text-primary-200">Total Lessons</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
