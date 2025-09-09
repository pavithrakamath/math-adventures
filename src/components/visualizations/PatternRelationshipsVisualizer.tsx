import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Lightbulb, Calculator, Sparkles, Plus } from 'lucide-react';

interface PatternRelationshipsVisualizerProps {
  maxTerms?: number;
  autoPlay?: boolean;
}

interface PatternRelationship {
  id: string;
  title: string;
  description: string;
  leftPattern: {
    name: string;
    sequence: number[];
    color: string;
    emoji: string;
  };
  rightPattern: {
    name: string;
    sequence: number[];
    color: string;
    emoji: string;
  };
  operation: string;
  formula: string;
  discovery: string;
  interactive?: boolean;
}

export const PatternRelationshipsVisualizer: React.FC<PatternRelationshipsVisualizerProps> = ({
  autoPlay = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);

  // Generate sequences with proper mathematical definitions
  const generateSequence = (type: string, n: number): number[] => {
    switch (type) {
      case 'odd':
        return Array.from({ length: n }, (_, i) => 2 * i + 1);
      case 'square':
        return Array.from({ length: n }, (_, i) => (i + 1) ** 2);
      case 'triangular':
        return Array.from({ length: n }, (_, i) => ((i + 1) * (i + 2)) / 2);
      case 'fibonacci': {
        const fib = [1, 1];
        for (let i = 2; i < n; i++) {
          fib.push(fib[i - 1] + fib[i - 2]);
        }
        return fib;
      }
      case 'powers2':
        return Array.from({ length: n }, (_, i) => 2 ** i);
      default:
        return [];
    }
  };

  const relationships: PatternRelationship[] = [
    {
      id: 'odd-to-square',
      title: 'Odd Numbers → Square Numbers',
      description: 'Add consecutive odd numbers to create perfect squares!',
      leftPattern: {
        name: 'Odd Numbers',
        sequence: generateSequence('odd', 4),
        color: 'blue',
        emoji: '🔢'
      },
      rightPattern: {
        name: 'Square Numbers',
        sequence: generateSequence('square', 4),
        color: 'green',
        emoji: '⬜'
      },
      operation: 'Sum',
      formula: '1 + 3 + 5 + ... + (2n-1) = n²',
      discovery: 'Amazing! Adding consecutive odd numbers always gives you perfect squares!',
      interactive: true
    },
    {
      id: 'triangular-to-square',
      title: 'Triangular Numbers → Square Numbers',
      description: 'Add consecutive triangular numbers to make squares!',
      leftPattern: {
        name: 'Triangular Numbers',
        sequence: generateSequence('triangular', 4),
        color: 'orange',
        emoji: '🔺'
      },
      rightPattern: {
        name: 'Square Numbers',
        sequence: generateSequence('square', 4),
        color: 'green',
        emoji: '⬜'
      },
      operation: 'Sum',
      formula: 'T(n) + T(n-1) = n²',
      discovery: 'Incredible! Two consecutive triangular numbers always make a perfect square!',
      interactive: true
    },
    {
      id: 'fibonacci-golden',
      title: 'Fibonacci → Golden Ratio',
      description: 'Fibonacci ratios approach the golden ratio!',
      leftPattern: {
        name: 'Fibonacci Ratios',
        sequence: [1, 1.5, 1.67, 1.6, 1.625, 1.615],
        color: 'purple',
        emoji: '🌀'
      },
      rightPattern: {
        name: 'Golden Ratio',
        sequence: [1.618, 1.618, 1.618, 1.618, 1.618, 1.618],
        color: 'yellow',
        emoji: '✨'
      },
      operation: 'Ratio',
      formula: 'F(n)/F(n-1) → φ ≈ 1.618',
      discovery: 'Fascinating! Fibonacci ratios get closer and closer to the golden ratio!',
      interactive: true
    },
    {
      id: 'powers-sum',
      title: 'Powers of 2 → Next Power',
      description: 'Sum of powers of 2 plus 1 equals the next power!',
      leftPattern: {
        name: 'Powers of 2',
        sequence: generateSequence('powers2', 4),
        color: 'red',
        emoji: '⚡'
      },
      rightPattern: {
        name: 'Next Power',
        sequence: [2, 4, 8, 16],
        color: 'indigo',
        emoji: '🔮'
      },
      operation: 'Sum + 1',
      formula: '1 + 2 + 4 + ... + 2^(n-1) + 1 = 2^n',
      discovery: 'Mind-blowing! The sum of all previous powers plus 1 gives you the next power!',
      interactive: true
    }
  ];

  const currentRelationship = relationships[currentStep];

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= relationships.length - 1) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isAnimating, relationships.length]);

  const handleNext = () => {
    if (currentStep < relationships.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowDiscovery(false);
      setUserAnswer(null);
      setIsCorrect(null);
      setShowCalculation(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowDiscovery(false);
      setUserAnswer(null);
      setIsCorrect(null);
      setShowCalculation(false);
    }
  };

  const handlePlay = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setShowDiscovery(false);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowCalculation(false);
  };

  const handleDiscovery = () => {
    setShowDiscovery(!showDiscovery);
  };

  const handleUserAnswer = (answer: number) => {
    if (currentRelationship.interactive) {
      setUserAnswer(answer);
      
      // Calculate the correct answer based on the relationship
      let correctAnswer: number;
      switch (currentRelationship.id) {
        case 'odd-to-square': {
          correctAnswer = currentRelationship.leftPattern.sequence.reduce((sum, num) => sum + num, 0);
          break;
        }
        case 'triangular-to-square': {
          const triangular = currentRelationship.leftPattern.sequence;
          correctAnswer = triangular[triangular.length - 1] + triangular[triangular.length - 2];
          break;
        }
        case 'fibonacci-golden': {
          correctAnswer = 1.618; // Golden ratio
          break;
        }
        case 'powers-sum': {
          const powers = currentRelationship.leftPattern.sequence;
          correctAnswer = powers.reduce((sum, num) => sum + num, 0) + 1;
          break;
        }
        default:
          correctAnswer = 0;
      }
      
      setIsCorrect(Math.abs(answer - correctAnswer) < 0.01);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };


  const renderInteractiveChallenge = () => {
    if (!currentRelationship.interactive) return null;

    // Calculate the correct answer
    let correctAnswer: number;
    let calculation: string;
    
    switch (currentRelationship.id) {
      case 'odd-to-square': {
        correctAnswer = currentRelationship.leftPattern.sequence.reduce((sum, num) => sum + num, 0);
        calculation = `${currentRelationship.leftPattern.sequence.join(' + ')} = ?`;
        break;
      }
      case 'triangular-to-square': {
        const triangular = currentRelationship.leftPattern.sequence;
        correctAnswer = triangular[triangular.length - 1] + triangular[triangular.length - 2];
        calculation = `${triangular[triangular.length - 1]} + ${triangular[triangular.length - 2]} = ?`;
        break;
      }
      case 'fibonacci-golden': {
        correctAnswer = 1.618;
        calculation = 'What does the Fibonacci ratio approach?';
        break;
      }
      case 'powers-sum': {
        const powers = currentRelationship.leftPattern.sequence;
        correctAnswer = powers.reduce((sum, num) => sum + num, 0) + 1;
        calculation = `${powers.join(' + ')} + 1 = ?`;
        break;
      }
      default:
        correctAnswer = 0;
        calculation = '?';
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2">🎯 Your Challenge</h4>
          <p className="text-lg text-gray-700 mb-4">{calculation}</p>
        </div>
        
        {/* Answer Input */}
        <div className="flex justify-center gap-4">
          <input
            type="number"
            value={userAnswer || ''}
            onChange={(e) => setUserAnswer(parseFloat(e.target.value))}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg text-xl font-bold text-center focus:border-blue-500 focus:outline-none"
            placeholder="Your answer"
            step="0.001"
          />
          <Button
            onClick={() => userAnswer !== null && handleUserAnswer(userAnswer)}
            variant="default"
            size="lg"
            disabled={userAnswer === null}
          >
            Check Answer
          </Button>
        </div>

        {/* Feedback */}
        {isCorrect !== null && (
          <div className={`text-center p-6 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? (
              <div className="flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-2" />
                <span className="font-semibold text-lg">Excellent! You found the relationship!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="font-semibold text-lg">Not quite right. The answer is {correctAnswer}</span>
              </div>
            )}
          </div>
        )}

        {/* Show Calculation */}
        <div className="text-center">
          <Button
            onClick={() => setShowCalculation(!showCalculation)}
            variant="outline"
            size="sm"
          >
            {showCalculation ? 'Hide' : 'Show'} Calculation
          </Button>
          
          {showCalculation && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-mono">
                {calculation.replace('?', correctAnswer.toString())}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          🔗 Pattern Relationships Explorer
        </h3>
        <p className="text-gray-600 text-lg">
          Discover how different mathematical patterns connect and transform into each other!
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Relationship {currentStep + 1} of {relationships.length}</span>
          <span>{Math.round(((currentStep + 1) / relationships.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / relationships.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Relationship Display */}
      <div className={`rounded-xl border-2 p-8 ${getColorClasses(currentRelationship.leftPattern.color)}`}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{currentRelationship.leftPattern.emoji} {currentRelationship.operation} {currentRelationship.rightPattern.emoji}</div>
          <h4 className="text-2xl font-bold mb-3">{currentRelationship.title}</h4>
          <p className="text-lg opacity-90">{currentRelationship.description}</p>
        </div>

        {/* Pattern Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Pattern */}
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <span className="text-2xl mr-2">{currentRelationship.leftPattern.emoji}</span>
              {currentRelationship.leftPattern.name}
            </h5>
            <div className="flex flex-wrap justify-center gap-2">
              {currentRelationship.leftPattern.sequence.map((num, index) => (
                <div
                  key={index}
                  className="px-4 py-3 rounded-lg font-bold text-lg bg-white text-gray-800 shadow-md"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Operation */}
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-600">
              {currentRelationship.operation === 'Sum' && <Plus className="w-8 h-8" />}
              {currentRelationship.operation === 'Sum + 1' && <><Plus className="w-6 h-6" /><span className="text-2xl">1</span></>}
              {currentRelationship.operation === 'Ratio' && '÷'}
            </div>
          </div>

          {/* Right Pattern */}
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <span className="text-2xl mr-2">{currentRelationship.rightPattern.emoji}</span>
              {currentRelationship.rightPattern.name}
            </h5>
            <div className="flex flex-wrap justify-center gap-2">
              {currentRelationship.rightPattern.sequence.map((num, index) => (
                <div
                  key={index}
                  className="px-4 py-3 rounded-lg font-bold text-lg bg-white text-gray-800 shadow-md"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Challenge */}
        {renderInteractiveChallenge()}

        {/* Discovery Section */}
        {showDiscovery && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
              <h5 className="text-lg font-semibold">Discovery Time!</h5>
            </div>
            <p className="text-gray-700 mb-4">{currentRelationship.discovery}</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calculator className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-semibold">Formula:</span>
              </div>
              <div className="font-mono text-lg text-center">
                {currentRelationship.formula}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep <= 0}
          variant="outline"
          size="lg"
          className="px-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleDiscovery}
          variant="outline"
          size="lg"
          className="px-6"
        >
          <Lightbulb className="w-5 h-5 mr-2" />
          {showDiscovery ? 'Hide' : 'Show'} Discovery
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStep >= relationships.length - 1}
          variant="default"
          size="lg"
          className="px-6"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          onClick={handlePlay}
          variant={isAnimating ? "destructive" : "default"}
          size="lg"
          className="px-6"
        >
          {isAnimating ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isAnimating ? 'Pause' : 'Auto Play'}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          size="lg"
          className="px-6"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </Button>
      </div>

      {/* Step Navigation */}
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {relationships.map((rel, index) => (
            <Button
              key={rel.id}
              onClick={() => {
                setCurrentStep(index);
                setShowDiscovery(false);
                setUserAnswer(null);
                setIsCorrect(null);
                setShowCalculation(false);
              }}
              variant={currentStep === index ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              {rel.leftPattern.emoji} {rel.operation} {rel.rightPattern.emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Educational Footer */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h5 className="font-semibold text-indigo-900 mb-3 text-center">
          🌟 Why Pattern Relationships Matter
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <strong>🔍 Discovery:</strong> Relationships reveal hidden connections in mathematics
          </div>
          <div>
            <strong>🧩 Problem Solving:</strong> Understanding relationships makes complex problems easier
          </div>
          <div>
            <strong>🎨 Beauty:</strong> Relationships show the elegant structure of mathematics
          </div>
          <div>
            <strong>🚀 Innovation:</strong> Pattern relationships lead to new discoveries and applications
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRelationshipsVisualizer;