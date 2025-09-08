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

export const lessons: Lesson[] = [
  {
    id: 'patterns-mathematics',
    title: 'Patterns in Mathematics',
    description: 'Discover patterns all around us and learn why they exist',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    emoji: '🔍',
    learningObjectives: [
      'Identify patterns in nature and daily life',
      'Understand that mathematics is the search for patterns',
      'Recognize patterns in numbers and shapes',
      'Create your own mathematical patterns'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🔍 What is Mathematics?',
        content: 'Math is finding patterns! Look around - patterns are everywhere! 🌟',
        order: 1
      },
      {
        id: 'discovery',
        type: 'interactive',
        title: '🎨 Visualize Number Patterns',
        content: PatternVisualizer,
        order: 2
      },
      {
        id: 'creation',
        type: 'practice',
        title: '🧩 Pattern Challenge',
        content: 'Can you find the pattern? 2, 4, 8, 16, ?',
        order: 3
      }
    ]
  },
  {
    id: 'lines-angles',
    title: 'Lines and Angles',
    description: 'Explore the building blocks of geometry - points, lines, and angles',
    difficulty: 'Beginner',
    estimatedTime: '25-30 min',
    emoji: '📐',
    learningObjectives: [
      'Understand points, lines, rays, and line segments',
      'Identify different types of angles',
      'Measure angles using a protractor',
      'Recognize geometric patterns in real life'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '📐 Points and Lines',
        content: 'A point is a dot! A ray goes on forever! ✨',
        order: 1
      },
      {
        id: 'angles',
        type: 'interactive',
        title: '🎯 Draw Shapes with Specific Perimeter',
        content: InteractivePerimeter,
        order: 2
      },
      {
        id: 'practice',
        type: 'practice',
        title: '🔍 Angle Hunt',
        content: 'Find right angles in your room! Look for L-shapes!',
        order: 3
      }
    ]
  },
  {
    id: 'number-play',
    title: 'Number Play',
    description: 'Play with numbers and discover their patterns and properties',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    emoji: '🎲',
    learningObjectives: [
      'Use numbers in different contexts',
      'Identify number patterns and sequences',
      'Apply operations in creative ways',
      'Solve number puzzles and games'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🎲 Numbers Everywhere!',
        content: 'Numbers are everywhere! Count your fingers, toes, and everything around you! 🔢',
        order: 1
      },
      {
        id: 'patterns',
        type: 'interactive',
        title: '🎨 Visualize Number Patterns',
        content: PatternVisualizer,
        order: 2
      },
      {
        id: 'games',
        type: 'practice',
        title: '🎯 Number Challenge',
        content: 'What comes next? 5, 10, 15, 20, ?',
        order: 3
      }
    ]
  },
  {
    id: 'data-handling',
    title: 'Data Collection and Representation',
    description: 'Learn to collect, organize, and represent data using various methods',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    emoji: '📊',
    learningObjectives: [
      'Collect data through surveys and observations',
      'Use tally marks to record data',
      'Create and interpret bar graphs',
      'Make pictographs with symbols and emojis'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '📊 What is Data?',
        content: 'Data is information! Like counting your favorite fruits! 🍎🍌🍊',
        order: 1
      },
      {
        id: 'tally',
        type: 'interactive',
        title: '✏️ Interactive Tally Marks',
        content: InteractiveTallyMarks,
        order: 2
      },
      {
        id: 'graphs',
        type: 'interactive',
        title: '📈 Clickable Bar Graph',
        content: ClickableLessonBarChart,
        order: 3
      }
    ]
  },
  {
    id: 'prime-time',
    title: 'Prime Time - The Idli-Vada Game',
    description: 'Discover prime numbers through the fun Idli-Vada game',
    difficulty: 'Advanced',
    estimatedTime: '25-30 min',
    emoji: '🥟',
    learningObjectives: [
      'Identify prime and composite numbers',
      'Find factors and multiples',
      'Play the Idli-Vada game for multiples',
      'Understand common multiples and factors'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🥟 The Idli-Vada Game!',
        content: 'Multiples of 3 = "Idli"! Multiples of 5 = "Vada"! Both = "Idli-Vada"! 🎮',
        order: 1
      },
      {
        id: 'multiples',
        type: 'interactive',
        title: '🔍 Prime Number Factor Checker',
        content: FactorChecker,
        order: 2
      },
      {
        id: 'game',
        type: 'practice',
        title: '🎲 Play the Game!',
        content: 'Count: 1, 2, Idli, 4, Vada, Idli, 7, 8, Idli, Vada, 11, Idli, 13, 14, Idli-Vada!',
        order: 3
      }
    ]
  },
  {
    id: 'perimeter-area',
    title: 'Perimeter and Area',
    description: 'Calculate perimeter and area of different shapes',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    emoji: '📐',
    learningObjectives: [
      'Calculate perimeter of rectangles and squares',
      'Calculate area of rectangles and squares',
      'Understand the difference between perimeter and area',
      'Solve real-world problems involving measurement'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '📐 Perimeter vs Area',
        content: 'Perimeter = distance around! Area = space inside! 🎯',
        order: 1
      },
      {
        id: 'perimeter',
        type: 'interactive',
        title: '📐 Shape Visualizer - Perimeter vs Area',
        content: ShapeVisualizer,
        order: 2
      },
      {
        id: 'area',
        type: 'practice',
        title: '🔍 Find the Area!',
        content: 'A square with side 6 cm has area = 6 × 6 = 36 cm²!',
        order: 3
      }
    ]
  },
  {
    id: 'fractions',
    title: 'Understanding Fractions',
    description: 'Learn what fractions are and how to represent them visually',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    emoji: '🍕',
    learningObjectives: [
      'Understand what a fraction represents',
      'Identify numerator and denominator',
      'Compare fractions using visual models',
      'Solve real-world fraction problems with rotis and sharing'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🍕 What are Fractions?',
        content: 'Sharing rotis! 1 roti ÷ 2 children = 1/2 roti each! 🥟',
        order: 1
      },
      {
        id: 'visual',
        type: 'interactive',
        title: '🍕 Fraction Visualizer - Common Denominators',
        content: FractionVisualizer,
        order: 2
      },
      {
        id: 'practice',
        type: 'practice',
        title: '🎯 Fraction Challenge',
        content: 'Which is bigger? 1/2 roti or 1/4 roti?',
        order: 3
      }
    ]
  },
  {
    id: 'symmetry',
    title: 'Symmetry',
    description: 'Discover the beauty of symmetry in nature and mathematics',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    emoji: '🦋',
    learningObjectives: [
      'Identify symmetrical objects in nature',
      'Understand line symmetry and rotational symmetry',
      'Create symmetrical patterns like rangoli',
      'Recognize symmetry in geometric shapes',
      'Understand regular polygons and their symmetry properties'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🦋 What is Symmetry?',
        content: 'Fold a butterfly in half - both sides match! That\'s symmetry! ✨ A regular polygon with n sides has n lines of symmetry. The number of lines of symmetry is always equal to the number of sides, regardless of whether the polygon has an odd or even number of sides.',
        order: 1
      },
      {
        id: 'regular-polygons',
        type: 'intro',
        title: '📐 Regular Polygons and Symmetry',
        content: 'Regular polygons are shapes with equal sides and equal angles. They have a special symmetry property: A regular polygon with n sides has exactly n lines of symmetry! For example: An equilateral triangle (3 sides) has 3 lines of symmetry. A square (4 sides) has 4 lines of symmetry. A regular pentagon (5 sides) has 5 lines of symmetry. A regular hexagon (6 sides) has 6 lines of symmetry.',
        order: 2
      },
      {
        id: 'line-symmetry',
        type: 'interactive',
        title: '🦋 Symmetry Visualizer',
        content: SymmetryVisualizer,
        order: 3
      },
      {
        id: 'rotational',
        type: 'practice',
        title: '🌀 Find Symmetry!',
        content: 'Look around! Find symmetrical objects: butterfly, flower, rangoli! Can you find regular polygons around you?',
        order: 4
      }
    ]
  },
  {
    id: 'integers',
    title: 'Integers - The Other Side of Zero',
    description: 'Explore numbers on both sides of zero',
    difficulty: 'Advanced',
    estimatedTime: '25-30 min',
    emoji: '🔢',
    learningObjectives: [
      'Understand positive and negative numbers',
      'Use integers on a number line',
      'Compare and order integers',
      'Apply integers in real-world situations'
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '🔢 Numbers Before Zero!',
        content: '0, 1, 2, 3... but what about -1, -2, -3? Negative numbers! ❄️',
        order: 1
      },
      {
        id: 'number-line',
        type: 'interactive',
        title: '📊 Interactive Bar Graph for Temperature',
        content: InteractiveBarGraph,
        order: 2
      },
      {
        id: 'operations',
        type: 'practice',
        title: '🌡️ Temperature Challenge',
        content: 'If it\'s -5°C and rises 8°C, what\'s the new temperature?',
        order: 3
      }
    ]
  },
];

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id);
};

export const getLessonsByDifficulty = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Lesson[] => {
  return lessons.filter(lesson => lesson.difficulty === difficulty);
};
