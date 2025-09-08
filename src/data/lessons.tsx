import type { Lesson } from '../types/lesson.types';
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
import AreaVisualizationLesson from '../components/visualizations/AreaVisualizationLesson';
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
  AreaVisualizationLesson,
  PerimeterAreaComparison,
};

// Function to process lesson data and map visualization components
const processLessonData = (lessonData: Record<string, unknown>): Lesson => {
  return {
    ...lessonData,
    sections: (lessonData.sections as Array<Record<string, unknown>>).map((section: Record<string, unknown>) => ({
      ...section,
      content: typeof section.content === 'string' && visualizationComponents[section.content] 
        ? visualizationComponents[section.content] 
        : section.content
    })) as unknown as Lesson['sections']
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
