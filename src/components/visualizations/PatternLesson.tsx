import { useState } from 'react';
import PatternVisualizer from './PatternVisualizer';

const PatternLesson = () => {
  // Sample pattern data for the lesson
  const samplePatterns = [
    {
      sequence: [2, 4, 6, 8],
      operation: 'add' as const,
      value: 2,
      title: "Adding Pattern"
    },
    {
      sequence: [1, 4, 7, 10],
      operation: 'add' as const,
      value: 3,
      title: "Counting by 3s"
    },
    {
      sequence: [5, 10, 15, 20],
      operation: 'add' as const,
      value: 5,
      title: "Counting by 5s"
    }
  ];

  const [currentPattern, setCurrentPattern] = useState(0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎨 Visualize Number Patterns
        </h3>
        <p className="text-lg text-gray-600 mb-4">
          Let's explore different number patterns and see how they work!
        </p>
        
        <div className="flex justify-center space-x-2 mb-6">
          {samplePatterns.map((pattern, index) => (
            <button
              key={index}
              onClick={() => setCurrentPattern(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPattern === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pattern.title}
            </button>
          ))}
        </div>
      </div>

      <PatternVisualizer
        sequence={samplePatterns[currentPattern].sequence}
        operation={samplePatterns[currentPattern].operation}
        value={samplePatterns[currentPattern].value}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 What you're learning:</h4>
        <ul className="text-blue-800 space-y-1">
          <li>• Patterns help us predict what comes next</li>
          <li>• Math is all about finding and understanding patterns</li>
          <li>• Patterns can be in numbers, shapes, or even colors!</li>
        </ul>
      </div>
    </div>
  );
};

export default PatternLesson;
