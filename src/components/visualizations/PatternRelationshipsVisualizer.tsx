import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Link, Zap } from 'lucide-react';

interface PatternRelationshipsVisualizerProps {
  maxTerms?: number;
  autoPlay?: boolean;
}

export const PatternRelationshipsVisualizer: React.FC<PatternRelationshipsVisualizerProps> = ({
  maxTerms = 8,
  autoPlay = false
}) => {
  const [currentRelationship, setCurrentRelationship] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConnections, setShowConnections] = useState(true);

  // Generate various sequences
  const generateSequence = (type: string, n: number) => {
    switch (type) {
      case 'triangular':
        return Array.from({ length: n }, (_, i) => ((i + 1) * (i + 2)) / 2);
      case 'square':
        return Array.from({ length: n }, (_, i) => (i + 1) ** 2);
      case 'odd':
        return Array.from({ length: n }, (_, i) => 2 * i + 1);
      case 'fibonacci': {
        const fib = [1, 1];
        for (let i = 2; i < n; i++) {
          fib.push(fib[i - 1] + fib[i - 2]);
        }
        return fib;
      }
      case 'powers2':
        return Array.from({ length: n }, (_, i) => 2 ** (i + 1));
      case 'counting':
        return Array.from({ length: n }, (_, i) => i + 1);
      default:
        return [];
    }
  };

  const relationships = [
    {
      id: 'odd-to-square',
      title: 'Odd Numbers → Square Numbers',
      description: 'Adding consecutive odd numbers creates perfect squares',
      sequences: {
        odd: generateSequence('odd', maxTerms),
        square: generateSequence('square', maxTerms)
      },
      connection: (n: number) => {
        const odds = generateSequence('odd', n);
        const sum = odds.reduce((acc, num) => acc + num, 0);
        const square = n ** 2;
        return { sum, square, match: sum === square };
      },
      formula: '1 + 3 + 5 + ... + (2n-1) = n²',
      color: 'blue'
    },
    {
      id: 'triangular-to-square',
      title: 'Triangular Numbers → Square Numbers',
      description: 'Adding consecutive triangular numbers creates squares',
      sequences: {
        triangular: generateSequence('triangular', maxTerms),
        square: generateSequence('square', maxTerms)
      },
      connection: (n: number) => {
        const triangular = generateSequence('triangular', n);
        const sum = triangular[n - 1] + triangular[n - 2];
        const square = n ** 2;
        return { sum, square, match: sum === square };
      },
      formula: 'T(n) + T(n-1) = n²',
      color: 'green'
    },
    {
      id: 'fibonacci-golden',
      title: 'Fibonacci → Golden Ratio',
      description: 'Fibonacci ratios approach the golden ratio',
      sequences: {
        fibonacci: generateSequence('fibonacci', maxTerms)
      },
      connection: (n: number) => {
        const fib = generateSequence('fibonacci', n);
        if (n < 2) return { ratio: 1, golden: 1.618 };
        const ratio = fib[n - 1] / fib[n - 2];
        return { ratio, golden: 1.618, match: Math.abs(ratio - 1.618) < 0.1 };
      },
      formula: 'F(n)/F(n-1) → φ ≈ 1.618',
      color: 'purple'
    },
    {
      id: 'powers-sum',
      title: 'Powers of 2 → Next Power',
      description: 'Sum of powers of 2 plus 1 equals next power',
      sequences: {
        powers2: generateSequence('powers2', maxTerms)
      },
      connection: (n: number) => {
        const powers = generateSequence('powers2', n);
        const sum = powers.slice(0, n).reduce((acc, num) => acc + num, 0);
        const nextPower = 2 ** (n + 1);
        return { sum, nextPower, match: sum + 1 === nextPower };
      },
      formula: '1 + 2 + 4 + ... + 2ⁿ + 1 = 2^(n+1)',
      color: 'orange'
    }
  ];

  const currentRel = relationships[currentRelationship];
  const connectionData = currentRel.connection(maxTerms);

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentRelationship(prev => {
          if (prev >= relationships.length - 1) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isAnimating, relationships.length]);

  const handleNext = () => {
    if (currentRelationship < relationships.length - 1) {
      setCurrentRelationship(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentRelationship > 0) {
      setCurrentRelationship(prev => prev - 1);
    }
  };

  const handlePlay = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setCurrentRelationship(0);
    setIsAnimating(false);
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && currentRelationship < relationships.length - 1) {
      const timer = setTimeout(() => {
        setCurrentRelationship(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentRelationship >= relationships.length - 1) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentRelationship, relationships.length]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getAccentColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Pattern Relationships
        </h3>
        <p className="text-gray-600 mb-4">
          Discover the beautiful connections between different mathematical sequences!
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          onClick={handlePrevious}
          disabled={currentRelationship <= 0}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentRelationship >= relationships.length - 1}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <Button
          onClick={handlePlay}
          variant={isAnimating ? "destructive" : "default"}
          size="sm"
        >
          {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isAnimating ? 'Pause' : 'Play'}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>

        <Button
          onClick={() => setShowConnections(!showConnections)}
          variant={showConnections ? "default" : "outline"}
          size="sm"
        >
          <Link className="w-4 h-4 mr-1" />
          Connections
        </Button>
      </div>

      {/* Relationship Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {relationships.map((rel, index) => (
          <Button
            key={rel.id}
            onClick={() => setCurrentRelationship(index)}
            variant={currentRelationship === index ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {rel.title}
          </Button>
        ))}
      </div>

      {/* Current Relationship Display */}
      <div className={`rounded-lg border p-6 ${getColorClasses(currentRel.color)}`}>
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold mb-2">{currentRel.title}</h4>
          <p className="text-sm opacity-80">{currentRel.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sequences */}
          <div className="space-y-4">
            {Object.entries(currentRel.sequences).map(([name, sequence]) => (
              <div key={name} className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-semibold mb-3 capitalize">{name} Numbers</h5>
                <div className="flex flex-wrap gap-2">
                  {sequence.slice(0, maxTerms).map((num: number, index: number) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                        index === maxTerms - 1
                          ? `${getAccentColor(currentRel.color)} bg-opacity-20 scale-110`
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Connection Analysis */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-semibold mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Connection Analysis
              </h5>
              
              {currentRel.id === 'odd-to-square' && 'sum' in connectionData && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Sum of first {maxTerms} odd numbers:</strong>
                    <div className="font-mono text-lg">
                      {generateSequence('odd', maxTerms).join(' + ')} = {connectionData.sum}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>{maxTerms}² = {'square' in connectionData ? connectionData.square : 'N/A'}</strong>
                  </div>
                  <div className={`text-sm font-bold ${connectionData.match ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionData.match ? '✅ Perfect match!' : '❌ Not equal'}
                  </div>
                </div>
              )}

              {currentRel.id === 'triangular-to-square' && 'sum' in connectionData && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>T({maxTerms}) + T({maxTerms - 1}):</strong>
                    <div className="font-mono text-lg">
                      {generateSequence('triangular', maxTerms)[maxTerms - 1]} + {generateSequence('triangular', maxTerms)[maxTerms - 2]} = {connectionData.sum}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>{maxTerms}² = {'square' in connectionData ? connectionData.square : 'N/A'}</strong>
                  </div>
                  <div className={`text-sm font-bold ${connectionData.match ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionData.match ? '✅ Perfect match!' : '❌ Not equal'}
                  </div>
                </div>
              )}

              {currentRel.id === 'fibonacci-golden' && 'ratio' in connectionData && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>F({maxTerms})/F({maxTerms - 1}):</strong>
                    <div className="font-mono text-lg">
                      {generateSequence('fibonacci', maxTerms)[maxTerms - 1]} / {generateSequence('fibonacci', maxTerms)[maxTerms - 2]} ≈ {connectionData.ratio.toFixed(6)}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>Golden ratio φ ≈ {connectionData.golden}</strong>
                  </div>
                  <div className={`text-sm font-bold ${connectionData.match ? 'text-green-600' : 'text-yellow-600'}`}>
                    {connectionData.match ? '✅ Very close!' : '🔄 Getting closer...'}
                  </div>
                </div>
              )}

              {currentRel.id === 'powers-sum' && 'sum' in connectionData && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Sum of powers + 1:</strong>
                    <div className="font-mono text-lg">
                      {generateSequence('powers2', maxTerms).slice(0, maxTerms).join(' + ')} + 1 = {connectionData.sum + 1}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>2^{maxTerms + 1} = {'nextPower' in connectionData ? connectionData.nextPower : 'N/A'}</strong>
                  </div>
                  <div className={`text-sm font-bold ${connectionData.match ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionData.match ? '✅ Perfect match!' : '❌ Not equal'}
                  </div>
                </div>
              )}
            </div>

            {/* Formula */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-semibold mb-2">Formula</h5>
              <div className="text-center">
                <div className="font-mono text-lg bg-gray-100 p-3 rounded">
                  {currentRel.formula}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Relationship</span>
          <span>{currentRelationship + 1} / {relationships.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentRelationship + 1) / relationships.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Educational Notes */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h5 className="font-semibold text-indigo-900 mb-2">🌟 Why These Relationships Matter</h5>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• They reveal the deep structure of mathematics</li>
          <li>• They help us understand why patterns exist</li>
          <li>• They connect seemingly different concepts</li>
          <li>• They make mathematics more beautiful and meaningful</li>
        </ul>
      </div>
    </div>
  );
};

export default PatternRelationshipsVisualizer;
