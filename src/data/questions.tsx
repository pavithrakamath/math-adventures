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

export const questions: Record<string, Question[]> = {
  'patterns-mathematics': [
    {
      id: 'pattern-1',
      question: 'What pattern do you see in this sequence: 2, 4, 8, 16, ?',
      type: 'multiple-choice',
      options: ['24', '32', '20', '18'],
      correctAnswer: '32',
      explanation: 'Each number is double the previous one! 2×2=4, 4×2=8, 8×2=16, 16×2=32',
      hint: 'Look at how each number relates to the one before it.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'pattern-2',
      question: 'In nature, what pattern do you see in a sunflower?',
      type: 'multiple-choice',
      options: ['Spiral', 'Square', 'Triangle', 'Random'],
      correctAnswer: 'Spiral',
      explanation: 'Sunflowers have a beautiful spiral pattern in their seeds - this is called the Fibonacci spiral!',
      hint: 'Look at how the seeds are arranged in the center.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'pattern-3',
      question: 'What comes next in this pattern: 🔴🔵🔴🔵🔴?',
      type: 'multiple-choice',
      options: ['🔴', '🔵', '🟢', '🟡'],
      correctAnswer: '🔵',
      explanation: 'The pattern alternates between red and blue circles. After red, it should be blue!',
      hint: 'Look at the color sequence carefully.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'pattern-4',
      question: 'Use the pattern visualizer to find the next number in this sequence: 3, 6, 12, 24, ?',
      type: 'visual-select',
      correctAnswer: '48',
      explanation: 'Each number is multiplied by 2. 3×2=6, 6×2=12, 12×2=24, 24×2=48',
      hint: 'Look for the multiplication pattern in the visualizer.',
      visualization: () => <PatternVisualizer pattern={{ sequence: [3, 6, 12, 24], operation: '× 2', nextValue: 48 }} />,
      points: 15,
      difficulty: 'medium'
    }
  ],
  'lines-angles': [
    {
      id: 'point-1',
      question: 'How many points are needed to draw a line?',
      type: 'multiple-choice',
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      explanation: 'You need exactly 2 points to draw a line. One point alone cannot make a line!',
      hint: 'Think about how you draw a line with a ruler.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'angle-1',
      question: 'What type of angle is 90 degrees?',
      type: 'multiple-choice',
      options: ['Acute', 'Right', 'Obtuse', 'Straight'],
      correctAnswer: 'Right',
      explanation: 'A 90-degree angle is called a right angle. It forms a perfect L-shape!',
      hint: 'Think about the corner of a square or rectangle.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'ray-1',
      question: 'A ray has how many endpoints?',
      type: 'multiple-choice',
      options: ['0', '1', '2', '3'],
      correctAnswer: '1',
      explanation: 'A ray has exactly one endpoint and extends infinitely in one direction, like a laser beam!',
      hint: 'Think about a ray of sunlight - it starts from the sun but goes on forever.',
      points: 15,
      difficulty: 'medium'
    }
  ],
  'number-play': [
    {
      id: 'number-1',
      question: 'What is the next number in this sequence: 5, 10, 15, 20, ?',
      type: 'input',
      correctAnswer: '25',
      explanation: 'Each number increases by 5. 20 + 5 = 25!',
      hint: 'Find the difference between consecutive numbers.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'number-2',
      question: 'If you arrange 12 children in 3 equal rows, how many children are in each row?',
      type: 'input',
      correctAnswer: '4',
      explanation: '12 ÷ 3 = 4. Each row will have 4 children!',
      hint: 'Divide the total number by the number of rows.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'number-3',
      question: 'What number comes before 100?',
      type: 'input',
      correctAnswer: '99',
      explanation: '99 comes right before 100 in our number sequence!',
      hint: 'Count backwards from 100.',
      points: 10,
      difficulty: 'easy'
    }
  ],
  'data-handling': [
    {
      id: 'tally-1',
      question: 'How many tally marks represent the number 7?',
      type: 'multiple-choice',
      options: ['7 tally marks', '6 tally marks', '8 tally marks', '9 tally marks'],
      correctAnswer: '7 tally marks',
      explanation: 'Tally marks are grouped in fives. For 7, we write 5 marks with a diagonal line through them (representing 5) plus 2 more marks.',
      hint: 'Remember: tally marks are grouped in fives with a diagonal line through every fifth mark.',
      visualization: () => <InteractiveTallyMarks targetCount={7} />,
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'graph-1',
      question: 'Based on the bar graph, which fruit is most popular?',
      type: 'multiple-choice',
      options: ['Apples', 'Bananas', 'Oranges', 'Grapes'],
      correctAnswer: 'Apples',
      explanation: 'Looking at the bar graph, the bar for apples is the tallest, indicating it is the most popular fruit.',
      hint: 'Look for the tallest bar in the graph.',
      visualization: () => (
        <InteractiveBarGraph
          data={[
            { label: 'Apples', value: 15, color: '#3b82f6', emoji: '🍎' },
            { label: 'Bananas', value: 12, color: '#ef4444', emoji: '🍌' },
            { label: 'Oranges', value: 8, color: '#10b981', emoji: '🍊' },
            { label: 'Grapes', value: 10, color: '#f59e0b', emoji: '🍇' }
          ]}
          title="Favorite Fruits Survey"
          allowEdit={false}
        />
      ),
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'data-1',
      question: 'If 30 students were surveyed and 40% chose pizza, how many students chose pizza?',
      type: 'input',
      correctAnswer: '12',
      explanation: '40% of 30 = 0.4 × 30 = 12 students chose pizza.',
      hint: 'Convert percentage to decimal and multiply by the total number.',
      points: 20,
      difficulty: 'hard'
    },
    {
      id: 'data-2',
      question: 'Click on the bar chart to select the most popular fruit.',
      type: 'visual-select',
      correctAnswer: 'Apples',
      explanation: 'Apples have the highest bar in the chart, making them the most popular fruit.',
      hint: 'Look for the tallest bar in the chart and click on it.',
      visualization: () => (
        <ClickableLessonBarChart
          data={[
            { label: 'Apples', value: 15, color: '#3b82f6', emoji: '🍎' },
            { label: 'Bananas', value: 12, color: '#ef4444', emoji: '🍌' },
            { label: 'Oranges', value: 8, color: '#10b981', emoji: '🍊' },
            { label: 'Grapes', value: 10, color: '#f59e0b', emoji: '🍇' }
          ]}
          title="Favorite Fruits Survey"
          question="Which fruit is most popular?"
          correctAnswer="Apples"
        />
      ),
      points: 15,
      difficulty: 'medium'
    }
  ],
  'prime-time': [
    {
      id: 'idli-vada-1',
      question: 'In the Idli-Vada game, what do you say for the number 15?',
      type: 'multiple-choice',
      options: ['Idli', 'Vada', 'Idli-Vada', '15'],
      correctAnswer: 'Idli-Vada',
      explanation: '15 is a multiple of both 3 and 5. Since 3 = Idli and 5 = Vada, 15 = Idli-Vada!',
      hint: 'Check if 15 is divisible by both 3 and 5.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'multiples-1',
      question: 'What are the first 5 multiples of 3?',
      type: 'multiple-choice',
      options: ['3, 6, 9, 12, 15', '1, 2, 3, 4, 5', '3, 9, 27, 81, 243', '6, 9, 12, 15, 18'],
      correctAnswer: '3, 6, 9, 12, 15',
      explanation: 'Multiples of 3 are: 3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15',
      hint: 'Multiply 3 by 1, 2, 3, 4, and 5.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'prime-1',
      question: 'Which of the following is a prime number?',
      type: 'multiple-choice',
      options: ['9', '15', '17', '21'],
      correctAnswer: '17',
      explanation: '17 is a prime number because it has only two factors: 1 and 17. The other numbers have more than two factors.',
      hint: 'A prime number has exactly two factors: 1 and itself.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'prime-2',
      question: 'Use the factor checker to determine if 23 is a prime number.',
      type: 'visual-select',
      correctAnswer: 'true',
      explanation: '23 is a prime number because it has only two factors: 1 and 23. Use the factor checker to verify this by checking all numbers up to 11 (half of 23).',
      hint: 'Check factors up to half the number. If you find any factors other than 1, it\'s not prime.',
      visualization: () => <FactorChecker targetNumber={23} />,
      points: 20,
      difficulty: 'hard'
    }
  ],
  'perimeter-area': [
    {
      id: 'perimeter-1',
      question: 'What is the perimeter of a rectangle with length 8 cm and width 5 cm?',
      type: 'multiple-choice',
      options: ['13 cm', '26 cm', '40 cm', '20 cm'],
      correctAnswer: '26 cm',
      explanation: 'Perimeter of rectangle = 2 × (length + width) = 2 × (8 + 5) = 2 × 13 = 26 cm',
      hint: 'Remember the formula: Perimeter = 2 × (length + width)',
      visualization: () => <InteractivePerimeter targetPerimeter={26} shape="rectangle" />,
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'area-1',
      question: 'What is the area of a square with side length 6 cm?',
      type: 'multiple-choice',
      options: ['12 cm²', '24 cm²', '36 cm²', '18 cm²'],
      correctAnswer: '36 cm²',
      explanation: 'Area of square = side × side = 6 × 6 = 36 cm²',
      hint: 'For a square, area = side × side',
      visualization: () => <InteractivePerimeter targetPerimeter={24} shape="square" />,
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'perimeter-2',
      question: 'A rectangular garden has a perimeter of 24 meters. If the length is 8 meters, what is the width?',
      type: 'input',
      correctAnswer: '4',
      explanation: 'Perimeter = 2 × (length + width), so 24 = 2 × (8 + width). Solving: 24 = 16 + 2w, so 2w = 8, therefore width = 4 meters.',
      hint: 'Use the perimeter formula and solve for the unknown width.',
      points: 25,
      difficulty: 'hard'
    },
    {
      id: 'perimeter-3',
      question: 'Use the shape visualizer to understand the difference between perimeter and area of a square with side 6 cm.',
      type: 'visual-select',
      correctAnswer: 'Perimeter: 24cm, Area: 36cm²',
      explanation: 'Perimeter = 4 × side = 4 × 6 = 24cm (distance around). Area = side × side = 6 × 6 = 36cm² (space inside).',
      hint: 'Toggle between perimeter and area views in the visualizer to see the difference.',
      visualization: () => <ShapeVisualizer shape="square" dimensions={{ side: 6 }} />,
      points: 20,
      difficulty: 'medium'
    }
  ],
  'fractions': [
    {
      id: 'fraction-1',
      question: 'If one roti is divided equally between 2 children, how much does each child get?',
      type: 'multiple-choice',
      options: ['1/4', '1/2', '3/4', '2/3'],
      correctAnswer: '1/2',
      explanation: 'When one roti is divided equally between 2 children, each child gets half a roti (1/2).',
      hint: 'Think about sharing equally - if 2 people share 1 roti, each gets half.',
      visualization: () => <FractionVisual numerator={1} denominator={2} type="circle" />,
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'fraction-2',
      question: 'Which fraction is larger: 1/2 roti or 1/4 roti?',
      type: 'multiple-choice',
      options: ['1/2', '1/4', 'They are equal', 'Cannot compare'],
      correctAnswer: '1/2',
      explanation: '1/2 roti is larger than 1/4 roti. When more people share the same roti, each person gets a smaller piece!',
      hint: 'Think about sharing - fewer people means bigger pieces.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'fraction-3',
      question: 'If 4 children share 3 rotis equally, how much does each child get?',
      type: 'input',
      correctAnswer: '3/4',
      explanation: '3 rotis ÷ 4 children = 3/4 roti per child.',
      hint: 'Divide the number of rotis by the number of children.',
      points: 20,
      difficulty: 'hard'
    },
    {
      id: 'fraction-4',
      question: 'Use the fraction visualizer to find the common denominator for 1/2 and 1/3, then add them.',
      type: 'visual-select',
      correctAnswer: '5/6',
      explanation: 'Common denominator is 6. 1/2 = 3/6 and 1/3 = 2/6. 3/6 + 2/6 = 5/6.',
      hint: 'Use the slider to find the least common denominator, then add the equivalent fractions.',
      visualization: () => <FractionVisualizer fractions={{ numerator1: 1, denominator1: 2, numerator2: 1, denominator2: 3 }} operation="add" />,
      points: 25,
      difficulty: 'hard'
    }
  ],
  'symmetry': [
    {
      id: 'symmetry-1',
      question: 'Which shape has line symmetry?',
      type: 'multiple-choice',
      options: ['Triangle', 'Square', 'Rectangle', 'All of the above'],
      correctAnswer: 'All of the above',
      explanation: 'All these shapes have line symmetry! You can draw a line through them and both sides will be identical.',
      hint: 'Think about folding each shape in half.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'symmetry-2',
      question: 'How many lines of symmetry does a square have?',
      type: 'multiple-choice',
      options: ['2', '4', '6', '8'],
      correctAnswer: '4',
      explanation: 'A square has 4 lines of symmetry: 2 diagonal lines and 2 lines through the middle of opposite sides.',
      hint: 'Draw a square and try folding it in different ways.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'symmetry-3',
      question: 'Which object shows rotational symmetry?',
      type: 'multiple-choice',
      options: ['Butterfly', 'Pinwheel', 'Triangle', 'Rectangle'],
      correctAnswer: 'Pinwheel',
      explanation: 'A pinwheel has rotational symmetry - it looks the same when you rotate it!',
      hint: 'Think about which object looks the same when you turn it around.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'symmetry-4',
      question: 'Use the symmetry visualizer to find all lines of symmetry in a square.',
      type: 'visual-select',
      correctAnswer: '4',
      explanation: 'A square has 4 lines of symmetry: 2 diagonal lines and 2 lines through the middle of opposite sides.',
      hint: 'Click on the shape to reveal the lines of symmetry, or make a guess first.',
      visualization: () => <SymmetryVisualizer shape="square" />,
      points: 20,
      difficulty: 'medium'
    },
    {
      id: 'symmetry-5',
      question: 'How many lines of symmetry does a regular pentagon have?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      explanation: 'A regular pentagon has 5 lines of symmetry. Regular polygons with n sides always have n lines of symmetry!',
      hint: 'Remember: regular polygon with n sides = n lines of symmetry.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'symmetry-6',
      question: 'Which statement about regular polygons is true?',
      type: 'multiple-choice',
      options: ['All regular polygons have the same number of lines of symmetry', 'A regular polygon with n sides has n lines of symmetry', 'Only even-sided polygons have lines of symmetry', 'Regular polygons have no lines of symmetry'],
      correctAnswer: 'A regular polygon with n sides has n lines of symmetry',
      explanation: 'This is the key property of regular polygons! The number of lines of symmetry always equals the number of sides.',
      hint: 'Think about the relationship between sides and symmetry lines in regular shapes.',
      points: 20,
      difficulty: 'hard'
    },
    {
      id: 'symmetry-7',
      question: 'Use the symmetry visualizer to find all lines of symmetry in a regular hexagon.',
      type: 'visual-select',
      correctAnswer: '6',
      explanation: 'A regular hexagon has 6 lines of symmetry. This follows the rule: regular polygon with n sides = n lines of symmetry.',
      hint: 'Click on the shape to reveal the lines of symmetry, or make a guess first.',
      visualization: () => <SymmetryVisualizer shape="hexagon" />,
      points: 25,
      difficulty: 'hard'
    }
  ],
  'integers': [
    {
      id: 'integer-1',
      question: 'Which number is greater: -5 or -3?',
      type: 'multiple-choice',
      options: ['-5', '-3', 'They are equal', 'Cannot compare'],
      correctAnswer: '-3',
      explanation: '-3 is greater than -5. On the number line, -3 is to the right of -5.',
      hint: 'Think about the number line - numbers to the right are greater.',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: 'integer-2',
      question: 'What is the opposite of +7?',
      type: 'input',
      correctAnswer: '-7',
      explanation: 'The opposite of +7 is -7. They are the same distance from zero but in opposite directions.',
      hint: 'Opposite numbers are the same distance from zero but on different sides.',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: 'integer-3',
      question: 'If the temperature is -5°C and it rises by 8°C, what is the new temperature?',
      type: 'input',
      correctAnswer: '3',
      explanation: '-5 + 8 = 3°C. The temperature rises from -5 to 3 degrees.',
      hint: 'Add the temperature rise to the current temperature.',
      points: 20,
      difficulty: 'hard'
    }
  ]
};

export const getQuestionsForLesson = (lessonId: string): Question[] => {
  return questions[lessonId] || [];
};