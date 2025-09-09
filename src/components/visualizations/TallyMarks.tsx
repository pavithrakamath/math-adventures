import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TallyMarksProps {
  count?: number;
  mode?: 'static' | 'interactive';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  
  // Interactive mode props
  targetCount?: number;
  onCountChange?: (count: number) => void;
  showInstructions?: boolean;
}

const TallyMarks: React.FC<TallyMarksProps> = ({
  count: initialCount = 0,
  mode = 'static',
  animated = true,
  size = 'md',
  color = '#3b82f6',
  className = '',
  targetCount = 0,
  onCountChange,
  showInstructions = true,
}) => {
  const [count, setCount] = useState(initialCount);

  // Update internal count when prop changes
  React.useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

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

  const addMark = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
    
    // Visual feedback for every 5th mark
    if (newCount % 5 === 0) {
      console.log(`Group of 5 completed! Total: ${newCount}`);
    }
  };

  const removeMark = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };

  const reset = () => {
    setCount(0);
    onCountChange?.(0);
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

  const getFeedback = () => {
    if (targetCount === 0) return null;
    
    const difference = count - targetCount;
    if (difference === 0) {
      return { text: '🎉 Perfect!', color: 'text-green-600' };
    } else if (Math.abs(difference) === 1) {
      return { text: 'Close! Keep going!', color: 'text-yellow-600' };
    } else if (difference < 0) {
      return { text: `Add ${targetCount - count} more!`, color: 'text-blue-600' };
    } else {
      return { text: `Remove ${count - targetCount}!`, color: 'text-red-600' };
    }
  };

  const feedback = getFeedback();

  // Handle negative count gracefully
  if (count < 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No marks</span>
      </div>
    );
  }

  // Interactive mode
  if (mode === 'interactive') {
    return (
      <div className={`w-full max-w-2xl mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {showInstructions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Tally Marks
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Click "Add Mark" to add tally marks. Every 5th mark gets a diagonal line through the group!
              </p>
              {targetCount > 0 && (
                <p className="text-sm font-medium text-blue-600">
                  Target: {targetCount} marks
                </p>
              )}
            </div>
          )}

          {/* Tally Marks Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg min-h-[120px]">
            <div className="flex flex-wrap items-center gap-4">
              {count === 0 ? (
                <div className="text-gray-400 text-center w-full py-8">
                  No marks yet. Click "Add Mark" to start!
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-6">
                  {renderTallyMarks()}
                </div>
              )}
            </div>
          </div>

          {/* Count Display */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {count}
            </div>
            <div className="text-sm text-gray-600">
              {count === 1 ? 'mark' : 'marks'}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 text-sm font-medium ${feedback.color}`}
              >
                {feedback.text}
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addMark}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              aria-label="Add one tally mark"
            >
              <span>+</span>
              <span>Add Mark</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={removeMark}
              disabled={count === 0}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              aria-label="Remove one tally mark"
            >
              <span>-</span>
              <span>Remove</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              aria-label="Reset all tally marks"
            >
              Reset
            </motion.button>
          </div>

          {/* Tally Rules */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Tally Mark Rules:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Each mark represents 1 item</li>
              <li>• Group marks in sets of 5</li>
              <li>• Draw a diagonal line through every 5th mark</li>
              <li>• This makes counting easier!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Static mode
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