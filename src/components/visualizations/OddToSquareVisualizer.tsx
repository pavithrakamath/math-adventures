import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Square } from 'lucide-react';

interface OddToSquareVisualizerProps {
  maxSquares?: number;
  showAnimation?: boolean;
  autoPlay?: boolean;
}

export const OddToSquareVisualizer: React.FC<OddToSquareVisualizerProps> = ({
  maxSquares = 6,
  showAnimation = true,
  autoPlay = false
}) => {
  const [currentSquare, setCurrentSquare] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFormula, setShowFormula] = useState(true);

  // Generate odd numbers that sum to square numbers
  const generateOddNumbers = (n: number) => {
    const odds = [];
    for (let i = 1; i <= 2 * n - 1; i += 2) {
      odds.push(i);
    }
    return odds;
  };

  const oddNumbers = generateOddNumbers(currentSquare);
  const squareNumber = currentSquare * currentSquare;
  const sum = oddNumbers.reduce((acc, num) => acc + num, 0);

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentSquare(prev => {
          if (prev >= maxSquares) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isAnimating, maxSquares]);

  const handleNext = () => {
    if (currentSquare < maxSquares) {
      setCurrentSquare(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSquare > 1) {
      setCurrentSquare(prev => prev - 1);
    }
  };

  const handlePlay = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setCurrentSquare(1);
    setIsAnimating(false);
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && currentSquare < maxSquares) {
      const timer = setTimeout(() => {
        setCurrentSquare(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentSquare >= maxSquares) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentSquare, maxSquares]);

  // Generate square pattern for visualization
  const generateSquarePattern = (n: number) => {
    const pattern = [];
    let currentOdd = 1;
    
    for (let layer = 0; layer < n; layer++) {
      const layerPattern = [];
      for (let i = 0; i < currentOdd; i++) {
        layerPattern.push({
          id: `${layer}-${i}`,
          value: currentOdd,
          layer: layer,
          position: i
        });
      }
      pattern.push(layerPattern);
      currentOdd += 2;
    }
    
    return pattern;
  };

  const squarePattern = generateSquarePattern(currentSquare);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🔲 Odd Numbers → Square Numbers
        </h3>
        <p className="text-gray-600 mb-4">
          Discover the beautiful pattern: adding consecutive odd numbers creates perfect squares!
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          onClick={handlePrevious}
          disabled={currentSquare <= 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentSquare >= maxSquares}
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
          onClick={() => setShowFormula(!showFormula)}
          variant={showFormula ? "default" : "outline"}
          size="sm"
        >
          <Square className="w-4 h-4 mr-1" />
          Formula
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mathematical Representation */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Odd Numbers</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {oddNumbers.map((num, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                    index === oddNumbers.length - 1
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="text-sm text-blue-700">
              <strong>Sum:</strong> {oddNumbers.join(' + ')} = {sum}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">Square Number</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">
                {currentSquare}² = {squareNumber}
              </div>
              <div className="text-sm text-green-700">
                {sum === squareNumber ? '✅ Perfect match!' : '❌ Not equal'}
              </div>
            </div>
          </div>

          {showFormula && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Formula</h4>
              <div className="text-center space-y-2">
                <div className="text-lg font-mono text-purple-800">
                  1 + 3 + 5 + ... + (2n-1) = n²
                </div>
                <div className="text-sm text-purple-700">
                  For n = {currentSquare}: 1 + 3 + 5 + ... + {2 * currentSquare - 1} = {currentSquare}²
                </div>
              </div>
            </div>
          )}

          {/* Pattern Examples */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Pattern Examples</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <div>1 = 1²</div>
              <div>1 + 3 = 4 = 2²</div>
              <div>1 + 3 + 5 = 9 = 3²</div>
              <div>1 + 3 + 5 + 7 = 16 = 4²</div>
              <div>1 + 3 + 5 + 7 + 9 = 25 = 5²</div>
            </div>
          </div>
        </div>

        {/* Visual Representation */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-center">Visual Pattern</h4>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentSquare}, 1fr)` }}>
              {squarePattern.flat().map((dot, index) => {
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
                const colorClass = colors[dot.layer % colors.length];
                
                return (
                  <div
                    key={dot.id}
                    className={`w-6 h-6 ${colorClass} rounded-sm flex items-center justify-center text-white text-xs font-bold transition-all duration-500`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {dot.value}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h5 className="font-semibold text-indigo-900 mb-2">🎯 Why This Works</h5>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Each layer adds an odd number of dots</li>
              <li>• Layer 1: 1 dot (odd)</li>
              <li>• Layer 2: 3 dots (odd)</li>
              <li>• Layer 3: 5 dots (odd)</li>
              <li>• This creates perfect squares!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentSquare} / {maxSquares}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentSquare / maxSquares) * 100}%` }}
          />
        </div>
      </div>

      {/* Educational Notes */}
      <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
        <h5 className="font-semibold text-pink-900 mb-2">💡 Amazing Facts</h5>
        <ul className="text-sm text-pink-800 space-y-1">
          <li>• This pattern was known to ancient mathematicians</li>
          <li>• It's a special case of the sum of arithmetic sequences</li>
          <li>• The visual proof shows why squares are "square"!</li>
          <li>• Try it with any number - it always works!</li>
        </ul>
      </div>
    </div>
  );
};

export default OddToSquareVisualizer;
