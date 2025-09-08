import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

interface TriangularNumbersVisualizerProps {
  maxTriangularNumber?: number;
  showAnimation?: boolean;
  autoPlay?: boolean;
}

export const TriangularNumbersVisualizer: React.FC<TriangularNumbersVisualizerProps> = ({
  maxTriangularNumber = 10,
  autoPlay = false
}) => {
  const [currentN, setCurrentN] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDots, setShowDots] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);

  // Calculate triangular number for given n
  const triangularNumber = (n: number) => (n * (n + 1)) / 2;

  // Generate dots for triangular pattern
  const generateDots = (n: number) => {
    const dots = [];
    for (let row = 1; row <= n; row++) {
      for (let col = 1; col <= row; col++) {
        dots.push({ row, col, id: `${row}-${col}` });
      }
    }
    return dots;
  };

  const currentTriangular = triangularNumber(currentN);
  const dots = generateDots(currentN);

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentN(prev => {
          if (prev >= maxTriangularNumber) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isAnimating, maxTriangularNumber]);

  const handleNext = () => {
    if (currentN < maxTriangularNumber) {
      setCurrentN(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentN > 1) {
      setCurrentN(prev => prev - 1);
    }
  };

  const handlePlay = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setCurrentN(1);
    setIsAnimating(false);
  };

  // Animation effect for dots
  useEffect(() => {
    if (isAnimating && currentN < maxTriangularNumber) {
      const timer = setTimeout(() => {
        setCurrentN(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentN >= maxTriangularNumber) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentN, maxTriangularNumber]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🔺 Triangular Numbers Visualization
        </h3>
        <p className="text-gray-600 mb-4">
          Watch how triangular numbers form beautiful triangular patterns!
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          onClick={handlePrevious}
          disabled={currentN <= 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentN >= maxTriangularNumber}
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
      </div>

      {/* Display Options */}
      <div className="flex justify-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDots}
            onChange={(e) => setShowDots(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Dots</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showNumbers}
            onChange={(e) => setShowNumbers(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Numbers</span>
        </label>
      </div>

      {/* Main Visualization */}
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Triangular Pattern */}
        <div className="flex-1">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              T({currentN}) = {currentTriangular}
            </h4>
            <p className="text-sm text-gray-600">
              {currentN === 1 ? '1 dot' : `${currentTriangular} dots`} arranged in a triangle
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              {showDots && (
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentN}, 1fr)` }}>
                  {dots.map((dot, index) => (
                    <div
                      key={dot.id}
                      className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        gridColumn: dot.col,
                        gridRow: dot.row
                      }}
                    >
                      {showNumbers && dot.row === currentN && dot.col === 1 ? currentN : ''}
                    </div>
                  ))}
                </div>
              )}
              
              {!showDots && showNumbers && (
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-500 mb-2">
                    {currentTriangular}
                  </div>
                  <p className="text-gray-600">Triangular Number</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formula and Pattern Info */}
        <div className="flex-1 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-2">Formula</h5>
            <div className="text-center">
              <div className="text-2xl font-mono text-blue-800">
                T(n) = n(n+1)/2
              </div>
              <div className="text-sm text-blue-600 mt-1">
                T({currentN}) = {currentN}×{currentN + 1}/2 = {currentTriangular}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-900 mb-2">Pattern</h5>
            <div className="text-sm text-green-800">
              <p className="mb-2">
                <strong>Row {currentN}:</strong> {currentN} dots
              </p>
              <p>
                <strong>Total:</strong> 1 + 2 + 3 + ... + {currentN} = {currentTriangular}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="font-semibold text-purple-900 mb-2">Sequence</h5>
            <div className="text-sm text-purple-800">
              <p>First {Math.min(currentN, 10)} triangular numbers:</p>
              <div className="font-mono text-xs mt-1">
                {Array.from({ length: Math.min(currentN, 10) }, (_, i) => triangularNumber(i + 1)).join(', ')}
                {currentN > 10 && '...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentN} / {maxTriangularNumber}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentN / maxTriangularNumber) * 100}%` }}
          />
        </div>
      </div>

      {/* Educational Notes */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-900 mb-2">💡 Did you know?</h5>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Triangular numbers appear in many real-world contexts</li>
          <li>• They're used in bowling (10 pins), billiards (15 balls), and more!</li>
          <li>• The sum of any two consecutive triangular numbers is a square number</li>
          <li>• T(n) + T(n-1) = n² (try it with the numbers above!)</li>
        </ul>
      </div>
    </div>
  );
};

export default TriangularNumbersVisualizer;
