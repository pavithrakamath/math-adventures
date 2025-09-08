import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PictographData {
  name: string;
  value: number;
  emoji?: string;
}

interface InteractivePictographProps {
  data: PictographData[];
  symbol: string;
  scale: number; // How many units each symbol represents
  title?: string;
  onSymbolClick?: (category: string, value: number) => void;
  interactive?: boolean;
  className?: string;
}

const InteractivePictograph: React.FC<InteractivePictographProps> = ({
  data = [
    { name: 'Private car', value: 3 },
    { name: 'Public bus', value: 8 },
    { name: 'School bus', value: 12 },
    { name: 'Cycle', value: 5 },
    { name: 'Walking', value: 7 }
  ],
  symbol = '🚗',
  scale = 1,
  title = 'Modes of Travel Used by Students',
  onSymbolClick,
  interactive = true,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState(0);

  // Different examples to demonstrate various pictograph concepts
  const examples = [
    {
      title: 'Modes of Travel (Scale: 1)',
      data: [
        { name: 'Private car', value: 3 },
        { name: 'Public bus', value: 8 },
        { name: 'School bus', value: 12 },
        { name: 'Cycle', value: 5 },
        { name: 'Walking', value: 7 }
      ],
      symbol: '🚗',
      scale: 1
    },
    {
      title: 'Books Borrowed from Library (Scale: 2)',
      data: [
        { name: 'Monday', value: 6 },
        { name: 'Tuesday', value: 4 },
        { name: 'Wednesday', value: 8 },
        { name: 'Thursday', value: 3 },
        { name: 'Friday', value: 5 },
        { name: 'Saturday', value: 2 }
      ],
      symbol: '📚',
      scale: 2
    },
    {
      title: 'Sleep Patterns (Scale: 10)',
      data: [
        { name: 'Always', value: 50 },
        { name: 'Sometimes', value: 25 },
        { name: 'Never', value: 40 }
      ],
      symbol: '😴',
      scale: 10
    }
  ];

  const currentExampleData = examples[currentExample];
  const displayData = data.length > 0 ? data : currentExampleData.data;
  const displaySymbol = symbol !== '🚗' ? symbol : currentExampleData.symbol;
  const displayScale = scale !== 1 ? scale : currentExampleData.scale;
  const displayTitle = title !== 'Modes of Travel Used by Students' ? title : currentExampleData.title;

  const handleSymbolClick = (category: string, value: number) => {
    if (interactive) {
      setSelectedCategory(selectedCategory === category ? null : category);
      if (onSymbolClick) {
        onSymbolClick(category, value);
      }
    }
  };

  const renderSymbols = (value: number, category: string) => {
    const symbolCount = Math.floor(value / displayScale);
    const remainder = value % displayScale;
    const symbols = [];
    
    // Complete symbols
    for (let i = 0; i < symbolCount; i++) {
      const isSelected = selectedCategory === category;
      
      symbols.push(
        <motion.span
          key={`complete-${i}`}
          className={`inline-block mx-1 text-2xl cursor-pointer select-none ${
            isSelected ? 'opacity-100 scale-110' : 'opacity-80'
          } ${interactive ? 'hover:scale-110' : ''}`}
          onClick={() => handleSymbolClick(category, value)}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {displaySymbol}
        </motion.span>
      );
    }
    
    // Partial symbol (half circle for circles, or half of the symbol)
    if (remainder > 0) {
      const isSelected = selectedCategory === category;
      const partialSymbol = displaySymbol === '●' ? '◐' : displaySymbol; // Half circle for circles
      
      symbols.push(
        <motion.span
          key="partial"
          className={`inline-block mx-1 text-2xl cursor-pointer select-none ${
            isSelected ? 'opacity-100 scale-110' : 'opacity-80'
          } ${interactive ? 'hover:scale-110' : ''}`}
          onClick={() => handleSymbolClick(category, value)}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.3, delay: symbolCount * 0.1 }}
        >
          {partialSymbol}
        </motion.span>
      );
    }
    
    return symbols;
  };

  const getMaxValue = () => {
    return Math.max(...displayData.map(item => item.value));
  };

  const getMaxSymbols = () => {
    return Math.ceil(getMaxValue() / displayScale);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 text-center flex-1">
          {displayTitle}
        </h3>
        {data.length === 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentExample((prev) => (prev + 1) % examples.length)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {displayData.map((item, index) => (
          <motion.div
            key={item.name}
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
              selectedCategory === item.name 
                ? 'bg-blue-50 border-2 border-blue-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="w-24 text-sm font-medium text-gray-700">
              {item.name}
            </div>
            <div 
              className="flex-1 flex items-center"
              style={{ minWidth: `${getMaxSymbols() * 2.5}rem` }}
            >
              {renderSymbols(item.value, item.name)}
            </div>
            {interactive && (
              <div className="w-16 text-right text-sm font-semibold text-gray-600">
                {item.value}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span className="text-2xl">{displaySymbol}</span>
          <span>= {displayScale} {displayScale === 1 ? 'unit' : 'units'}</span>
        </div>
      </div>
      
      {selectedCategory && interactive && (
        <motion.div
          className="mt-4 p-3 bg-blue-100 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-blue-800">
            <strong>{selectedCategory}:</strong> {displayData.find(item => item.name === selectedCategory)?.value} units
            {displayScale > 1 && ` (${Math.ceil((displayData.find(item => item.name === selectedCategory)?.value || 0) / displayScale)} symbols)`}
          </p>
        </motion.div>
      )}
      
      {data.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Learning Tip:</strong> Click on the symbols to see the actual values! 
            Notice how different scales (1, 2, 10) affect how many symbols we need to represent the same data.
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractivePictograph;
