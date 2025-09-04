import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FractionVisual from '../visualizations/FractionVisual';
import TallyMarks from '../visualizations/TallyMarks';
import BarChart from '../visualizations/BarChart';
import PerimeterVisual from '../visualizations/PerimeterVisual';
import AreaVisual from '../visualizations/AreaVisual';

export interface InteractiveDemoProps {
  type: 'fractions' | 'tally' | 'bar-chart' | 'perimeter' | 'area';
  className?: string;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  type,
  className = '',
}) => {
  const [fractionNumerator, setFractionNumerator] = useState(2);
  const [fractionDenominator, setFractionDenominator] = useState(4);
  const [tallyCount, setTallyCount] = useState(7);
  const [perimeterShape, setPerimeterShape] = useState<'rectangle' | 'square' | 'triangle'>('rectangle');
  const [perimeterDimensions] = useState<number[]>([8, 5]);
  const [areaShape, setAreaShape] = useState<'rectangle' | 'square' | 'triangle' | 'circle'>('rectangle');
  const [areaDimensions] = useState<number[]>([6, 4]);

  const renderFractionDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Fraction Builder
        </h3>
        <p className="text-gray-600">
          Adjust the numerator and denominator to see how fractions work!
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1">
          <FractionVisual
            numerator={fractionNumerator}
            denominator={fractionDenominator}
            type="pizza"
            size="lg"
            interactive={true}
            onFractionChange={(num, den) => {
              setFractionNumerator(num);
              setFractionDenominator(den);
            }}
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numerator: {fractionNumerator}
            </label>
            <input
              type="range"
              min="0"
              max="8"
              value={fractionNumerator}
              onChange={(e) => setFractionNumerator(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Denominator: {fractionDenominator}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={fractionDenominator}
              onChange={(e) => setFractionDenominator(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Fraction Information:</h4>
            <p className="text-blue-800">
              <strong>Fraction:</strong> {fractionNumerator}/{fractionDenominator}
            </p>
            <p className="text-blue-800">
              <strong>Decimal:</strong> {(fractionNumerator / fractionDenominator).toFixed(3)}
            </p>
            <p className="text-blue-800">
              <strong>Percentage:</strong> {((fractionNumerator / fractionDenominator) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTallyDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Tally Marks
        </h3>
        <p className="text-gray-600">
          Learn how to count and represent numbers using tally marks!
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 text-center">
          <TallyMarks count={tallyCount} animated={true} size="lg" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Count: {tallyCount}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={tallyCount}
              onChange={(e) => setTallyCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Tally Mark Rules:</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Each mark represents 1</li>
              <li>• Group marks in sets of 5</li>
              <li>• Draw a diagonal line through every 5th mark</li>
              <li>• Example: ||||̸ ||| = 8</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBarChartDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Bar Chart
        </h3>
        <p className="text-gray-600">
          Explore how data can be represented in bar charts!
        </p>
      </div>
      
      <BarChart
        data={[
          { label: 'Math', value: 85, emoji: '📊' },
          { label: 'Science', value: 92, emoji: '🔬' },
          { label: 'English', value: 78, emoji: '📚' },
          { label: 'History', value: 88, emoji: '🏛️' },
          { label: 'Art', value: 95, emoji: '🎨' }
        ]}
        title="Student Test Scores"
        xAxisLabel="Subjects"
        yAxisLabel="Scores"
        animated={true}
      />
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Chart Analysis:</h4>
        <ul className="text-purple-800 text-sm space-y-1">
          <li>• Art has the highest score (95)</li>
          <li>• Science is second highest (92)</li>
          <li>• English has the lowest score (78)</li>
          <li>• The range is 17 points (95 - 78)</li>
        </ul>
      </div>
    </div>
  );

  const renderPerimeterDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Perimeter Calculator
        </h3>
        <p className="text-gray-600">
          Learn how to calculate perimeter of different shapes!
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          {(['rectangle', 'square', 'triangle'] as const).map((shape) => (
            <button
              key={shape}
              onClick={() => setPerimeterShape(shape)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                perimeterShape === shape
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>
        
        <PerimeterVisual
          shape={perimeterShape}
          dimensions={perimeterDimensions}
          unit="cm"
          showGrid={true}
        />
      </div>
    </div>
  );

  const renderAreaDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Area Calculator
        </h3>
        <p className="text-gray-600">
          Learn how to calculate area of different shapes!
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          {(['rectangle', 'square', 'triangle', 'circle'] as const).map((shape) => (
            <button
              key={shape}
              onClick={() => setAreaShape(shape)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                areaShape === shape
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>
        
        <AreaVisual
          shape={areaShape}
          dimensions={areaDimensions}
          unit="cm"
          showGrid={true}
          showFormula={true}
        />
      </div>
    </div>
  );

  const renderDemo = () => {
    switch (type) {
      case 'fractions':
        return renderFractionDemo();
      case 'tally':
        return renderTallyDemo();
      case 'bar-chart':
        return renderBarChartDemo();
      case 'perimeter':
        return renderPerimeterDemo();
      case 'area':
        return renderAreaDemo();
      default:
        return renderFractionDemo();
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderDemo()}
    </motion.div>
  );
};

export default InteractiveDemo;
