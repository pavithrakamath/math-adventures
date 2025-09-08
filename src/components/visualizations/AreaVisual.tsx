import React from 'react';
import { motion } from 'framer-motion';

export interface AreaVisualProps {
  shape: 'rectangle' | 'square' | 'triangle' | 'circle';
  dimensions: number[];
  unit?: string;
  showGrid?: boolean;
  showFormula?: boolean;
  className?: string;
}

const AreaVisual: React.FC<AreaVisualProps> = ({
  shape = 'rectangle',
  dimensions = [5, 3],
  unit = 'cm',
  showGrid = true,
  showFormula = true,
  className = '',
}) => {
  const calculateArea = () => {
    switch (shape) {
      case 'rectangle':
        return dimensions[0] * dimensions[1];
      case 'square':
        return dimensions[0] * dimensions[0];
      case 'triangle':
        return (dimensions[0] * dimensions[1]) / 2;
      case 'circle':
        return Math.PI * dimensions[0] * dimensions[0];
      default:
        return 0;
    }
  };

  const renderRectangle = () => {
    const [width, height] = dimensions;
    const scale = 4;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${scaledWidth + 40} ${scaledHeight + 40}`} className="w-full h-64">
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}
          
          {/* Rectangle */}
          <motion.rect
            x="20"
            y="20"
            width={scaledWidth}
            height={scaledHeight}
            fill="#3b82f6"
            fillOpacity="0.3"
            stroke="#3b82f6"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Grid lines inside rectangle */}
          {showGrid && (
            <>
              {Array.from({ length: Math.floor(scaledWidth / 20) }, (_, i) => (
                <motion.line
                  key={`v-${i}`}
                  x1={20 + (i + 1) * 20}
                  y1="20"
                  x2={20 + (i + 1) * 20}
                  y2={20 + scaledHeight}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                />
              ))}
              {Array.from({ length: Math.floor(scaledHeight / 20) }, (_, i) => (
                <motion.line
                  key={`h-${i}`}
                  x1="20"
                  y1={20 + (i + 1) * 20}
                  x2={20 + scaledWidth}
                  y2={20 + (i + 1) * 20}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                />
              ))}
            </>
          )}
          
          {/* Dimensions */}
          <motion.text
            x="20 + scaledWidth/2"
            y="15"
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {width} {unit}
          </motion.text>
          
          <motion.text
            x="20 + scaledWidth + 15"
            y="20 + scaledHeight/2"
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {height} {unit}
          </motion.text>
        </svg>
      </div>
    );
  };

  const renderSquare = () => {
    const [side] = dimensions;
    const scale = 4;
    const scaledSide = side * scale;
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${scaledSide + 40} ${scaledSide + 40}`} className="w-full h-64">
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}
          
          {/* Square */}
          <motion.rect
            x="20"
            y="20"
            width={scaledSide}
            height={scaledSide}
            fill="#8b5cf6"
            fillOpacity="0.3"
            stroke="#8b5cf6"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Grid lines inside square */}
          {showGrid && (
            <>
              {Array.from({ length: Math.floor(scaledSide / 20) }, (_, i) => (
                <motion.line
                  key={`v-${i}`}
                  x1={20 + (i + 1) * 20}
                  y1="20"
                  x2={20 + (i + 1) * 20}
                  y2={20 + scaledSide}
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                />
              ))}
              {Array.from({ length: Math.floor(scaledSide / 20) }, (_, i) => (
                <motion.line
                  key={`h-${i}`}
                  x1="20"
                  y1={20 + (i + 1) * 20}
                  x2={20 + scaledSide}
                  y2={20 + (i + 1) * 20}
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                />
              ))}
            </>
          )}
          
          {/* Side dimension */}
          <motion.text
            x="20 + scaledSide/2"
            y="15"
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {side} {unit}
          </motion.text>
        </svg>
      </div>
    );
  };

  const renderTriangle = () => {
    const [base, height] = dimensions;
    const scale = 3;
    const scaledBase = base * scale;
    const scaledHeight = height * scale;
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${scaledBase + 40} ${scaledHeight + 40}`} className="w-full h-64">
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}
          
          {/* Triangle */}
          <motion.polygon
            points={`20,${20 + scaledHeight} ${20 + scaledBase},${20 + scaledHeight} ${20 + scaledBase/2},${20}`}
            fill="#f59e0b"
            fillOpacity="0.3"
            stroke="#f59e0b"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Base dimension */}
          <motion.line
            x1="20"
            y1={20 + scaledHeight + 10}
            x2={20 + scaledBase}
            y2={20 + scaledHeight + 10}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.text
            x="20 + scaledBase/2"
            y={20 + scaledHeight + 25}
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {base} {unit}
          </motion.text>
          
          {/* Height dimension */}
          <motion.line
            x1={20 + scaledBase + 10}
            y1={20 + scaledHeight}
            x2={20 + scaledBase + 10}
            y2={20}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.text
            x={20 + scaledBase + 25}
            y={20 + scaledHeight/2}
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {height} {unit}
          </motion.text>
        </svg>
      </div>
    );
  };

  const renderCircle = () => {
    const [radius] = dimensions;
    const scale = 2;
    const scaledRadius = radius * scale;
    const centerX = 100;
    const centerY = 100;
    
    return (
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-full h-64">
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}
          
          {/* Circle */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={scaledRadius}
            fill="#10b981"
            fillOpacity="0.3"
            stroke="#10b981"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Radius line */}
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={centerX + scaledRadius}
            y2={centerY}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.text
            x={centerX + scaledRadius/2}
            y={centerY - 10}
            textAnchor="middle"
            className="text-sm font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            r = {radius} {unit}
          </motion.text>
        </svg>
      </div>
    );
  };

  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return renderRectangle();
      case 'square':
        return renderSquare();
      case 'triangle':
        return renderTriangle();
      case 'circle':
        return renderCircle();
      default:
        return renderRectangle();
    }
  };

  const area = calculateArea();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {shape.charAt(0).toUpperCase() + shape.slice(1)} Area
        </h3>
        <div className="text-sm text-gray-600">
          Dimensions: {dimensions.join(' × ')} {unit}
        </div>
      </div>
      
      {renderShape()}
      
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div className="text-lg font-bold text-blue-800">
          Area = {area.toFixed(2)} {unit}²
        </div>
        {showFormula && (
          <div className="text-sm text-blue-600 mt-1">
            {shape === 'rectangle' && `Formula: ${dimensions[0]} × ${dimensions[1]} = ${area}`}
            {shape === 'square' && `Formula: ${dimensions[0]} × ${dimensions[0]} = ${area}`}
            {shape === 'triangle' && `Formula: (${dimensions[0]} × ${dimensions[1]}) ÷ 2 = ${area}`}
            {shape === 'circle' && `Formula: π × ${dimensions[0]}² = ${area.toFixed(2)}`}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AreaVisual;
