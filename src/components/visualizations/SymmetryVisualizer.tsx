import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface SymmetryVisualizerProps {
  shape: 'square' | 'letter-r';
  onComplete?: (isCorrect: boolean, linesFound: number) => void;
  showHint?: boolean;
}

export function SymmetryVisualizer({ shape = 'square' }: SymmetryVisualizerProps) {
  const [stage, setStage] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const getShapeComponent = () => {
    if (shape === 'square') {
      return (
        <div className="w-32 h-32 border-4 border-primary bg-primary/20 relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-500 transform -translate-x-0.5" />
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 transform -translate-y-0.5" />
          {/* Diagonal lines */}
          <div className="absolute top-0 left-0 bottom-0 right-0">
            <div className="w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full transform rotate-45 origin-center">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-500 transform -translate-x-0.5" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full transform -rotate-45 origin-center">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-500 transform -translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-32 h-32 border-4 border-primary bg-primary/20 relative flex items-center justify-center">
          <div className="text-6xl font-bold text-primary">R</div>
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-500 transform -translate-x-0.5" />
        </div>
      );
    }
  };

  const getInteractiveShape = () => {
    if (shape === 'square') {
      return (
        <div className="w-32 h-32 border-4 border-primary bg-primary/20 relative">
          {selectedLine === 0 && (
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-500 transform -translate-x-0.5" />
          )}
          {selectedLine === 1 && (
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 transform -translate-y-0.5" />
          )}
          {selectedLine === 2 && (
            <div className="absolute top-0 left-0 bottom-0 right-0">
              <div className="absolute top-0 left-0 w-full h-full transform rotate-45 origin-center">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-0.5" />
              </div>
            </div>
          )}
          {selectedLine === 3 && (
            <div className="absolute top-0 left-0 bottom-0 right-0">
              <div className="absolute top-0 left-0 w-full h-full transform -rotate-45 origin-center">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-0.5" />
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-32 h-32 border-4 border-primary bg-primary/20 relative flex items-center justify-center">
          <div className="text-6xl font-bold text-primary">R</div>
          {selectedLine === 0 && (
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-500 transform -translate-x-0.5" />
          )}
        </div>
      );
    }
  };

  const getStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Let's explore symmetry! A line of symmetry divides a shape into two identical halves.
            </p>
            <div className="flex justify-center mb-6">
              {getShapeComponent()}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">
                {shape === 'square' ? 'Square' : 'Letter R'} - Can you find the lines of symmetry?
              </p>
              <p className="text-muted-foreground">
                Click on the lines to see if they create symmetry
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(1)}>
                Let's Find Them! <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Click on the lines to see if they create symmetry. A line of symmetry means both sides are identical.
            </p>
            <div className="flex justify-center mb-6">
              {getInteractiveShape()}
            </div>
            <div className="text-center mb-6">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {shape === 'square' ? (
                  <>
                    <Button
                      variant={selectedLine === 0 ? 'default' : 'outline'}
                      onClick={() => setSelectedLine(selectedLine === 0 ? null : 0)}
                    >
                      Vertical Line
                    </Button>
                    <Button
                      variant={selectedLine === 1 ? 'default' : 'outline'}
                      onClick={() => setSelectedLine(selectedLine === 1 ? null : 1)}
                    >
                      Horizontal Line
                    </Button>
                    <Button
                      variant={selectedLine === 2 ? 'default' : 'outline'}
                      onClick={() => setSelectedLine(selectedLine === 2 ? null : 2)}
                    >
                      Diagonal Line 1
                    </Button>
                    <Button
                      variant={selectedLine === 3 ? 'default' : 'outline'}
                      onClick={() => setSelectedLine(selectedLine === 3 ? null : 3)}
                    >
                      Diagonal Line 2
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={selectedLine === 0 ? 'default' : 'outline'}
                    onClick={() => setSelectedLine(selectedLine === 0 ? null : 0)}
                    className="col-span-2"
                  >
                    Vertical Line
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(2)}>
                Check My Answer <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Let's check your answer! Here are the correct lines of symmetry:
            </p>
            <div className="flex justify-center mb-6">
              {getShapeComponent()}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">Lines of Symmetry:</p>
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                {shape === 'square' ? (
                  <div className="text-left">
                    <p className="text-lg">✓ Vertical line (red)</p>
                    <p className="text-lg">✓ Horizontal line (red)</p>
                    <p className="text-lg">✓ Diagonal line 1 (blue)</p>
                    <p className="text-lg">✓ Diagonal line 2 (blue)</p>
                    <p className="text-lg font-bold mt-2">Total: 4 lines of symmetry</p>
                  </div>
                ) : (
                  <div className="text-left">
                    <p className="text-lg">✓ Vertical line (red)</p>
                    <p className="text-lg font-bold mt-2">Total: 1 line of symmetry</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStage(3)}>
                I Understand! <ArrowRight />
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              Great! Now let's test your understanding. How many lines of symmetry does this {shape} have?
            </p>
            <div className="flex justify-center mb-6">
              {getShapeComponent()}
            </div>
            <div className="text-center mb-6">
              <input
                type="number"
                value={showAnswer ? (shape === 'square' ? '4' : '1') : ''}
                onChange={() => {}}
                className="w-20 h-12 text-center text-xl font-bold border-2 border-primary rounded-lg"
                placeholder="?"
                disabled={showAnswer}
              />
              <Button 
                onClick={() => setShowAnswer(true)} 
                className="ml-4"
                disabled={showAnswer}
              >
                Check
              </Button>
            </div>
            {showAnswer && (
              <div className="p-4 rounded-lg border-2 bg-green-50 border-green-500 text-green-800">
                <p className="text-center font-bold text-lg">
                  Correct! 🎉
                </p>
                <p className="text-center mt-2">
                  The {shape} has {shape === 'square' ? '4' : '1'} line{shape === 'square' ? 's' : ''} of symmetry
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
              Excellent! You've mastered symmetry!
            </p>
            <div className="flex justify-center mb-6">
              {getShapeComponent()}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-2">Summary:</p>
              <div className="bg-green-100 p-4 rounded-lg inline-block">
                <p className="text-lg font-bold text-green-800">
                  {shape === 'square' ? 'Square' : 'Letter R'} has {shape === 'square' ? '4' : '1'} line{shape === 'square' ? 's' : ''} of symmetry
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="text-center font-bold">
                Great job! Now you can identify lines of symmetry in any shape!
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

export default SymmetryVisualizer;