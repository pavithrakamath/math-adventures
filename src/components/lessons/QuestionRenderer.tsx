import { Button } from '../ui/button';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import type { Question } from '../../types/lesson.types';
import FactorChecker from '../visualizations/FactorChecker';
import PatternVisualizer from '../visualizations/PatternVisualizer';
import PatternHintVisualizer from '../visualizations/PatternHintVisualizer';
import ShapeVisualizer from '../visualizations/ShapeVisualizer';
import SymmetryVisualizer from '../visualizations/SymmetryVisualizer';
import FractionVisualizer from '../visualizations/FractionVisualizer';
import InteractiveBarGraph from '../visualizations/InteractiveBarGraph';
import InteractivePictograph from '../visualizations/InteractivePictograph';
import PerimeterVisual from '../visualizations/PerimeterVisual';

interface QuestionRendererProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  isCorrect: boolean;
  showExplanation?: boolean;
  onCheckAnswer?: () => void;
  onNextQuestion?: () => void;
  onTryAgain?: () => void;
}

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswerChange,
  isCorrect,
  showExplanation = false,
  onCheckAnswer,
  onNextQuestion,
  onTryAgain,
}: QuestionRendererProps) {
  
  // Function to detect if this is a pattern question
  const isPatternQuestion = (questionText: string) => {
    const patternKeywords = [
      'triangular numbers', 'triangular number', 'square numbers', 'square number', 
      'fibonacci', 'virahānka', 'virahanka', 'sequence', 'pattern', 'next number', 
      'next three numbers', 'what comes next', 'continue the pattern', 'cube number', 'cube numbers'
    ];
    return patternKeywords.some(keyword => 
      questionText.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Function to extract pattern type and sequence from question
  const getPatternInfo = (questionText: string) => {
    const text = questionText.toLowerCase();
    
    if (text.includes('triangular')) {
      return {
        type: 'triangular' as const,
        sequence: [1, 3, 6, 10, 15]
      };
    }
    
    if (text.includes('square')) {
      return {
        type: 'square' as const,
        sequence: [1, 4, 9, 16, 25]
      };
    }
    
    if (text.includes('cube')) {
      return {
        type: 'custom' as const,
        sequence: [1, 8, 27, 64, 125],
        customPattern: 'Cube numbers: n³'
      };
    }
    
    if (text.includes('fibonacci') || text.includes('virahānka') || text.includes('virahanka')) {
      return {
        type: 'fibonacci' as const,
        sequence: [1, 1, 2, 3, 5, 8]
      };
    }
    
    // Try to extract sequence from the question text
    const sequenceMatch = questionText.match(/(\d+(?:,\s*\d+)*)/);
    if (sequenceMatch) {
      const sequence = sequenceMatch[1].split(',').map(n => parseInt(n.trim()));
      return {
        type: 'arithmetic' as const,
        sequence
      };
    }
    
    return null;
  };

  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="mt-4 space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option}
                  name="answer"
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  disabled={isCorrect}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor={option} className="font-normal text-base cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'chart':
        // For chart questions, the "input" is the chart itself.
        return isCorrect ? (
          <input
            type="text"
            value={userAnswer}
            disabled={true}
            className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : null;
      default:
        return (
          <input
            type={question.type}
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here"
            disabled={isCorrect}
            className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
    }
  };

  const renderChart = () => {
    if (question.type === 'chart') {
      // Transform data from {name, value} to {label, value} format for InteractiveBarGraph
      const transformedData = question.data?.map((item, index) => ({
        label: item.name,
        value: item.value,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate distinct colors
        emoji: (item as { emoji?: string }).emoji
      })) || [];
      
      return (
        <>
          <div className="my-4 h-64">
            <InteractiveBarGraph
              data={transformedData}
              onDataChange={isCorrect ? () => {} : (data) => onAnswerChange(data[0]?.label || '')}
            />
          </div>
          <p className="font-code text-xl pt-2">{question.question}</p>
        </>
      );
    }
    if (question.type === 'pictograph') {
      return (
        <>
          <div className="my-4">
            <InteractivePictograph
              data={question.data || []}
              symbol={question.symbol || '📚'}
              scale={question.scale || 1}
              title={question.title}
              interactive={false}
            />
          </div>
          <p className="font-code text-xl pt-2">{question.question}</p>
        </>
      );
    }
    // Render a reference chart for other question types if data is provided
    if ('data' in question && question.data) {
      const transformedData = question.data.map((item, index) => ({
        label: item.name,
        value: item.value,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        emoji: (item as { emoji?: string }).emoji
      }));
      
      return (
        <div className="my-4 h-64">
          <InteractiveBarGraph 
            data={transformedData} 
            onDataChange={() => {}} // No-op for reference charts
          />
        </div>
      );
    }
    return null;
  };

  const renderInteractiveHint = () => {
    if (!question.interactiveHint) return null;

    try {
      switch (question.interactiveHint.type) {
        case 'factor-checker':
          return <FactorChecker targetNumber={question.interactiveHint.number} />;
        case 'pattern-visualizer':
          return <PatternVisualizer {...question.interactiveHint} />;
        case 'pattern-hint-visualizer':
          return <PatternHintVisualizer {...question.interactiveHint} />;
        case 'shape-visualizer':
          return <ShapeVisualizer {...question.interactiveHint} />;
        case 'symmetry-visualizer':
          return <SymmetryVisualizer {...question.interactiveHint} />;
        case 'fraction-visualizer':
          return <FractionVisualizer {...question.interactiveHint} />;
        case 'perimeter-visual':
          return <PerimeterVisual {...question.interactiveHint} />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering interactive hint:', error);
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Unable to load interactive visualization.</p>
        </div>
      );
    }
  };

  const renderExplanation = () => {
    if (question.interactiveHint) {
      return (
        <div className="mt-6 space-y-4">
          {/* Show text hint first if it exists */}
          {question.hint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Let's think about this...
                </h3>
              </div>
              <div>
                <p className="text-gray-700 whitespace-pre-wrap">{question.hint}</p>
              </div>
            </div>
          )}
          
          {/* Then show the visualizer */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="mr-2 h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Let's Work It Out Visually
              </h3>
            </div>
            <div>
              {renderInteractiveHint()}
            </div>
          </div>
        </div>
      );
    }

    // Auto-detect pattern questions and show appropriate visualization
    if (isPatternQuestion(question.text)) {
      const patternInfo = getPatternInfo(question.text);
      if (patternInfo) {
        return (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">
                Let's Work It Out Visually
              </h3>
            </div>
            <div>
              <PatternHintVisualizer
                patternType={patternInfo.type}
                sequence={patternInfo.sequence}
              />
            </div>
          </div>
        );
      }
    }

    const title = isCorrect ? "Here's how we got that!" : "Let's think about this...";

    return (
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">
            {title}
          </h3>
        </div>
        <div>
          <p className="text-gray-700 whitespace-pre-wrap">{question.hint}</p>
        </div>
      </div>
    );
  };

  const isAnswered = userAnswer.trim() !== '';

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>
      {renderChart()}
      {renderInput()}
      
      <div className="flex gap-2">
        {!isCorrect && !showExplanation && (
          <Button onClick={onCheckAnswer} disabled={!isAnswered}>
            Check Answer
          </Button>
        )}
        {isCorrect && onNextQuestion && (
          <Button onClick={onNextQuestion} className="bg-green-600 hover:bg-green-700">
            Next Question
          </Button>
        )}
        {!isCorrect && showExplanation && onTryAgain && (
          <Button onClick={onTryAgain} variant="secondary">
            Try Again
          </Button>
        )}
      </div>

      {isCorrect && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Correct! Great job!</span>
        </div>
      )}

      {!isCorrect && showExplanation && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Not quite! Let's work through this together.</span>
        </div>
      )}

      {showExplanation && renderExplanation()}
    </div>
  );
}
