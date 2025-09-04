import React, { useState, useEffect } from 'react';

interface SymmetryVisualizerProps {
  shape?: 'square' | 'rectangle' | 'triangle' | 'circle' | 'butterfly' | 'heart' | 'star';
  onComplete?: (isCorrect: boolean, linesFound: number) => void;
  showHint?: boolean;
}

interface SymmetryLine {
  id: string;
  type: 'vertical' | 'horizontal' | 'diagonal';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  description: string;
}

interface Shape {
  type: string;
  name: string;
  symmetryLines: SymmetryLine[];
  svgPath: string;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const shapes: Shape[] = [
    {
      type: 'square',
      name: 'Square',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' },
        { id: 'h1', type: 'horizontal', x1: 50, y1: 100, x2: 150, y2: 100, description: 'Horizontal line through center' },
        { id: 'd1', type: 'diagonal', x1: 50, y1: 50, x2: 150, y2: 150, description: 'Diagonal from top-left to bottom-right' },
        { id: 'd2', type: 'diagonal', x1: 150, y1: 50, x2: 50, y2: 150, description: 'Diagonal from top-right to bottom-left' }
      ],
      svgPath: 'M 50 50 L 150 50 L 150 150 L 50 150 Z',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'rectangle',
      name: 'Rectangle',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' },
        { id: 'h1', type: 'horizontal', x1: 50, y1: 100, x2: 150, y2: 100, description: 'Horizontal line through center' }
      ],
      svgPath: 'M 50 50 L 150 50 L 150 150 L 50 150 Z',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'triangle',
      name: 'Equilateral Triangle',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' },
        { id: 'd1', type: 'diagonal', x1: 50, y1: 150, x2: 125, y2: 100, description: 'Line from left base to right side' },
        { id: 'd2', type: 'diagonal', x1: 150, y1: 150, x2: 75, y2: 100, description: 'Line from right base to left side' }
      ],
      svgPath: 'M 100 50 L 50 150 L 150 150 Z',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'circle',
      name: 'Circle',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' },
        { id: 'h1', type: 'horizontal', x1: 50, y1: 100, x2: 150, y2: 100, description: 'Horizontal line through center' },
        { id: 'd1', type: 'diagonal', x1: 50, y1: 50, x2: 150, y2: 150, description: 'Diagonal from top-left to bottom-right' },
        { id: 'd2', type: 'diagonal', x1: 150, y1: 50, x2: 50, y2: 150, description: 'Diagonal from top-right to bottom-left' }
      ],
      svgPath: 'M 50 100 A 50 50 0 1 1 150 100 A 50 50 0 1 1 50 100',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'butterfly',
      name: 'Butterfly',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' }
      ],
      svgPath: 'M 50 100 Q 100 50 150 100 Q 100 150 50 100',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'heart',
      name: 'Heart',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 50, x2: 100, y2: 150, description: 'Vertical line through center' }
      ],
      svgPath: 'M 100 150 Q 50 100 50 75 Q 50 50 100 75 Q 150 50 150 75 Q 150 100 100 150',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    },
    {
      type: 'star',
      name: '5-Point Star',
      symmetryLines: [
        { id: 'v1', type: 'vertical', x1: 100, y1: 20, x2: 100, y2: 180, description: 'Vertical line through center' },
        { id: 'd1', type: 'diagonal', x1: 60, y1: 40, x2: 140, y2: 160, description: 'Diagonal line 1' },
        { id: 'd2', type: 'diagonal', x1: 140, y1: 40, x2: 60, y2: 160, description: 'Diagonal line 2' },
        { id: 'd3', type: 'diagonal', x1: 20, y1: 100, x2: 180, y2: 100, description: 'Horizontal line through center' },
        { id: 'd4', type: 'diagonal', x1: 40, y1: 160, x2: 160, y2: 40, description: 'Diagonal line 3' }
      ],
      svgPath: 'M 100 20 L 120 80 L 180 80 L 130 120 L 150 180 L 100 140 L 50 180 L 70 120 L 20 80 L 80 80 Z',
      width: 200,
      height: 200,
      centerX: 100,
      centerY: 100
    }
  ];

const SymmetryVisualizer: React.FC<SymmetryVisualizerProps> = ({
  shape,
  onComplete,
  showHint = true
}) => {
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [revealedLines, setRevealedLines] = useState<Set<string>>(new Set());
  const [showAllLines, setShowAllLines] = useState(false);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (shape) {
      const selectedShape = shapes.find(s => s.type === shape);
      if (selectedShape) {
        setCurrentShape(selectedShape);
      }
    } else {
      // Select a random shape
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentShape(randomShape);
    }
    setRevealedLines(new Set());
    setShowAllLines(false);
    setUserGuess(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [shape]);

  const handleRevealLine = (lineId: string) => {
    if (showAllLines) return;
    
    const newRevealedLines = new Set(revealedLines);
    newRevealedLines.add(lineId);
    setRevealedLines(newRevealedLines);
  };

  const handleShowAllLines = () => {
    setShowAllLines(true);
    setRevealedLines(new Set(currentShape?.symmetryLines.map(l => l.id) || []));
  };

  const handleGuessSubmit = () => {
    if (userGuess === null || !currentShape) return;
    
    const correct = userGuess === currentShape.symmetryLines.length;
    setIsCorrect(correct);
    setShowResult(true);
    onComplete?.(correct, userGuess);
  };

  const generateNewShape = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(randomShape);
    setRevealedLines(new Set());
    setShowAllLines(false);
    setUserGuess(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getLineColor = (line: SymmetryLine) => {
    if (line.type === 'vertical') return '#ef4444';
    if (line.type === 'horizontal') return '#3b82f6';
    if (line.type === 'diagonal') return '#10b981';
    return '#6b7280';
  };

  if (!currentShape) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🦋 Symmetry Visualizer
        </h3>
        <p className="text-gray-600 mb-4">
          Click on the shape to reveal lines of symmetry, or make a guess first!
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700">
            {currentShape.name}
          </h4>
          <button
            onClick={generateNewShape}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Shape
          </button>
        </div>

        {/* Shape visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg
              width={currentShape.width}
              height={currentShape.height}
              className="border border-gray-300 bg-gray-50"
              onClick={() => handleShowAllLines()}
            >
              {/* Shape */}
              <path
                d={currentShape.svgPath}
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="2"
                className="cursor-pointer hover:fill-blue-400 transition-colors"
              />
              
              {/* Symmetry lines */}
              {currentShape.symmetryLines.map((line) => {
                const isRevealed = showAllLines || revealedLines.has(line.id);
                return (
                  <line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={getLineColor(line)}
                    strokeWidth="3"
                    strokeDasharray={isRevealed ? "0" : "5,5"}
                    opacity={isRevealed ? 1 : 0.3}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Guess section */}
        {!showResult && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many lines of symmetry does this shape have?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={userGuess || ''}
                onChange={(e) => setUserGuess(parseInt(e.target.value) || null)}
                min="0"
                max="10"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your guess"
              />
              <button
                onClick={handleGuessSubmit}
                disabled={userGuess === null}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Guess
              </button>
            </div>
          </div>
        )}

        {/* Reveal buttons */}
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleShowAllLines}
              disabled={showAllLines}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              {showAllLines ? 'All Lines Revealed' : 'Reveal All Lines'}
            </button>
          </div>

          {/* Individual line reveal buttons */}
          {!showAllLines && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currentShape.symmetryLines.map((line, index) => (
                <button
                  key={line.id}
                  onClick={() => handleRevealLine(line.id)}
                  disabled={revealedLines.has(line.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    revealedLines.has(line.id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Line {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Revealed lines info */}
        {revealedLines.size > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-700 mb-3">Revealed Lines:</h5>
            <div className="space-y-2">
              {currentShape.symmetryLines
                .filter(line => revealedLines.has(line.id))
                .map((line) => (
                  <div key={line.id} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-0.5"
                      style={{ backgroundColor: getLineColor(line) }}
                    />
                    <span className="text-sm text-gray-600">{line.description}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Result feedback */}
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
            <p className="text-gray-700">
              {isCorrect 
                ? `Great job! The ${currentShape.name} has ${currentShape.symmetryLines.length} lines of symmetry.${currentShape.type === 'circle' ? ' (Actually, a circle has infinite lines of symmetry, but we\'re showing the main ones!)' : ''}`
                : `The ${currentShape.name} has ${currentShape.symmetryLines.length} lines of symmetry. Your guess was ${userGuess}.${currentShape.type === 'circle' ? ' (Actually, a circle has infinite lines of symmetry, but we\'re showing the main ones!)' : ''}`
              }
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-700 mb-3">Line Types:</h5>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-red-500"></div>
              <span>Vertical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span>Horizontal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-green-500"></div>
              <span>Diagonal</span>
            </div>
          </div>
        </div>

        {showHint && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Hint:</strong> A line of symmetry divides a shape into two identical halves. 
              Try folding the shape along the line - both sides should match perfectly!
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>Remember:</strong> 
              • Square = 4 lines, Rectangle = 2 lines, Triangle = 3 lines
              • Circle = infinite lines (we show 4 main ones)
              • Star = 5 lines, Butterfly/Heart = 1 line
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymmetryVisualizer;
