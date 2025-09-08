import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import AreaVisual from './AreaVisual';

interface AreaVisualizationLessonProps {
  className?: string;
}

const AreaVisualizationLesson: React.FC<AreaVisualizationLessonProps> = ({ className = '' }) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  const shapes = [
    {
      type: 'rectangle' as const,
      dimensions: [6, 4],
      title: 'Rectangle Area',
      description: 'Length × Width',
      formula: 'A = l × w'
    },
    {
      type: 'square' as const,
      dimensions: [5, 5],
      title: 'Square Area', 
      description: 'Side × Side',
      formula: 'A = s²'
    },
    {
      type: 'triangle' as const,
      dimensions: [6, 4],
      title: 'Triangle Area',
      description: 'Base × Height ÷ 2',
      formula: 'A = (b × h) ÷ 2'
    },
    {
      type: 'circle' as const,
      dimensions: [3],
      title: 'Circle Area',
      description: 'π × Radius²',
      formula: 'A = π × r²'
    }
  ];

  const currentShape = shapes[currentShapeIndex];

  const nextShape = () => {
    setCurrentShapeIndex((prev) => (prev + 1) % shapes.length);
  };

  const prevShape = () => {
    setCurrentShapeIndex((prev) => (prev - 1 + shapes.length) % shapes.length);
  };

  const resetShape = () => {
    setCurrentShapeIndex(0);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {currentShape.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {currentShape.description} • {currentShape.formula}
        </p>
        
        <div className="flex justify-center space-x-2 mb-4">
          <Button
            onClick={prevShape}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={nextShape}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            onClick={resetShape}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <motion.div
        key={currentShapeIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AreaVisual
          shape={currentShape.type}
          dimensions={currentShape.dimensions}
          unit="cm"
          showGrid={true}
          showFormula={true}
        />
      </motion.div>

      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-2">
          {shapes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentShapeIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentShapeIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Learning Tip:</h4>
        <p className="text-sm text-yellow-700">
          {currentShape.type === 'rectangle' && 
            "A rectangle's area is found by multiplying its length and width. Each square unit represents 1 cm²."}
          {currentShape.type === 'square' && 
            "A square is a special rectangle where all sides are equal. So area = side × side = side²."}
          {currentShape.type === 'triangle' && 
            "A triangle's area is half of a rectangle with the same base and height. That's why we divide by 2!"}
          {currentShape.type === 'circle' && 
            "A circle's area uses π (pi ≈ 3.14). The radius is half the diameter, and we square it!"}
        </p>
      </div>
    </div>
  );
};

export default AreaVisualizationLesson;
