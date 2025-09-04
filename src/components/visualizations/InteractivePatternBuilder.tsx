import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PatternElement {
  id: string;
  type: 'number' | 'shape' | 'color';
  value: string | number;
  emoji?: string;
}

interface InteractivePatternBuilderProps {
  patternType?: 'number' | 'shape' | 'color' | 'mixed';
  onPatternChange?: (pattern: PatternElement[]) => void;
  showAnswer?: boolean;
}

const InteractivePatternBuilder: React.FC<InteractivePatternBuilderProps> = ({
  patternType = 'mixed',
  onPatternChange,
  showAnswer = false
}) => {
  const [pattern, setPattern] = useState<PatternElement[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const numberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shapeOptions = [
    { emoji: '🔴', name: 'Circle' },
    { emoji: '🔵', name: 'Square' },
    { emoji: '🔺', name: 'Triangle' },
    { emoji: '⭐', name: 'Star' },
    { emoji: '💎', name: 'Diamond' },
    { emoji: '❤️', name: 'Heart' }
  ];
  const colorOptions = [
    { emoji: '🔴', name: 'Red' },
    { emoji: '🟡', name: 'Yellow' },
    { emoji: '🔵', name: 'Blue' },
    { emoji: '🟢', name: 'Green' },
    { emoji: '🟣', name: 'Purple' },
    { emoji: '🟠', name: 'Orange' }
  ];

  const addElement = (element: PatternElement) => {
    const newPattern = [...pattern, element];
    setPattern(newPattern);
    onPatternChange?.(newPattern);
    checkPattern(newPattern);
  };

  const removeElement = (index: number) => {
    const newPattern = pattern.filter((_, i) => i !== index);
    setPattern(newPattern);
    onPatternChange?.(newPattern);
    setIsComplete(false);
  };

  const clearPattern = () => {
    setPattern([]);
    onPatternChange?.([]);
    setIsComplete(false);
  };

  const checkPattern = (currentPattern: PatternElement[]) => {
    if (currentPattern.length < 3) return;

    // Check for common patterns
    const isNumberPattern = currentPattern.every(el => el.type === 'number');
    const isShapePattern = currentPattern.every(el => el.type === 'shape');
    const isColorPattern = currentPattern.every(el => el.type === 'color');

    if (isNumberPattern) {
      const numbers = currentPattern.map(el => Number(el.value));
      const differences: number[] = [];
      for (let i = 1; i < numbers.length; i++) {
        differences.push(numbers[i] - numbers[i - 1]);
      }
      
      if (differences.length >= 2 && differences.every(d => d === differences[0])) {
        setIsComplete(true);
      }
    } else if (isShapePattern || isColorPattern) {
      // Check for repeating patterns
      const values = currentPattern.map(el => el.value);
      if (values.length >= 4) {
        const halfLength = Math.floor(values.length / 2);
        const firstHalf = values.slice(0, halfLength);
        const secondHalf = values.slice(halfLength, halfLength * 2);
        
        if (JSON.stringify(firstHalf) === JSON.stringify(secondHalf)) {
          setIsComplete(true);
        }
      }
    }
  };

  const getNextElement = () => {
    if (pattern.length === 0) return null;
    
    const lastElement = pattern[pattern.length - 1];
    const isNumberPattern = pattern.every(el => el.type === 'number');
    
    if (isNumberPattern) {
      const numbers = pattern.map(el => Number(el.value));
      const differences: number[] = [];
      for (let i = 1; i < numbers.length; i++) {
        differences.push(numbers[i] - numbers[i - 1]);
      }
      
      if (differences.length >= 2 && differences.every(d => d === differences[0])) {
        const nextNumber = Number(lastElement.value) + differences[0];
        return { type: 'number' as const, value: nextNumber, id: `next-${Date.now()}` };
      }
    }
    
    return null;
  };

  const nextElement = getNextElement();

  const renderElement = (element: PatternElement, index: number) => {
    return (
      <motion.div
        key={element.id}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="flex flex-col items-center space-y-1 p-2 bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-300 transition-colors"
      >
        <div className="text-2xl">
          {element.emoji || element.value}
        </div>
        <div className="text-xs text-gray-600">
          {element.type}
        </div>
        <button
          onClick={() => removeElement(index)}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          ✕
        </button>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Pattern Builder
          </h3>
          <p className="text-sm text-gray-600">
            Create patterns by adding elements. Try to find the rule!
          </p>
        </div>

        {/* Pattern Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg min-h-[120px]">
          <div className="flex flex-wrap items-center gap-2">
            {pattern.length === 0 ? (
              <div className="text-gray-400 text-center w-full py-8">
                Start building your pattern by selecting elements below!
              </div>
            ) : (
              pattern.map((element, index) => renderElement(element, index))
            )}
            
            {nextElement && showAnswer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-1 p-2 bg-green-100 rounded-lg border-2 border-green-300"
              >
                <div className="text-2xl">
                  {nextElement.value.toString()}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Next!
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Pattern Status */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="font-semibold text-green-800">Great job!</div>
                <div className="text-sm text-green-700">You found a pattern!</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Element Selection */}
        <div className="space-y-4">
          {(patternType === 'number' || patternType === 'mixed') && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Numbers:</h4>
              <div className="flex flex-wrap gap-2">
                {numberOptions.map((number) => (
                  <motion.button
                    key={number}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addElement({
                      id: `num-${Date.now()}-${number}`,
                      type: 'number',
                      value: number
                    })}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors"
                  >
                    {number}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {(patternType === 'shape' || patternType === 'mixed') && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Shapes:</h4>
              <div className="flex flex-wrap gap-2">
                {shapeOptions.map((shape) => (
                  <motion.button
                    key={shape.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addElement({
                      id: `shape-${Date.now()}-${shape.name}`,
                      type: 'shape',
                      value: shape.name,
                      emoji: shape.emoji
                    })}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>{shape.emoji}</span>
                    <span>{shape.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {(patternType === 'color' || patternType === 'mixed') && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Colors:</h4>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addElement({
                      id: `color-${Date.now()}-${color.name}`,
                      type: 'color',
                      value: color.name,
                      emoji: color.emoji
                    })}
                    className="px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>{color.emoji}</span>
                    <span>{color.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Pattern length: {pattern.length}
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearPattern}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear
            </motion.button>
            
            {nextElement && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addElement(nextElement)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Next
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractivePatternBuilder;
