import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Lightbulb, Ruler } from 'lucide-react';

interface ShapeVisualizerProps {
  shape: 'rectangle' | 'square';
  width: number;
  height: number;
  calculation: 'perimeter' | 'area';
}

export function ShapeVisualizer({
  shape = 'rectangle',
  width = 5,
  height = 3,
  calculation = 'perimeter',
}: ShapeVisualizerProps) {
  const [stage, setStage] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const isSquare = shape === 'square';
  const actualHeight = isSquare ? width : height;
  const perimeter = 2 * (width + actualHeight);
  const area = width * actualHeight;
  const correctAnswer = calculation === 'perimeter' ? perimeter : area;

  const isCorrect = userInput === correctAnswer.toString();

  const getStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Let's visualize this {shape} and understand how to calculate its {calculation}.
            </p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="border-4 border-primary bg-primary/20"
                  style={{
                    width: `${width * 20}px`,
                    height: `${actualHeight * 20}px`,
                  }}
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-sm font-bold">Width: {width}</span>
                </div>
                <div className="absolute -right-8 top-0 bottom-0 flex items-center">
                  <span className="text-sm font-bold transform -rotate-90">
                    Height: {actualHeight}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">
                {isSquare ? 'Square' : 'Rectangle'} Dimensions:
              </p>
              <p className="text-muted-foreground">
                Width = {width}, Height = {actualHeight}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(1)}>
                Let's Calculate! <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Now let's learn the formula for {calculation} of a {shape}.
            </p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="border-4 border-primary bg-primary/20"
                  style={{
                    width: `${width * 20}px`,
                    height: `${actualHeight * 20}px`,
                  }}
                />
                {calculation === 'perimeter' && (
                  <>
                    <div className="absolute inset-0 border-2 border-dashed border-red-500" />
                    <div className="absolute -top-8 left-0 right-0 text-center">
                      <span className="text-sm font-bold text-red-600">Perimeter = distance around</span>
                    </div>
                  </>
                )}
                {calculation === 'area' && (
                  <>
                    <div className="absolute inset-0 bg-green-200/50" />
                    <div className="absolute -top-8 left-0 right-0 text-center">
                      <span className="text-sm font-bold text-green-600">Area = space inside</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">
                Formula for {calculation}:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <p className="text-xl font-bold">
                  {calculation === 'perimeter' 
                    ? `P = 2 × (width + height)`
                    : `A = width × height`
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(2)}>
                Apply the Formula <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Let's apply the formula to our {shape}:
            </p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="border-4 border-primary bg-primary/20"
                  style={{
                    width: `${width * 20}px`,
                    height: `${actualHeight * 20}px`,
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-4">Step-by-step calculation:</p>
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto">
                <p className="text-lg">
                  <strong>Given:</strong> Width = {width}, Height = {actualHeight}
                </p>
                <p className="text-lg mt-2">
                  <strong>Formula:</strong> {calculation === 'perimeter' 
                    ? `P = 2 × (width + height)`
                    : `A = width × height`
                  }
                </p>
                <p className="text-lg mt-2">
                  <strong>Substitute:</strong> {calculation === 'perimeter' 
                    ? `P = 2 × (${width} + ${actualHeight})`
                    : `A = ${width} × ${actualHeight}`
                  }
                </p>
                <p className="text-lg mt-2">
                  <strong>Calculate:</strong> {calculation === 'perimeter' 
                    ? `P = 2 × ${width + actualHeight} = ${perimeter}`
                    : `A = ${area}`
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(3)}>
                Try It Yourself <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Now you try! What's the {calculation} of this {shape}?
            </p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="border-4 border-primary bg-primary/20"
                  style={{
                    width: `${width * 20}px`,
                    height: `${actualHeight * 20}px`,
                  }}
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-sm font-bold">Width: {width}</span>
                </div>
                <div className="absolute -right-8 top-0 bottom-0 flex items-center">
                  <span className="text-sm font-bold transform -rotate-90">
                    Height: {actualHeight}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center mb-6">
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-24 h-12 text-center text-xl font-bold border-2 border-primary rounded-lg"
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
                  The {calculation} is {correctAnswer}
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setStage(4)}>
                    Continue <ArrowRight />
                  </Button>
                </div>
              </div>
            )}
          </>
        );
      case 4:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Excellent! You've mastered {calculation} calculations for {shape}s!
            </p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="border-4 border-green-500 bg-green-200"
                  style={{
                    width: `${width * 20}px`,
                    height: `${actualHeight * 20}px`,
                  }}
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-sm font-bold text-green-600">Width: {width}</span>
                </div>
                <div className="absolute -right-8 top-0 bottom-0 flex items-center">
                  <span className="text-sm font-bold transform -rotate-90 text-green-600">
                    Height: {actualHeight}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">Final Answer:</p>
              <div className="bg-green-100 p-4 rounded-lg inline-block">
                <p className="text-xl font-bold text-green-800">
                  {calculation === 'perimeter' ? 'Perimeter' : 'Area'} = {correctAnswer}
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="text-center font-bold">
                Great job! Now you can calculate {calculation} for any {shape}!
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

export default ShapeVisualizer;