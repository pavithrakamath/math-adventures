import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveTallyMarksProps {
  targetCount?: number;
  onCountChange?: (count: number) => void;
  showInstructions?: boolean;
}

const InteractiveTallyMarks: React.FC<InteractiveTallyMarksProps> = ({
  targetCount = 0,
  onCountChange,
  showInstructions = true
}) => {
  const [count, setCount] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);

  const addMark = () => {
    const newCount = count + 1;
    setCount(newCount);
    setMarks([...marks, newCount]);
    onCountChange?.(newCount);
    
    // Visual feedback for every 5th mark
    if (newCount % 5 === 0) {
      // Could add a special animation or sound here
      console.log(`Group of 5 completed! Total: ${newCount}`);
    }
  };

  const removeMark = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      setMarks(marks.slice(0, -1));
      onCountChange?.(newCount);
    }
  };

  const reset = () => {
    setCount(0);
    setMarks([]);
    onCountChange?.(0);
  };

  const renderTallyMarks = () => {
    const groups = Math.floor(count / 5);
    const remainder = count % 5;
    const tallyGroups = [];

    // Complete groups of 5
    for (let i = 0; i < groups; i++) {
      tallyGroups.push(
        <div key={`group-${i}`} className="flex items-center space-x-1 relative">
          {[1, 2, 3, 4].map((mark) => (
            <motion.div
              key={mark}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-8 border-l-2 border-blue-600"
            />
          ))}
          {/* Diagonal line through the group (represents the 5th mark) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-0.5 bg-red-600 transform rotate-45"></div>
          </div>
        </div>
      );
    }

    // Remainder marks
    if (remainder > 0) {
      tallyGroups.push(
        <div key="remainder" className="flex items-center space-x-1">
          {Array.from({ length: remainder }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-8 border-l-2 border-blue-600"
            />
          ))}
        </div>
      );
    }

    return tallyGroups;
  };

  const getFeedback = () => {
    if (targetCount === 0) return null;
    
    const difference = Math.abs(count - targetCount);
    if (difference === 0) {
      return { text: '🎉 Perfect!', color: 'text-green-600' };
    } else if (difference <= 2) {
      return { text: 'Close! Keep going!', color: 'text-yellow-600' };
    } else if (count < targetCount) {
      return { text: `Add ${targetCount - count} more!`, color: 'text-blue-600' };
    } else {
      return { text: `Remove ${count - targetCount}!`, color: 'text-red-600' };
    }
  };

  const feedback = getFeedback();

  return (
    <div className="w-full max-w-2xl mx-auto">
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
          >
            <span>-</span>
            <span>Remove</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
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
};

export default InteractiveTallyMarks;
