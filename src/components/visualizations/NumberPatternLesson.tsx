import React, { useState } from 'react';
import PatternVisualizer from './PatternVisualizer';

const NumberPatternLesson: React.FC = () => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);

  const samplePatterns = [
    {
      sequence: [2, 4, 6, 8],
      operation: 'add' as const,
      value: 2,
      title: "Even Numbers Pattern",
      description: "Adding 2 each time"
    },
    {
      sequence: [1, 3, 5, 7],
      operation: 'add' as const,
      value: 2,
      title: "Odd Numbers Pattern", 
      description: "Adding 2 each time"
    },
    {
      sequence: [5, 10, 15, 20],
      operation: 'add' as const,
      value: 5,
      title: "Counting by 5s",
      description: "Adding 5 each time"
    },
    {
      sequence: [3, 6, 12, 24],
      operation: 'multiply' as const,
      value: 2,
      title: "Doubling Pattern",
      description: "Multiplying by 2 each time"
    },
    {
      sequence: [100, 90, 80, 70],
      operation: 'subtract' as const,
      value: 10,
      title: "Counting Down by 10s",
      description: "Subtracting 10 each time"
    }
  ];

  const currentPattern = samplePatterns[currentPatternIndex];

  const nextPattern = () => {
    setCurrentPatternIndex((prev) => (prev + 1) % samplePatterns.length);
  };

  const prevPattern = () => {
    setCurrentPatternIndex((prev) => (prev - 1 + samplePatterns.length) % samplePatterns.length);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{currentPattern.title}</h3>
        <p className="text-gray-600 mb-4">{currentPattern.description}</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <PatternVisualizer
          sequence={currentPattern.sequence}
          operation={currentPattern.operation}
          value={currentPattern.value}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevPattern}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ← Previous Pattern
        </button>
        
        <span className="text-sm text-gray-500">
          {currentPatternIndex + 1} of {samplePatterns.length}
        </span>
        
        <button
          onClick={nextPattern}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Next Pattern →
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Click the buttons above to explore different number patterns!
        </p>
      </div>
    </div>
  );
};

export default NumberPatternLesson;
