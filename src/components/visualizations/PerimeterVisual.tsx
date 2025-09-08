import React from 'react';
import { motion } from 'framer-motion';

export interface PerimeterVisualProps {
  shape: 'rectangle' | 'square' | 'triangle' | 'polygon';
  dimensions: number[];
  unit?: string;
  showGrid?: boolean;
  className?: string;
}

const PerimeterVisual: React.FC<PerimeterVisualProps> = ({
  shape,
  dimensions,
  unit = 'cm',
  showGrid = true,
  className = '',
}) => {

  const calculatePerimeter = () => {
    switch (shape) {
      case 'rectangle':
        return 2 * (dimensions[0] + dimensions[1]);
      case 'square':
        return 4 * dimensions[0];
      case 'triangle':
        return dimensions.reduce((sum, dim) => sum + dim, 0);
      case 'polygon':
        return dimensions.reduce((sum, dim) => sum + dim, 0);
      default:
        return 0;
    }
  };

  const renderRectangle = () => {
    const [width, height] = dimensions;
    
    // Adaptive scaling to fit within reasonable bounds
    const maxDimension = Math.max(width, height);
    const maxDisplaySize = 200; // Maximum display size in pixels
    const scale = Math.min(4, maxDisplaySize / maxDimension);
    
    // For very large dimensions, use more aggressive scaling
    const finalScale = maxDimension > 50 ? Math.min(scale, 1) : scale;
    const scaledWidth = width * finalScale;
    const scaledHeight = height * finalScale;
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${Math.max(scaledWidth + 40, 240)} ${Math.max(scaledHeight + 40, 200)}`} className="w-full h-64">
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
            fillOpacity="0.2"
            stroke="#3b82f6"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Width dimension */}
          <motion.line
            x1="20"
            y1="20"
            x2="20 + scaledWidth"
            y2="20"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.text
            x="20 + scaledWidth/2"
            y="15"
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {width} {unit}
          </motion.text>
          
          {/* Height dimension */}
          <motion.line
            x1="20 + scaledWidth"
            y1="20"
            x2="20 + scaledWidth"
            y2="20 + scaledHeight"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.text
            x="20 + scaledWidth + 15"
            y="20 + scaledHeight/2"
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {height} {unit}
          </motion.text>
          
          {/* Perimeter highlight */}
          <motion.rect
            x="20"
            y="20"
            width={scaledWidth}
            height={scaledHeight}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </svg>
      </div>
    );
  };

  const renderSquare = () => {
    const [side] = dimensions;
    
    // Adaptive scaling to fit within reasonable bounds
    const maxDisplaySize = 200; // Maximum display size in pixels
    const scale = Math.min(4, maxDisplaySize / side);
    
    // For very large dimensions, use more aggressive scaling
    const finalScale = side > 50 ? Math.min(scale, 1) : scale;
    const scaledSide = side * finalScale;
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${Math.max(scaledSide + 40, 240)} ${Math.max(scaledSide + 40, 200)}`} className="w-full h-64">
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
            fillOpacity="0.2"
            stroke="#8b5cf6"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Side dimension */}
          <motion.line
            x1="20"
            y1="20"
            x2="20 + scaledSide"
            y2="20"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.text
            x="20 + scaledSide/2"
            y="15"
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {side} {unit}
          </motion.text>
          
          {/* Perimeter highlight */}
          <motion.rect
            x="20"
            y="20"
            width={scaledSide}
            height={scaledSide}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </svg>
      </div>
    );
  };

  const renderTriangle = () => {
    const [a, b, c] = dimensions;
    
    // Adaptive scaling to fit within reasonable bounds
    const maxSide = Math.max(a, b, c);
    const maxDisplaySize = 150; // Maximum display size in pixels
    const scale = Math.min(2, maxDisplaySize / maxSide);
    
    // For very large dimensions, use more aggressive scaling
    const finalScale = maxSide > 50 ? Math.min(scale, 0.5) : scale;
    const scaledB = b * finalScale;
    const scaledC = c * finalScale;
    
    // Calculate triangle vertices using law of cosines
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const x1 = 50;
    const y1 = 50;
    const x2 = x1 + scaledC;
    const y2 = y1;
    const x3 = x1 + scaledB * Math.cos(angleA);
    const y3 = y1 - scaledB * Math.sin(angleA);
    
    return (
      <div className="relative">
        <svg viewBox="0 0 200 150" className="w-full h-64">
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
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="#f59e0b"
            fillOpacity="0.2"
            stroke="#f59e0b"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Side labels */}
          <motion.text
            x={(x1 + x2) / 2}
            y={y1 + 15}
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {a} {unit}
          </motion.text>
          
          <motion.text
            x={(x2 + x3) / 2 + 10}
            y={(y2 + y3) / 2}
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {b} {unit}
          </motion.text>
          
          <motion.text
            x={(x1 + x3) / 2 - 10}
            y={(y1 + y3) / 2}
            textAnchor="middle"
            className="text-[10px] font-medium fill-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {c} {unit}
          </motion.text>
          
          {/* Perimeter highlight */}
          <motion.polygon
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          />
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
      default:
        return renderRectangle();
    }
  };

  const perimeter = calculatePerimeter();
  const maxDimension = Math.max(...dimensions);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {shape.charAt(0).toUpperCase() + shape.slice(1)} Perimeter
        </h3>
        <div className="text-sm text-gray-600">
          Dimensions: {dimensions.join(' × ')} {unit}
          {maxDimension > 50 && (
            <div className="text-xs text-gray-500 mt-1">
              (Visualization scaled down for display)
            </div>
          )}
        </div>
      </div>
      
      {renderShape()}
      
      <motion.div
        className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="text-lg font-bold text-green-800">
          Perimeter = {perimeter} {unit}
        </div>
        <div className="text-sm text-green-600 mt-1">
          {shape === 'rectangle' && `Formula: 2 × (${dimensions[0]} + ${dimensions[1]}) = 2 × ${dimensions[0] + dimensions[1]} = ${perimeter}`}
          {shape === 'square' && `Formula: 4 × ${dimensions[0]} = ${perimeter}`}
          {shape === 'triangle' && `Formula: ${dimensions.join(' + ')} = ${perimeter}`}
        </div>
      </motion.div>
    </div>
  );
};

export default PerimeterVisual;
