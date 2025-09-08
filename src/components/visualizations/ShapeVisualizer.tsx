import React, { useState, useEffect } from 'react';

interface ShapeVisualizerProps {
  shape?: 'rectangle' | 'square' | 'triangle' | 'circle';
  dimensions?: {
    length?: number;
    width?: number;
    side?: number;
    base?: number;
    height?: number;
    radius?: number;
  };
  onCalculation?: (perimeter: number, area: number) => void;
  showHint?: boolean;
}

interface Shape {
  type: 'rectangle' | 'square' | 'triangle' | 'circle';
  dimensions: {
    length?: number;
    width?: number;
    side?: number;
    base?: number;
    height?: number;
    radius?: number;
  };
  perimeter: number;
  area: number;
  color: string;
}

const ShapeVisualizer: React.FC<ShapeVisualizerProps> = ({
  shape = 'rectangle',
  dimensions,
  onCalculation,
  showHint = true
}) => {
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [viewMode, setViewMode] = useState<'perimeter' | 'area'>('perimeter');
  const [showCalculations, setShowCalculations] = useState(false);

  const generateRandomShape = (): Shape => {
    const shapes = ['rectangle', 'square', 'triangle', 'circle'] as const;
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    let newDimensions: Record<string, number> = {};
    let perimeter = 0;
    let area = 0;

    switch (randomShape) {
      case 'rectangle': {
        newDimensions = {
          length: Math.floor(Math.random() * 8) + 3,
          width: Math.floor(Math.random() * 6) + 2
        };
        perimeter = 2 * (newDimensions.length + newDimensions.width);
        area = newDimensions.length * newDimensions.width;
        break;
      }
      case 'square': {
        newDimensions = {
          side: Math.floor(Math.random() * 8) + 3
        };
        perimeter = 4 * newDimensions.side;
        area = newDimensions.side * newDimensions.side;
        break;
      }
      case 'triangle': {
        newDimensions = {
          base: Math.floor(Math.random() * 8) + 4,
          height: Math.floor(Math.random() * 6) + 3
        };
        // For right triangle, we'll calculate the hypotenuse
        const hypotenuse = Math.sqrt(newDimensions.base * newDimensions.base + newDimensions.height * newDimensions.height);
        perimeter = newDimensions.base + newDimensions.height + Math.round(hypotenuse);
        area = (newDimensions.base * newDimensions.height) / 2;
        break;
      }
      case 'circle': {
        newDimensions = {
          radius: Math.floor(Math.random() * 5) + 2
        };
        perimeter = Math.round(2 * Math.PI * newDimensions.radius * 10) / 10;
        area = Math.round(Math.PI * newDimensions.radius * newDimensions.radius * 10) / 10;
        break;
      }
    }

    return {
      type: randomShape,
      dimensions: newDimensions,
      perimeter,
      area,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
  };

  useEffect(() => {
    if (dimensions && shape) {
      let perimeter = 0;
      let area = 0;

      switch (shape) {
        case 'rectangle':
          perimeter = 2 * ((dimensions.length || 0) + (dimensions.width || 0));
          area = (dimensions.length || 0) * (dimensions.width || 0);
          break;
        case 'square':
          perimeter = 4 * (dimensions.side || 0);
          area = (dimensions.side || 0) * (dimensions.side || 0);
          break;
        case 'triangle': {
          const base = dimensions.base || 0;
          const height = dimensions.height || 0;
          const hypotenuse = Math.sqrt(base * base + height * height);
          perimeter = base + height + Math.round(hypotenuse);
          area = (base * height) / 2;
          break;
        }
        case 'circle': {
          const radius = dimensions.radius || 0;
          perimeter = Math.round(2 * Math.PI * radius * 10) / 10;
          area = Math.round(Math.PI * radius * radius * 10) / 10;
          break;
        }
      }

      setCurrentShape({
        type: shape,
        dimensions,
        perimeter,
        area,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    } else {
      setCurrentShape(generateRandomShape());
    }
  }, [shape, dimensions]);

  useEffect(() => {
    if (currentShape) {
      onCalculation?.(currentShape.perimeter, currentShape.area);
    }
  }, [currentShape, onCalculation]);

  const generateNewShape = () => {
    setCurrentShape(generateRandomShape());
    setShowCalculations(false);
  };

  const getShapeDescription = () => {
    if (!currentShape) return '';
    
    switch (currentShape.type) {
      case 'rectangle':
        return `Rectangle: ${currentShape.dimensions.length}cm × ${currentShape.dimensions.width}cm`;
      case 'square':
        return `Square: ${currentShape.dimensions.side}cm × ${currentShape.dimensions.side}cm`;
      case 'triangle':
        return `Triangle: base ${currentShape.dimensions.base}cm, height ${currentShape.dimensions.height}cm`;
      case 'circle':
        return `Circle: radius ${currentShape.dimensions.radius}cm`;
      default:
        return '';
    }
  };

  const getPerimeterFormula = () => {
    if (!currentShape) return '';
    
    switch (currentShape.type) {
      case 'rectangle':
        return `P = 2 × (l + w) = 2 × (${currentShape.dimensions.length} + ${currentShape.dimensions.width}) = ${currentShape.perimeter}cm`;
      case 'square':
        return `P = 4 × s = 4 × ${currentShape.dimensions.side} = ${currentShape.perimeter}cm`;
      case 'triangle':
        return `P = a + b + c = ${currentShape.dimensions.base} + ${currentShape.dimensions.height} + c = ${currentShape.perimeter}cm`;
      case 'circle':
        return `P = 2πr = 2 × π × ${currentShape.dimensions.radius} = ${currentShape.perimeter}cm`;
      default:
        return '';
    }
  };

  const getAreaFormula = () => {
    if (!currentShape) return '';
    
    switch (currentShape.type) {
      case 'rectangle':
        return `A = l × w = ${currentShape.dimensions.length} × ${currentShape.dimensions.width} = ${currentShape.area}cm²`;
      case 'square':
        return `A = s² = ${currentShape.dimensions.side}² = ${currentShape.area}cm²`;
      case 'triangle':
        return `A = ½ × b × h = ½ × ${currentShape.dimensions.base} × ${currentShape.dimensions.height} = ${currentShape.area}cm²`;
      case 'circle':
        return `A = πr² = π × ${currentShape.dimensions.radius}² = ${currentShape.area}cm²`;
      default:
        return '';
    }
  };

  if (!currentShape) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          📐 Shape Visualizer - Perimeter vs Area
        </h3>
        <p className="text-gray-600 mb-4">
          Toggle between perimeter and area to see the difference!
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700">
            {getShapeDescription()}
          </h4>
          <button
            onClick={generateNewShape}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Shape
          </button>
        </div>

        {/* Toggle buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setViewMode('perimeter')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'perimeter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📏 Show Perimeter
          </button>
          <button
            onClick={() => setViewMode('area')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'area'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎯 Show Area
          </button>
        </div>

        {/* Shape visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {currentShape.type === 'rectangle' && (
              <div
                className="relative border-4 border-gray-800"
                style={{
                  width: `${(currentShape.dimensions.length || 0) * 40}px`,
                  height: `${(currentShape.dimensions.width || 0) * 40}px`,
                  backgroundColor: viewMode === 'area' ? currentShape.color : 'transparent',
                  borderColor: viewMode === 'perimeter' ? '#ef4444' : '#374151',
                  borderWidth: viewMode === 'perimeter' ? '4px' : '2px'
                }}
              >
                {viewMode === 'perimeter' && (
                  <>
                    {/* Perimeter arrows */}
                    <div className="absolute -top-8 left-0 w-full flex justify-between">
                      <span className="text-red-600 font-bold">Length: {currentShape.dimensions.length}cm</span>
                    </div>
                    <div className="absolute -right-8 top-0 h-full flex flex-col justify-center">
                      <span className="text-red-600 font-bold transform -rotate-90">Width: {currentShape.dimensions.width}cm</span>
                    </div>
                  </>
                )}
                {viewMode === 'area' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Area</span>
                  </div>
                )}
              </div>
            )}

            {currentShape.type === 'square' && (
              <div
                className="relative border-4 border-gray-800"
                style={{
                  width: `${(currentShape.dimensions.side || 0) * 40}px`,
                  height: `${(currentShape.dimensions.side || 0) * 40}px`,
                  backgroundColor: viewMode === 'area' ? currentShape.color : 'transparent',
                  borderColor: viewMode === 'perimeter' ? '#ef4444' : '#374151',
                  borderWidth: viewMode === 'perimeter' ? '4px' : '2px'
                }}
              >
                {viewMode === 'perimeter' && (
                  <div className="absolute -top-8 left-0 w-full flex justify-center">
                    <span className="text-red-600 font-bold">Side: {currentShape.dimensions.side}cm</span>
                  </div>
                )}
                {viewMode === 'area' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Area</span>
                  </div>
                )}
              </div>
            )}

            {currentShape.type === 'triangle' && (
              <div className="relative">
                <svg
                  width="200"
                  height="150"
                  className="border border-gray-300"
                >
                  <polygon
                    points={`50,130 ${50 + (currentShape.dimensions.base || 0) * 20},130 ${50 + (currentShape.dimensions.base || 0) * 20},${130 - (currentShape.dimensions.height || 0) * 20}`}
                    fill={viewMode === 'area' ? currentShape.color : 'transparent'}
                    stroke={viewMode === 'perimeter' ? '#ef4444' : '#374151'}
                    strokeWidth={viewMode === 'perimeter' ? '4' : '2'}
                  />
                  {viewMode === 'perimeter' && (
                    <>
                      <text x="50" y="145" className="text-red-600 font-bold text-sm">Base: {currentShape.dimensions.base}cm</text>
                      <text x="120" y="80" className="text-red-600 font-bold text-sm">Height: {currentShape.dimensions.height}cm</text>
                    </>
                  )}
                  {viewMode === 'area' && (
                    <text x="100" y="80" className="text-white font-bold">Area</text>
                  )}
                </svg>
              </div>
            )}

            {currentShape.type === 'circle' && (
              <div className="relative">
                <div
                  className="border-4 border-gray-800 rounded-full"
                  style={{
                    width: `${(currentShape.dimensions.radius || 0) * 80}px`,
                    height: `${(currentShape.dimensions.radius || 0) * 80}px`,
                    backgroundColor: viewMode === 'area' ? currentShape.color : 'transparent',
                    borderColor: viewMode === 'perimeter' ? '#ef4444' : '#374151',
                    borderWidth: viewMode === 'perimeter' ? '4px' : '2px'
                  }}
                >
                  {viewMode === 'perimeter' && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <span className="text-red-600 font-bold">Radius: {currentShape.dimensions.radius}cm</span>
                    </div>
                  )}
                  {viewMode === 'area' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Area</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current mode explanation */}
        <div className={`p-4 rounded-lg mb-4 ${
          viewMode === 'perimeter' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">
              {viewMode === 'perimeter' ? '📏' : '🎯'}
            </span>
            <h4 className="text-lg font-bold">
              {viewMode === 'perimeter' ? 'Perimeter (Distance Around)' : 'Area (Space Inside)'}
            </h4>
          </div>
          <p className="text-gray-700">
            {viewMode === 'perimeter' 
              ? `The perimeter is the total distance around the shape: ${currentShape.perimeter}cm`
              : `The area is the space inside the shape: ${currentShape.area}cm²`
            }
          </p>
        </div>

        {/* Show calculations button */}
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mb-4"
        >
          {showCalculations ? 'Hide' : 'Show'} Calculations
        </button>

        {/* Calculations */}
        {showCalculations && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-700 mb-3">Calculations:</h5>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Perimeter:</strong> {getPerimeterFormula()}
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Area:</strong> {getAreaFormula()}
              </div>
            </div>
          </div>
        )}

        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Remember:</strong> Perimeter is measured in cm (distance), 
              while Area is measured in cm² (space). Toggle between the views to see the difference!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeVisualizer;
