import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface FibonacciVisualizerProps {
  maxTerms?: number;
  showSpiral?: boolean;
  showRectangles?: boolean;
  autoPlay?: boolean;
}

export const FibonacciVisualizer: React.FC<FibonacciVisualizerProps> = ({
  maxTerms = 12,
  showSpiral = true,
  showRectangles = true,
  autoPlay = false
}) => {
  const [currentTerm, setCurrentTerm] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGoldenRatio, setShowGoldenRatio] = useState(false);

  // Generate Fibonacci sequence
  const generateFibonacci = (n: number) => {
    const sequence = [1, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  };

  const fibonacci = generateFibonacci(maxTerms);
  const currentValue = fibonacci[currentTerm - 1];
  const previousValue = currentTerm > 1 ? fibonacci[currentTerm - 2] : 0;

  // Calculate golden ratio approximation
  const goldenRatio = currentTerm > 1 ? currentValue / previousValue : 1;

  // Generate spiral points
  const generateSpiralPoints = () => {
    const points = [];
    let x = 0, y = 0;
    let angle = 0;
    const scale = 8;

    for (let i = 0; i < Math.min(currentTerm, fibonacci.length); i++) {
      const radius = fibonacci[i] * scale;
      const x1 = x + Math.cos(angle) * radius;
      const y1 = y + Math.sin(angle) * radius;
      
      points.push({ x: x1, y: y1, value: fibonacci[i] });
      
      // Move to next position
      x = x1;
      y = y1;
      angle += Math.PI / 2; // 90 degrees
    }
    return points;
  };

  const spiralPoints = generateSpiralPoints();

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentTerm(prev => {
          if (prev >= maxTerms) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isAnimating, maxTerms]);

  const handleNext = () => {
    if (currentTerm < maxTerms) {
      setCurrentTerm(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTerm > 2) {
      setCurrentTerm(prev => prev - 1);
    }
  };

  const handlePlay = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setCurrentTerm(2);
    setIsAnimating(false);
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && currentTerm < maxTerms) {
      const timer = setTimeout(() => {
        setCurrentTerm(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentTerm >= maxTerms) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentTerm, maxTerms]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🌀 Fibonacci/Virahānka Numbers
        </h3>
        <p className="text-gray-600 mb-4">
          Discover the beautiful spiral pattern in nature's most famous sequence!
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          onClick={handlePrevious}
          disabled={currentTerm <= 2}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentTerm >= maxTerms}
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
          onClick={() => setShowGoldenRatio(!showGoldenRatio)}
          variant={showGoldenRatio ? "default" : "outline"}
          size="sm"
        >
          <Zap className="w-4 h-4 mr-1" />
          Golden Ratio
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sequence Display */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Sequence</h4>
            <div className="flex flex-wrap gap-2">
              {fibonacci.slice(0, currentTerm).map((num, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                    index === currentTerm - 1
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-blue-700">
              <strong>F({currentTerm}) = {currentValue}</strong>
              {currentTerm > 1 && (
                <span className="ml-2">
                  = F({currentTerm - 1}) + F({currentTerm - 2}) = {previousValue} + {fibonacci[currentTerm - 3] || 0}
                </span>
              )}
            </div>
          </div>

          {/* Golden Ratio */}
          {showGoldenRatio && currentTerm > 1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Golden Ratio φ</h4>
              <div className="text-center">
                <div className="text-2xl font-mono text-yellow-800">
                  φ ≈ {goldenRatio.toFixed(6)}
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  F({currentTerm}) ÷ F({currentTerm - 1}) = {currentValue} ÷ {previousValue}
                </div>
                <div className="text-xs text-yellow-600 mt-2">
                  The true golden ratio is approximately 1.618034
                </div>
              </div>
            </div>
          )}

          {/* Pattern Rules */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Pattern Rules</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Start with 1, 1</li>
              <li>• Each number is the sum of the two previous numbers</li>
              <li>• F(n) = F(n-1) + F(n-2)</li>
              <li>• Found everywhere in nature!</li>
            </ul>
          </div>
        </div>

        {/* Spiral Visualization */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-center">Golden Spiral</h4>
          <div className="relative bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            <svg
              width="100%"
              height="400"
              viewBox="-200 -200 400 400"
              className="overflow-visible"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Fibonacci rectangles */}
              {showRectangles && spiralPoints.slice(0, currentTerm).map((point, index) => {
                const size = fibonacci[index] * 8;
                const x = point.x - size / 2;
                const y = point.y - size / 2;
                
                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={size}
                    height={size}
                    fill="none"
                    stroke={index === currentTerm - 1 ? "#3b82f6" : "#d1d5db"}
                    strokeWidth={index === currentTerm - 1 ? "3" : "1"}
                    className="transition-all duration-500"
                  />
                );
              })}
              
              {/* Spiral path */}
              {showSpiral && (
                <path
                  d={`M 0,0 ${spiralPoints.slice(0, currentTerm).map((_, index) => {
                    const radius = fibonacci[index] * 8;
                    const angle = index * Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return `A ${radius},${radius} 0 0,1 ${x},${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
              )}
              
              {/* Points */}
              {spiralPoints.slice(0, currentTerm).map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={index === currentTerm - 1 ? "6" : "3"}
                  fill={index === currentTerm - 1 ? "#3b82f6" : "#6b7280"}
                  className="transition-all duration-300"
                />
              ))}
            </svg>
          </div>

          {/* Nature Examples */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="font-semibold text-purple-900 mb-2">🌿 Found in Nature</h5>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Flower petals (lilies, irises)</li>
              <li>• Pine cone spirals</li>
              <li>• Sunflower seed patterns</li>
              <li>• Nautilus shell spirals</li>
              <li>• Galaxy spiral arms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentTerm - 1} / {maxTerms - 1}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentTerm - 1) / (maxTerms - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FibonacciVisualizer;
