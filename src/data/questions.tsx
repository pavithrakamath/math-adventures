import type { Question } from '../types/lesson.types';
import FractionVisual from '../components/visualizations/FractionVisual';
import InteractiveTallyMarks from '../components/visualizations/InteractiveTallyMarks';
import InteractiveBarGraph from '../components/visualizations/InteractiveBarGraph';
import InteractivePerimeter from '../components/visualizations/InteractivePerimeter';
import FactorChecker from '../components/visualizations/FactorChecker';
import PatternVisualizer from '../components/visualizations/PatternVisualizer';
import ClickableLessonBarChart from '../components/visualizations/ClickableLessonBarChart';
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
const visualizationComponents: Record<string, any> = {
  FractionVisual,
  InteractiveTallyMarks,
  InteractiveBarGraph,
  InteractivePerimeter,
  FactorChecker,
  PatternVisualizer,
  ClickableLessonBarChart,
  ShapeVisualizer,
  SymmetryVisualizer,
  FractionVisualizer,
  TriangularNumbersVisualizer,
  FibonacciVisualizer,
  OddToSquareVisualizer,
  PatternRelationshipsVisualizer,
};

// Function to process question data and map visualization components
const processQuestionData = (questionData: any[]): Question[] => {
  return questionData.map((question: any) => ({
    ...question,
    visualization: question.visualization && visualizationComponents[question.visualization] 
      ? visualizationComponents[question.visualization] 
      : question.visualization
  }));
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