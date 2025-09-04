import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface FractionVisualProps {
  numerator: number;
  denominator: number;
  type?: 'pizza' | 'circle' | 'rectangle' | 'bar';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onFractionChange?: (numerator: number, denominator: number) => void;
  className?: string;
}

const FractionVisual: React.FC<FractionVisualProps> = ({
  numerator,
  denominator,
  type = 'pizza',
  size = 'md',
  interactive = false,
  onFractionChange,
  className = '',
}) => {
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const handleSliceClick = (sliceIndex: number) => {
    if (!interactive) return;
    
    const newSelected = selectedSlices.includes(sliceIndex)
      ? selectedSlices.filter(i => i !== sliceIndex)
      : [...selectedSlices, sliceIndex];
    
    setSelectedSlices(newSelected);
    
    if (onFractionChange) {
      onFractionChange(newSelected.length, denominator);
    }
  };

  const renderPizza = () => {
    const slices = [];
    const anglePerSlice = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerSlice;
      const endAngle = (i + 1) * anglePerSlice;
      const isSelected = selectedSlices.includes(i) || (!interactive && i < numerator);
      const isHighlighted = !interactive && i < numerator;
      
      slices.push(
        <motion.path
          key={i}
          d={`M 0 0 L ${Math.cos(startAngle * Math.PI / 180) * 50} ${Math.sin(startAngle * Math.PI / 180) * 50} A 50 50 0 0 1 ${Math.cos(endAngle * Math.PI / 180) * 50} ${Math.sin(endAngle * Math.PI / 180) * 50} Z`}
          fill={isSelected ? '#f59e0b' : isHighlighted ? '#fbbf24' : '#e5e7eb'}
          stroke="#374151"
          strokeWidth="2"
          className={interactive ? 'cursor-pointer hover:opacity-80' : ''}
          onClick={() => handleSliceClick(i)}
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
      );
    }
    
    return (
      <svg viewBox="-60 -60 120 120" className="w-full h-full">
        {slices}
        <circle cx="0" cy="0" r="2" fill="#374151" />
      </svg>
    );
  };

  const renderCircle = () => {
    const slices = [];
    const anglePerSlice = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerSlice;
      const endAngle = (i + 1) * anglePerSlice;
      const isSelected = selectedSlices.includes(i) || (!interactive && i < numerator);
      
      slices.push(
        <motion.path
          key={i}
          d={`M 0 0 L ${Math.cos(startAngle * Math.PI / 180) * 50} ${Math.sin(startAngle * Math.PI / 180) * 50} A 50 50 0 0 1 ${Math.cos(endAngle * Math.PI / 180) * 50} ${Math.sin(endAngle * Math.PI / 180) * 50} Z`}
          fill={isSelected ? '#3b82f6' : '#e5e7eb'}
          stroke="#374151"
          strokeWidth="1"
          className={interactive ? 'cursor-pointer hover:opacity-80' : ''}
          onClick={() => handleSliceClick(i)}
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
      );
    }
    
    return (
      <svg viewBox="-60 -60 120 120" className="w-full h-full">
        {slices}
      </svg>
    );
  };

  const renderRectangle = () => {
    const rows = Math.ceil(Math.sqrt(denominator));
    const cols = Math.ceil(denominator / rows);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    const cells = [];
    for (let i = 0; i < denominator; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = col * cellWidth;
      const y = row * cellHeight;
      const isSelected = selectedSlices.includes(i) || (!interactive && i < numerator);
      
      cells.push(
        <motion.rect
          key={i}
          x={x}
          y={y}
          width={cellWidth}
          height={cellHeight}
          fill={isSelected ? '#10b981' : '#e5e7eb'}
          stroke="#374151"
          strokeWidth="1"
          className={interactive ? 'cursor-pointer hover:opacity-80' : ''}
          onClick={() => handleSliceClick(i)}
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        />
      );
    }
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {cells}
      </svg>
    );
  };

  const renderBar = () => {
    const barWidth = 100 / denominator;
    const bars = [];
    
    for (let i = 0; i < denominator; i++) {
      const x = i * barWidth;
      const isSelected = selectedSlices.includes(i) || (!interactive && i < numerator);
      
      bars.push(
        <motion.rect
          key={i}
          x={x}
          y="20"
          width={barWidth - 2}
          height="60"
          fill={isSelected ? '#8b5cf6' : '#e5e7eb'}
          stroke="#374151"
          strokeWidth="1"
          className={interactive ? 'cursor-pointer hover:opacity-80' : ''}
          onClick={() => handleSliceClick(i)}
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
      );
    }
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {bars}
      </svg>
    );
  };

  const renderVisual = () => {
    switch (type) {
      case 'pizza':
        return renderPizza();
      case 'circle':
        return renderCircle();
      case 'rectangle':
        return renderRectangle();
      case 'bar':
        return renderBar();
      default:
        return renderPizza();
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {renderVisual()}
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">
          {numerator}/{denominator}
        </div>
        <div className="text-sm text-gray-600">
          {numerator} out of {denominator} parts
        </div>
        {numerator > 0 && denominator > 0 && (
          <div className="text-sm text-gray-500">
            = {(numerator / denominator * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionVisual;
