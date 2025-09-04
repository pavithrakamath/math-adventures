import React, { useState, useEffect } from 'react';

interface PatternVisualizerProps {
  pattern?: {
    sequence: number[];
    operation: string;
    nextValue?: number;
  };
  onComplete?: (isCorrect: boolean, userAnswer: number) => void;
  showHint?: boolean;
}

interface Pattern {
  sequence: number[];
  operation: string;
  nextValue: number;
  description: string;
}

const predefinedPatterns: Pattern[] = [
    {
      sequence: [2, 4, 6, 8],
      operation: '+ 2',
      nextValue: 10,
      description: 'Add 2 to each number'
    },
    {
      sequence: [1, 4, 7, 10],
      operation: '+ 3',
      nextValue: 13,
      description: 'Add 3 to each number'
    },
    {
      sequence: [5, 10, 15, 20],
      operation: '+ 5',
      nextValue: 25,
      description: 'Add 5 to each number'
    },
    {
      sequence: [2, 4, 8, 16],
      operation: '× 2',
      nextValue: 32,
      description: 'Multiply by 2 each time'
    },
    {
      sequence: [1, 3, 9, 27],
      operation: '× 3',
      nextValue: 81,
      description: 'Multiply by 3 each time'
    },
    {
      sequence: [100, 90, 80, 70],
      operation: '- 10',
      nextValue: 60,
      description: 'Subtract 10 each time'
    }
  ];

const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ 
  pattern, 
  onComplete, 
  showHint = true 
}) => {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    if (pattern) {
      setCurrentPattern({
        sequence: pattern.sequence,
        operation: pattern.operation,
        nextValue: pattern.nextValue || 0,
        description: `Custom pattern: ${pattern.operation}`
      });
    } else {
      // Select a random pattern
      const randomPattern = predefinedPatterns[Math.floor(Math.random() * predefinedPatterns.length)];
      setCurrentPattern(randomPattern);
    }
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setShowArrows(false);
  }, [pattern]);

  const handleAnswerSubmit = () => {
    if (!currentPattern) return;
    
    const answer = parseInt(userAnswer);
    const correct = answer === currentPattern.nextValue;
    setIsCorrect(correct);
    setShowResult(true);
    setShowArrows(true);
    onComplete?.(correct, answer);
  };

  const generateNewPattern = () => {
    const randomPattern = predefinedPatterns[Math.floor(Math.random() * predefinedPatterns.length)];
    setCurrentPattern(randomPattern);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setShowArrows(false);
  };

  const getOperationColor = (operation: string) => {
    if (operation.includes('+')) return 'text-green-600';
    if (operation.includes('-')) return 'text-red-600';
    if (operation.includes('×')) return 'text-blue-600';
    if (operation.includes('÷')) return 'text-purple-600';
    return 'text-gray-600';
  };

  const getArrowDirection = (operation: string) => {
    if (operation.includes('+')) return '→';
    if (operation.includes('-')) return '←';
    if (operation.includes('×')) return '↗';
    if (operation.includes('÷')) return '↘';
    return '→';
  };

  if (!currentPattern) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🔍 Number Pattern Visualizer
        </h3>
        <p className="text-gray-600 mb-4">
          Look at the pattern below and figure out what comes next!
        </p>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Pattern Sequence:
        </h4>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          {currentPattern.sequence.map((number, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg min-w-[60px] text-center">
                {number}
              </div>
              {index < currentPattern.sequence.length - 1 && (
                <div className="flex items-center mx-2">
                  {showArrows && (
                    <span className="text-2xl text-gray-400 mr-1">
                      {getArrowDirection(currentPattern.operation)}
                    </span>
                  )}
                  <span className={`text-lg font-semibold ${getOperationColor(currentPattern.operation)}`}>
                    {currentPattern.operation}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center">
            {showArrows && (
              <span className="text-2xl text-gray-400 mr-1">
                {getArrowDirection(currentPattern.operation)}
              </span>
            )}
            <span className={`text-lg font-semibold ${getOperationColor(currentPattern.operation)}`}>
              {currentPattern.operation}
            </span>
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold text-lg min-w-[60px] text-center ml-2">
              ?
            </div>
          </div>
        </div>

        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Hint:</strong> {currentPattern.description}
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What comes next in the pattern?
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter your answer"
            disabled={showResult}
          />
          <button
            onClick={handleAnswerSubmit}
            disabled={!userAnswer || showResult}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        </div>
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg border-2 mb-4 ${
          isCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">
              {isCorrect ? '✅' : '❌'}
            </span>
            <h4 className="text-lg font-bold">
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </h4>
          </div>
          <p className="text-gray-700 mb-2">
            {isCorrect 
              ? `Great job! The next number is indeed ${currentPattern.nextValue}.`
              : `The correct answer is ${currentPattern.nextValue}. Your answer was ${userAnswer}.`
            }
          </p>
          <p className="text-sm text-gray-600">
            <strong>Pattern:</strong> {currentPattern.description}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={generateNewPattern}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          New Pattern
        </button>
        
        {showResult && (
          <div className="text-sm text-gray-600">
            <p><strong>Pattern:</strong> {currentPattern.description}</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="font-semibold text-gray-700 mb-2">Pattern Types:</h5>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>• Addition: +2, +3, +5...</div>
          <div>• Subtraction: -1, -2, -10...</div>
          <div>• Multiplication: ×2, ×3, ×4...</div>
          <div>• Division: ÷2, ÷3, ÷5...</div>
        </div>
      </div>
    </div>
  );
};

export default PatternVisualizer;
