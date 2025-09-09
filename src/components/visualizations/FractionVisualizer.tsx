import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Plus, Minus, Equal, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionVisualizerProps {
  // Basic visualization mode props
  numerator?: number;
  denominator?: number;
  mode?: 'visualization' | 'interactive' | 'operations';
  type?: 'pizza' | 'circle' | 'rectangle' | 'bar';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onFractionChange?: (numerator: number, denominator: number) => void;
  className?: string;
  
  // Operations mode props
  fraction1?: Fraction;
  fraction2?: Fraction;
  operation?: 'add' | 'subtract';
  
  // Legacy props for backward compatibility (from lesson data)
  [key: string]: unknown; // Allow any additional props for lesson data compatibility
}

const FractionBar = ({
  numerator,
  denominator,
  highlightColor,
  label,
}: {
  numerator: number;
  denominator: number;
  highlightColor: string;
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="flex w-64 h-10 overflow-hidden border-2 rounded-md border-foreground">
      {Array.from({ length: denominator }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 border-r border-foreground/50 last:border-r-0 transition-colors',
            i < numerator ? highlightColor : 'bg-background/20'
          )}
        />
      ))}
    </div>
    <span className="mt-2 text-lg font-bold font-code">{label}</span>
  </div>
);

const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  numerator = 1,
  denominator = 2,
  mode,
  type = 'pizza',
  size = 'md',
  interactive = false,
  onFractionChange,
  className = '',
  fraction1 = { numerator: 1, denominator: 2 },
  fraction2 = { numerator: 1, denominator: 4 },
  operation = 'add'
}) => {
  // Auto-detect mode based on props
  const actualMode = mode || (fraction1 && fraction2 ? 'operations' : 'visualization');
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [stage, setStage] = useState(0);
  const [sliderValue, setSliderValue] = useState(
    Math.max(fraction1.denominator, fraction2.denominator)
  );

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const handleSliceClick = (sliceIndex: number) => {
    if (!interactive || actualMode !== 'interactive') return;
    
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
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Slice ${i + 1} of ${denominator}` : undefined}
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
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Slice ${i + 1} of ${denominator}` : undefined}
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
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Cell ${i + 1} of ${denominator}` : undefined}
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
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Bar ${i + 1} of ${denominator}` : undefined}
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

  // Operations mode logic
  const isCommonDenominator =
    sliderValue % fraction1.denominator === 0 && sliderValue % fraction2.denominator === 0;

  const f1Converted = {
    numerator: (sliderValue / fraction1.denominator) * fraction1.numerator,
    denominator: sliderValue,
  };

  const f2Converted = {
    numerator: (sliderValue / fraction2.denominator) * fraction2.numerator,
    denominator: sliderValue,
  };

  const resultNumerator =
    operation === 'add'
      ? f1Converted.numerator + f2Converted.numerator
      : f1Converted.numerator - f2Converted.numerator;

  const resultFraction = {
    numerator: resultNumerator,
    denominator: sliderValue,
  };
  
  const OperationIcon = operation === 'add' ? Plus : Minus;

  const getStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              We can't add or subtract these yet because the slices (denominators) are different sizes.
            </p>
            <div className="flex flex-col items-center gap-4">
              <FractionBar {...fraction1} highlightColor="bg-primary" label={`${fraction1.numerator}/${fraction1.denominator}`} />
              <OperationIcon className="w-8 h-8 text-muted-foreground" />
              <FractionBar {...fraction2} highlightColor="bg-accent" label={`${fraction2.numerator}/${fraction2.denominator}`} />
            </div>
             <div className="flex justify-end mt-6">
                <Button onClick={() => setStage(1)}>Let's Fix It <ArrowRight/></Button>
             </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
             Move the slider to find a "common denominator"—a number that both {fraction1.denominator} and {fraction2.denominator} can divide into. The bars will turn green when you find one.
            </p>
            <div className="flex flex-col items-center gap-4">
                 <FractionBar {...f1Converted} highlightColor={cn(isCommonDenominator ? 'bg-green-500' : 'bg-primary')} label={`${f1Converted.numerator}/${f1Converted.denominator}`}/>
                 <FractionBar {...f2Converted} highlightColor={cn(isCommonDenominator ? 'bg-green-500' : 'bg-accent')} label={`${f2Converted.numerator}/${f2Converted.denominator}`} />
                 <div className="w-full max-w-sm px-4 pt-4">
                    <label htmlFor="denominator-slider" className="block text-sm font-medium text-gray-700 mb-2">
                      Common Denominator: {sliderValue}
                    </label>
                    <input
                        id="denominator-slider"
                        type="range"
                        min={Math.max(fraction1.denominator, fraction2.denominator)}
                        max={fraction1.denominator * fraction2.denominator * 2}
                        step={1}
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={() => setStage(2)} disabled={!isCommonDenominator}>Combine Them <ArrowRight /></Button>
            </div>
          </>
        );
       case 2:
        return (
            <>
                <p className="mb-4 text-center text-muted-foreground">
                    Now that the slices are the same size, we can easily {operation} the numerators!
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                         <span className="text-2xl font-bold font-code">{`${f1Converted.numerator}/${f1Converted.denominator}`}</span>
                         <OperationIcon className="w-6 h-6" />
                         <span className="text-2xl font-bold font-code">{`${f2Converted.numerator}/${f2Converted.denominator}`}</span>
                         <Equal className="w-6 h-6" />
                         <span className="text-2xl font-bold font-code text-primary">{`${resultFraction.numerator}/${resultFraction.denominator}`}</span>
                    </div>
                     <FractionBar {...resultFraction} highlightColor="bg-primary" label="Result" />
                </div>
                 <div className="mt-4 rounded-lg border border-green-500 bg-green-50 p-4 text-green-800">
                    <p>
                        You've cracked it! Now that you see how it works, try answering the original question again.
                    </p>
                </div>
            </>
        )
    }
  };

  // Handle error cases
  if (denominator === 0) {
    return (
      <div className={`text-center text-red-500 ${className}`}>
        <p>Invalid fraction: denominator cannot be zero</p>
      </div>
    );
  }

  // Operations mode
  if (actualMode === 'operations') {
    return (
      <div className={`mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">
            Let's Work It Out Visually
          </h3>
        </div>
        <div>
          {getStageContent()}
        </div>
      </div>
    );
  }

  // Basic visualization and interactive modes
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

export default FractionVisualizer;