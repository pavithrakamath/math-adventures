import { lazy } from 'react';

// Lazy load visualization components for better performance
const FractionVisualizer = lazy(() => import('../components/visualizations/FractionVisualizer'));
const BarChart = lazy(() => import('../components/visualizations/BarChart'));
const InteractivePatternBuilder = lazy(() => import('../components/visualizations/InteractivePatternBuilder'));
const InteractivePerimeter = lazy(() => import('../components/visualizations/InteractivePerimeter'));
const TallyMarks = lazy(() => import('../components/visualizations/TallyMarks'));
const InteractivePictograph = lazy(() => import('../components/visualizations/InteractivePictograph'));
const PatternVisualizer = lazy(() => import('../components/visualizations/PatternVisualizer'));
const PalindromeVisualizer = lazy(() => import('../components/visualizations/PalindromeVisualizer'));
const KaprekarVisualizer = lazy(() => import('../components/visualizations/KaprekarVisualizer'));
const SupercellVisualizer = lazy(() => import('../components/visualizations/SupercellVisualizer'));
const EstimationGame = lazy(() => import('../components/visualizations/EstimationGame'));
const ShapeVisualizer = lazy(() => import('../components/visualizations/ShapeVisualizer'));
const SymmetryVisualizer = lazy(() => import('../components/visualizations/SymmetryVisualizer'));
const AreaVisual = lazy(() => import('../components/visualizations/AreaVisual'));
const FactorChecker = lazy(() => import('../components/visualizations/FactorChecker'));
const TriangularNumbersVisualizer = lazy(() => import('../components/visualizations/TriangularNumbersVisualizer'));
const FibonacciVisualizer = lazy(() => import('../components/visualizations/FibonacciVisualizer'));
const OddToSquareVisualizer = lazy(() => import('../components/visualizations/OddToSquareVisualizer'));
const PatternRelationshipsVisualizer = lazy(() => import('../components/visualizations/PatternRelationshipsVisualizer'));
const PerimeterAreaComparison = lazy(() => import('../components/visualizations/PerimeterAreaComparison'));
const CollatzVisualizer = lazy(() => import('../components/visualizations/CollatzVisualizer'));
const TwentyOneGameVisualizer = lazy(() => import('../components/visualizations/TwentyOneGameVisualizer'));

// Lazy load lesson components
const Quiz = lazy(() => import('../components/lessons/Quiz'));

// Component mapping
const componentMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  'FractionVisualizer': FractionVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'FractionVisual': FractionVisualizer as unknown as React.ComponentType<Record<string, unknown>>, // Redirect to merged FractionVisualizer
  'BarChart': BarChart as unknown as React.ComponentType<Record<string, unknown>>,
  'InteractiveBarGraph': BarChart as unknown as React.ComponentType<Record<string, unknown>>, // Redirect to merged BarChart
  'ClickableLessonBarChart': BarChart as unknown as React.ComponentType<Record<string, unknown>>, // Redirect to merged BarChart
  'InteractivePatternBuilder': InteractivePatternBuilder as unknown as React.ComponentType<Record<string, unknown>>,
  'InteractivePerimeter': InteractivePerimeter as unknown as React.ComponentType<Record<string, unknown>>,
  'TallyMarks': TallyMarks as unknown as React.ComponentType<Record<string, unknown>>,
  'InteractiveTallyMarks': TallyMarks as unknown as React.ComponentType<Record<string, unknown>>, // Redirect to merged TallyMarks
  'InteractivePictograph': InteractivePictograph as unknown as React.ComponentType<Record<string, unknown>>,
  'PatternVisualizer': PatternVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'PalindromeVisualizer': PalindromeVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'KaprekarVisualizer': KaprekarVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'SupercellVisualizer': SupercellVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'EstimationGame': EstimationGame as unknown as React.ComponentType<Record<string, unknown>>,
  'ShapeVisualizer': ShapeVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'SymmetryVisualizer': SymmetryVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'AreaVisual': AreaVisual as unknown as React.ComponentType<Record<string, unknown>>,
  'FactorChecker': FactorChecker as unknown as React.ComponentType<Record<string, unknown>>,
  'TriangularNumbersVisualizer': TriangularNumbersVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'FibonacciVisualizer': FibonacciVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'OddToSquareVisualizer': OddToSquareVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'PatternRelationshipsVisualizer': PatternRelationshipsVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'PerimeterAreaComparison': PerimeterAreaComparison as unknown as React.ComponentType<Record<string, unknown>>,
  'CollatzVisualizer': CollatzVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'TwentyOneGameVisualizer': TwentyOneGameVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  'Quiz': Quiz as unknown as React.ComponentType<Record<string, unknown>>,
};

/**
 * Resolves a component string reference to an actual React component
 * @param componentName - The string name of the component
 * @returns The resolved React component or null if not found
 */
export const resolveComponent = (componentName: string): React.ComponentType<Record<string, unknown>> | null => {
  return componentMap[componentName] || null;
};

/**
 * Checks if a string is a component reference
 * @param content - The content to check
 * @returns True if the content is a component reference
 */
export const isComponentReference = (content: string): boolean => {
  return Object.prototype.hasOwnProperty.call(componentMap, content);
};

/**
 * Gets all available component names
 * @returns Array of available component names
 */
export const getAvailableComponents = (): string[] => {
  return Object.keys(componentMap);
};
