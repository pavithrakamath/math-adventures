import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Lightbulb, Calculator } from 'lucide-react';

interface PatternVisualizerProps {
  sequence: number[];
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  value: number;
}

export function PatternVisualizer({
  sequence = [],
  operation = 'add',
  value = 1,
}: PatternVisualizerProps) {
  const [stage, setStage] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  // Safety check for sequence
  if (!sequence || sequence.length === 0) {
    return (
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-900">
            Pattern Visualizer
          </h3>
        </div>
        <p className="text-yellow-700">
          No pattern data available for this question.
        </p>
      </div>
    );
  }

  const getOperationSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '+';
    }
  };

  const getOperationText = () => {
    switch (operation) {
      case 'add': return 'adding';
      case 'subtract': return 'subtracting';
      case 'multiply': return 'multiplying by';
      case 'divide': return 'dividing by';
      default: return 'adding';
    }
  };

  const calculateNext = (num: number) => {
    switch (operation) {
      case 'add': return num + value;
      case 'subtract': return num - value;
      case 'multiply': return num * value;
      case 'divide': return num / value;
      default: return num + value;
    }
  };

  const generateSequence = (start: number, length: number) => {
    const result = [start];
    let current = start;
    for (let i = 1; i < length; i++) {
      current = calculateNext(current);
      result.push(current);
    }
    return result;
  };

  const fullSequence = generateSequence(sequence[0], sequence.length + 3);
  const isCorrect = userInput === fullSequence[sequence.length].toString();

  const getStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Let's look at this pattern step by step. What do you notice about how the numbers change?
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg"
                >
                  {num}
                </div>
              ))}
              <div className="w-12 h-12 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center font-bold text-lg border-2 border-dashed">
                ?
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Look at the differences between consecutive numbers
              </p>
              <div className="flex justify-center gap-4">
                {sequence.slice(0, -1).map((num, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold">{num}</div>
                    <div className="text-sm text-muted-foreground">
                      {getOperationSymbol()} {value}
                    </div>
                    <div className="text-lg font-bold">
                      {calculateNext(num)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(1)}>
                I See the Pattern! <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Great! The pattern is {getOperationText()} {value} each time. 
              Now let's find the next number in the sequence.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg"
                >
                  {num}
                </div>
              ))}
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold text-lg">
                ?
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-bold mb-2">
                {sequence[sequence.length - 1]} {getOperationSymbol()} {value} = ?
              </p>
              <div className="flex justify-center gap-4 items-center">
                <span className="text-2xl font-bold">{sequence[sequence.length - 1]}</span>
                <span className="text-xl">{getOperationSymbol()}</span>
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xl">=</span>
                <span className="text-2xl font-bold text-primary">
                  {calculateNext(sequence[sequence.length - 1])}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(2)}>
                Try It Yourself <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Now you try! What's the next number in this pattern?
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg"
                >
                  {num}
                </div>
              ))}
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold text-lg border-2 border-dashed">
                ?
              </div>
            </div>
            <div className="text-center mb-6">
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-20 h-12 text-center text-xl font-bold border-2 border-primary rounded-lg"
                placeholder="?"
              />
              <Button 
                onClick={() => setShowAnswer(true)} 
                className="ml-4"
                disabled={!userInput}
              >
                Check
              </Button>
            </div>
            {showAnswer && (
              <div className={`p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}>
                <p className="text-center font-bold text-lg">
                  {isCorrect ? 'Correct! 🎉' : 'Not quite, but that\'s okay!'}
                </p>
                <p className="text-center mt-2">
                  The answer is {calculateNext(sequence[sequence.length - 1])}
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setStage(3)}>
                    Continue <ArrowRight />
                  </Button>
                </div>
              </div>
            )}
          </>
        );
      case 3:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Perfect! Now you understand the pattern. Let's see the complete sequence:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {fullSequence.map((num, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                    index < sequence.length
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">Pattern Rule:</p>
              <p className="text-muted-foreground">
                Start with {sequence[0]}, then {getOperationText()} {value} each time
              </p>
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="text-center font-bold">
                Great job! Now you can identify and continue number patterns!
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">
          Let's Work It Out Visually
        </h3>
      </div>
      <div>
        {getStageContent()}
      </div>
    </div>
  );
}

export default PatternVisualizer;