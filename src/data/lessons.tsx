import React from 'react';
import type { Lesson } from '../types/lesson.types';
import InteractivePerimeter from '../components/visualizations/InteractivePerimeter';
import FactorChecker from '../components/visualizations/FactorChecker';
import PatternVisualizer from '../components/visualizations/PatternVisualizer';
import ShapeVisualizer from '../components/visualizations/ShapeVisualizer';
import SymmetryVisualizer from '../components/visualizations/SymmetryVisualizer';
import FractionVisualizer from '../components/visualizations/FractionVisualizer';
import TriangularNumbersVisualizer from '../components/visualizations/TriangularNumbersVisualizer';
import FibonacciVisualizer from '../components/visualizations/FibonacciVisualizer';
import OddToSquareVisualizer from '../components/visualizations/OddToSquareVisualizer';
import PatternRelationshipsVisualizer from '../components/visualizations/PatternRelationshipsVisualizer';
import PerimeterAreaComparison from '../components/visualizations/PerimeterAreaComparison';

// Import lesson data from JSON files
import patternsMathematicsData from './lessons/patterns-mathematics.json';
import linesAnglesData from './lessons/lines-angles.json';
import numberPlayData from './lessons/number-play.json';
import dataHandlingData from './lessons/data-handling.json';
import primeTimeData from './lessons/prime-time.json';
import perimeterAreaData from './lessons/perimeter-area.json';
import fractionsData from './lessons/fractions.json';
import symmetryData from './lessons/symmetry.json';
import integersData from './lessons/integers.json';

// Map visualization component names to actual components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const visualizationComponents: Record<string, React.ComponentType<any>> = {
  InteractivePerimeter,
  FactorChecker,
  PatternVisualizer,
  ShapeVisualizer,
  SymmetryVisualizer,
  FractionVisualizer,
  TriangularNumbersVisualizer,
  FibonacciVisualizer,
  OddToSquareVisualizer,
  PatternRelationshipsVisualizer,
  PerimeterAreaComparison,
};

// Function to process lesson data and map visualization components
const processLessonData = (lessonData: Record<string, unknown>): Lesson => {
  return {
    ...lessonData,
    sections: (lessonData.sections as Array<Record<string, unknown>>).map((section: Record<string, unknown>) => {
      const processedSection = { ...section };
      
      // If content is a string and we have a component for it, replace with the component
      if (typeof section.content === 'string' && visualizationComponents[section.content]) {
        const Component = visualizationComponents[section.content];
        const props = section.props || {};
        
        // Create a component with props
        processedSection.content = (() => {
          const WrappedComponent = () => <Component {...props} />;
          WrappedComponent.displayName = `Wrapped${section.content}`;
          return WrappedComponent;
        })() as React.ComponentType<Record<string, unknown>>;
      }
      
      return processedSection;
    }) as unknown as Lesson['sections']
  } as Lesson;
};

export const lessons: Lesson[] = [
  processLessonData(patternsMathematicsData),
  processLessonData(linesAnglesData),
  processLessonData(numberPlayData),
  processLessonData(dataHandlingData),
  processLessonData(primeTimeData),
  processLessonData(perimeterAreaData),
  processLessonData(fractionsData),
  processLessonData(symmetryData),
  processLessonData(integersData),
];

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id);
};

export const getLessonsByDifficulty = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Lesson[] => {
  return lessons.filter(lesson => lesson.difficulty === difficulty);
};
