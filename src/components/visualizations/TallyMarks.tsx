import React from 'react';
import { motion } from 'framer-motion';

export interface TallyMarksProps {
  count: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const TallyMarks: React.FC<TallyMarksProps> = ({
  count,
  animated = true,
  size = 'md',
  color = '#3b82f6',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-3 h-4',
    md: 'w-4 h-6',
    lg: 'w-6 h-8',
  };

  const spacingClasses = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2',
  };

  const renderTallyGroup = (groupCount: number, groupIndex: number) => {
    const marks = [];
    const isCompleteGroup = groupCount === 5;
    
    // Vertical marks (1-4)
    for (let i = 0; i < Math.min(groupCount, 4); i++) {
      marks.push(
        <motion.div
          key={`vertical-${groupIndex}-${i}`}
          data-testid="vertical-line"
          className={`${sizeClasses[size]} border-l-2`}
          style={{ borderColor: color }}
          initial={animated ? { scaleY: 0 } : { scaleY: 1 }}
          animate={{ scaleY: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: animated ? (groupIndex * 0.5) + (i * 0.1) : 0 
          }}
        />
      );
    }
    
    // For groups of 5, add diagonal line that goes through the 4 vertical lines
    if (isCompleteGroup) {
      marks.push(
        <motion.div
          key={`diagonal-${groupIndex}`}
          data-testid="diagonal-line"
          className="absolute inset-0 flex items-center justify-center"
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: animated ? (groupIndex * 0.5) + 0.4 : 0 
          }}
        >
          <div
            className="w-16 h-0.5"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      );
    }
    
    return (
      <div key={groupIndex} className="flex items-end relative">
        {marks}
      </div>
    );
  };

  const renderTallyMarks = () => {
    const groups = [];
    const completeGroups = Math.floor(count / 5);
    const remainingMarks = count % 5;
    
    // Complete groups of 5
    for (let i = 0; i < completeGroups; i++) {
      groups.push(renderTallyGroup(5, i));
    }
    
    // Remaining marks
    if (remainingMarks > 0) {
      groups.push(renderTallyGroup(remainingMarks, completeGroups));
    }
    
    return groups;
  };

  if (count === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No marks</span>
      </div>
    );
  }

  return (
    <div className={`flex items-end ${spacingClasses[size]} ${className}`}>
      {renderTallyMarks()}
      <motion.span
        className="ml-2 text-sm font-medium text-gray-600"
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.3, 
          delay: animated ? (Math.floor(count / 5) * 0.5) + 0.6 : 0 
        }}
      >
        = {count}
      </motion.span>
    </div>
  );
};

export default TallyMarks;
