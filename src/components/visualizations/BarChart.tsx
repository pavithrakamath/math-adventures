import React from 'react';
import { motion } from 'framer-motion';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
  emoji?: string;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  maxValue?: number;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  maxValue,
  showValues = true,
  animated = true,
  className = '',
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const getBarColor = (index: number, customColor?: string) => {
    return customColor || colors[index % colors.length];
  };

  const getBarHeight = (value: number) => {
    return (value / max) * 200; // Max height of 200px
  };

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}
      
      <div className="flex items-end justify-center space-x-2 h-64">
        {data.map((item, index) => {
          const height = getBarHeight(item.value);
          const color = getBarColor(index, item.color);
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* Bar */}
              <motion.div
                className="relative w-12 rounded-t-lg flex flex-col justify-end"
                style={{ height: '200px' }}
                initial={animated ? { scaleY: 0 } : { scaleY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: animated ? index * 0.1 : 0,
                  ease: 'easeOut'
                }}
              >
                <motion.div
                  className="w-full rounded-t-lg relative"
                  style={{ 
                    height: `${height}px`,
                    backgroundColor: color,
                    opacity: 0.8
                  }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Value on top of bar */}
                  {showValues && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                      {item.value}
                    </div>
                  )}
                </motion.div>
              </motion.div>
              
              {/* Label */}
              <div className="text-xs text-center text-gray-600 max-w-16">
                {item.emoji && (
                  <div className="text-lg mb-1">{item.emoji}</div>
                )}
                <div className="break-words">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Axis Labels */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        {xAxisLabel && (
          <span className="text-center w-full">{xAxisLabel}</span>
        )}
      </div>
      
      {yAxisLabel && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-600">
          {yAxisLabel}
        </div>
      )}
    </div>
  );
};

export default BarChart;
