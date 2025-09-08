import React, { useState } from 'react';

interface PerimeterAreaComparisonProps {
  className?: string;
}

interface Shape {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
  colorClass: string;
}

const PerimeterAreaComparison: React.FC<PerimeterAreaComparisonProps> = ({ className = '' }) => {
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: 'rectangle',
      name: 'Rectangle A',
      width: 6,
      height: 4,
      color: '#3b82f6',
      colorClass: 'blue'
    },
    {
      id: 'square',
      name: 'Square B',
      width: 5,
      height: 5,
      color: '#8b5cf6',
      colorClass: 'purple'
    }
  ]);

  const updateShape = (shapeId: string, dimension: 'width' | 'height', value: number) => {
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, [dimension]: Math.max(1, Math.min(20, value)) } // Clamp between 1 and 20
        : shape
    ));
  };

  // Calculate scaling factor to fit shapes in a reasonable viewBox
  const maxDimension = Math.max(...shapes.map(s => Math.max(s.width, s.height)));
  const baseScaleFactor = 15; // pixels per cm
  const maxDisplaySize = 200; // Maximum display size in pixels
  
  // Adaptive scaling for large dimensions
  const scaleFactor = maxDimension > 20 ? Math.min(baseScaleFactor, maxDisplaySize / maxDimension) : baseScaleFactor;
  const viewBoxSize = Math.max(maxDimension * scaleFactor + 40, 240); // Add padding, minimum size

  const calculatePerimeter = (width: number, height: number) => 2 * (width + height);
  const calculateArea = (width: number, height: number) => width * height;
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎯 Shape Comparison Challenge
        </h3>
        <p className="text-gray-600 mb-6">
          Compare different shapes and their perimeters and areas! Adjust the dimensions below to see how it affects the calculations.
        </p>
        {maxDimension > 20 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> Large dimensions are scaled down for better visualization. The actual calculations remain accurate.
            </p>
          </div>
        )}

        {/* Interactive Controls */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-4">🎛️ Adjust Dimensions</h4>
          <div className="grid grid-cols-2 gap-6">
            {shapes.map((shape) => (
              <div key={shape.id} className="space-y-3">
                <h5 className="font-medium text-gray-700">{shape.name}</h5>
                
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">
                    Width: {shape.width} cm
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={shape.width}
                    onChange={(e) => updateShape(shape.id, 'width', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${shape.color} 0%, ${shape.color} ${(shape.width - 1) / 19 * 100}%, #e5e7eb ${(shape.width - 1) / 19 * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">
                    Height: {shape.height} cm
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={shape.height}
                    onChange={(e) => updateShape(shape.id, 'height', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${shape.color} 0%, ${shape.color} ${(shape.height - 1) / 19 * 100}%, #e5e7eb ${(shape.height - 1) / 19 * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {shapes.map((shape) => {
            const scaledWidth = shape.width * scaleFactor;
            const scaledHeight = shape.height * scaleFactor;
            const perimeter = calculatePerimeter(shape.width, shape.height);
            const area = calculateArea(shape.width, shape.height);
            const centerX = viewBoxSize / 2;
            const centerY = viewBoxSize / 2;
            const rectX = centerX - scaledWidth / 2;
            const rectY = centerY - scaledHeight / 2;

            return (
              <div key={shape.id} className={`p-4 rounded-lg border-2 border-gray-200 transition-colors ${
                shape.colorClass === 'blue' ? 'hover:border-blue-300' : 'hover:border-purple-300'
              }`}>
                <h4 className="font-semibold text-gray-800 mb-3">
                  {shape.name} ({shape.width}cm × {shape.height}cm)
                </h4>
                
                {/* Visual representation */}
                <div className="flex justify-center mb-4">
                  <svg 
                    viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
                    className="w-40 h-40"
                  >
                    {/* Grid pattern */}
                    <defs>
                      <pattern 
                        id={`grid-${shape.id}`} 
                        width={scaleFactor} 
                        height={scaleFactor} 
                        patternUnits="userSpaceOnUse"
                      >
                        <path 
                          d={`M ${scaleFactor} 0 L 0 0 0 ${scaleFactor}`} 
                          fill="none" 
                          stroke={shape.color} 
                          strokeWidth="0.5" 
                          opacity="0.3"
                        />
                      </pattern>
                    </defs>
                    
                    {/* Shape fill with grid */}
                    <rect
                      x={rectX}
                      y={rectY}
                      width={scaledWidth}
                      height={scaledHeight}
                      fill={`url(#grid-${shape.id})`}
                      stroke={shape.color}
                      strokeWidth="2"
                    />
                    
                    {/* Perimeter highlight */}
                    <rect
                      x={rectX}
                      y={rectY}
                      width={scaledWidth}
                      height={scaledHeight}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Dimension labels */}
                    <text 
                      x={centerX} 
                      y={rectY - 5} 
                      textAnchor="middle" 
                      className="text-xs fill-gray-600 font-medium"
                    >
                      {shape.width} cm
                    </text>
                    <text 
                      x={rectX + scaledWidth + 5} 
                      y={centerY} 
                      textAnchor="middle" 
                      className="text-xs fill-gray-600 font-medium"
                      transform={`rotate(90 ${rectX + scaledWidth + 5} ${centerY})`}
                    >
                      {shape.height} cm
                    </text>
                    
                    {/* Area unit squares indicator */}
                    <text 
                      x={centerX} 
                      y={rectY + scaledHeight + 15} 
                      textAnchor="middle" 
                      className="text-xs fill-gray-500"
                    >
                      Each square = 1 cm²
                    </text>
                  </svg>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-blue-600">
                    Perimeter: {perimeter} cm
                  </p>
                  <p className="text-sm text-green-600">
                    Area: {area} cm²
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Chart */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">📊 Visual Comparison</h4>
          <div className="flex justify-center space-x-8">
            {/* Perimeter comparison */}
            <div className="text-center">
              <h5 className="text-sm font-medium text-blue-600 mb-2">
                Perimeter ({shapes.map(s => calculatePerimeter(s.width, s.height)).join(' cm, ')} cm)
              </h5>
              <div className="flex items-end space-x-2">
                {shapes.map((shape, index) => (
                  <div key={shape.id} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        shape.colorClass === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                    >
                      <span className="text-white text-xs font-bold">{String.fromCharCode(65 + index)}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{calculatePerimeter(shape.width, shape.height)} cm</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {shapes.every(s => calculatePerimeter(s.width, s.height) === calculatePerimeter(shapes[0].width, shapes[0].height)) 
                  ? "Same perimeter!" 
                  : "Different perimeters!"}
              </p>
            </div>
            
            {/* Area comparison */}
            <div className="text-center">
              <h5 className="text-sm font-medium text-green-600 mb-2">Area</h5>
              <div className="flex items-end space-x-2">
                {shapes.map((shape, index) => {
                  const area = calculateArea(shape.width, shape.height);
                  const maxArea = Math.max(...shapes.map(s => calculateArea(s.width, s.height)));
                  const heightRatio = area / maxArea;
                  const barHeight = Math.max(20, heightRatio * 40); // Minimum 20px height
                  
                  return (
                    <div key={shape.id} className="flex flex-col items-center">
                      <div 
                        className={`w-8 rounded flex items-center justify-center ${
                          shape.colorClass === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      >
                        <span className="text-white text-xs font-bold">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{area} cm²</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {shapes[1] && calculateArea(shapes[1].width, shapes[1].height) > calculateArea(shapes[0].width, shapes[0].height)
                  ? "Square B has more area!" 
                  : "Rectangle A has more area!"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Key Insight:</h4>
          <p className="text-sm text-yellow-700">
            {(() => {
              const perimeters = shapes.map(s => calculatePerimeter(s.width, s.height));
              const areas = shapes.map(s => calculateArea(s.width, s.height));
              const samePerimeter = perimeters.every(p => p === perimeters[0]);
              const maxArea = Math.max(...areas);
              const maxAreaShape = shapes[areas.indexOf(maxArea)];
              
              if (samePerimeter) {
                return `Both shapes have the same perimeter (${perimeters[0]} cm) but different areas! 
                The ${maxAreaShape.name.toLowerCase()} has a larger area (${maxArea} cm² vs ${Math.min(...areas)} cm²) even though the perimeter is the same.
                This shows that for a given perimeter, a square gives you the maximum area!`;
              } else {
                return `These shapes have different perimeters (${perimeters.join(' cm and ')} cm) and different areas (${areas.join(' cm² and ')} cm²).
                Notice how the shape with the larger area might not necessarily have the larger perimeter!`;
              }
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerimeterAreaComparison;
