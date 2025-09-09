import type { Question } from '../types/lesson.types';
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

// Import question data from JSON files
import patternsMathematicsQuestions from './questions/patterns-mathematics.json';
import linesAnglesQuestions from './questions/lines-angles.json';
import numberPlayQuestions from './questions/number-play.json';
import dataHandlingQuestions from './questions/data-handling.json';
import primeTimeQuestions from './questions/prime-time.json';
import perimeterAreaQuestions from './questions/perimeter-area.json';
import fractionsQuestions from './questions/fractions.json';
import symmetryQuestions from './questions/symmetry.json';
import integersQuestions from './questions/integers.json';
import equationsQuestions from './questions/equations.json';

// Map visualization component names to actual components
const visualizationComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  InteractivePerimeter: InteractivePerimeter as unknown as React.ComponentType<Record<string, unknown>>,
  FactorChecker: FactorChecker as unknown as React.ComponentType<Record<string, unknown>>,
  PatternVisualizer: PatternVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  ShapeVisualizer: ShapeVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  SymmetryVisualizer: SymmetryVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  FractionVisualizer: FractionVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  TriangularNumbersVisualizer: TriangularNumbersVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  FibonacciVisualizer: FibonacciVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  OddToSquareVisualizer: OddToSquareVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  PatternRelationshipsVisualizer: PatternRelationshipsVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
};

// Function to process question data and map visualization components
const processQuestionData = (questionData: Array<Record<string, unknown>>): Question[] => {
  return questionData.map((question: Record<string, unknown>) => ({
    ...question,
    visualization: question.visualization && typeof question.visualization === 'string' && visualizationComponents[question.visualization] 
      ? visualizationComponents[question.visualization] 
      : question.visualization
  })) as Question[];
};

export const questions: Record<string, Question[]> = {
  'patterns-mathematics': processQuestionData(patternsMathematicsQuestions),
  'lines-angles': processQuestionData(linesAnglesQuestions),
  'number-play': processQuestionData(numberPlayQuestions),
  'data-handling': processQuestionData(dataHandlingQuestions),
  'prime-time': processQuestionData(primeTimeQuestions),
  'perimeter-area': processQuestionData(perimeterAreaQuestions),
  'fractions': processQuestionData(fractionsQuestions),
  'symmetry': processQuestionData(symmetryQuestions),
  'integers': processQuestionData(integersQuestions),
  'equations': processQuestionData(equationsQuestions),
};

export const getQuestionsForLesson = (lessonId: string): Question[] => {
  return questions[lessonId] || [];
};