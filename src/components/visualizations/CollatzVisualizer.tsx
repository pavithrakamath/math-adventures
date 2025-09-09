import { useState } from 'react';
import { ArrowRight, Lightbulb, Repeat, PartyPopper, Calculator } from 'lucide-react';

interface CollatzVisualizerProps {
  initialNumber?: number;
}

export function CollatzVisualizer({ initialNumber = 27 }: CollatzVisualizerProps) {
  const [inputNumber, setInputNumber] = useState(initialNumber.toString());
  const [sequence, setSequence] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleStart = () => {
    const num = parseInt(inputNumber);
    if (isNaN(num) || num <= 0) return;
    
    setSequence([num]);
    setIsFinished(num === 1);
    setIsRunning(false);
  };

  const handleNextStep = () => {
    if (isFinished || sequence.length === 0) return;

    const currentNumber = sequence[sequence.length - 1];
    if (currentNumber === 1) {
      setIsFinished(true);
      return;
    }

    let nextNumber;
    if (currentNumber % 2 === 0) {
      nextNumber = currentNumber / 2;
    } else {
      nextNumber = 3 * currentNumber + 1;
    }
    
    setSequence(prev => [...prev, nextNumber]);
  };

  const handleReset = () => {
    setSequence([]);
    setIsFinished(false);
    setIsRunning(false);
  };

  const handleRunAll = () => {
    const num = parseInt(inputNumber);
    if (isNaN(num) || num <= 0) return;
    
    setIsRunning(true);
    const newSequence = [num];
    let current = num;
    
    while (current !== 1) {
      if (current % 2 === 0) {
        current = current / 2;
      } else {
        current = 3 * current + 1;
      }
      newSequence.push(current);
      
      // Safety check to prevent infinite loops
      if (newSequence.length > 1000) break;
    }
    
    setSequence(newSequence);
    setIsFinished(true);
    setIsRunning(false);
  };

  const getCurrentNumber = () => {
    return sequence.length > 0 ? sequence[sequence.length - 1] : parseInt(inputNumber) || 0;
  };

  const getRuleDescription = () => {
    const current = getCurrentNumber();
    if (current === 1) return null;
    
    const isEven = current % 2 === 0;
    if (isEven) {
      return (
        <p className="text-gray-600">
          The current number, <strong className="text-gray-900">{current}</strong>, is{' '}
          <strong className="text-blue-500">EVEN</strong>. The rule is to divide by 2.
        </p>
      );
    }
    return (
      <p className="text-gray-600">
        The current number, <strong className="text-gray-900">{current}</strong>, is{' '}
        <strong className="text-amber-500">ODD</strong>. The rule is to multiply by 3 and add 1.
      </p>
    );
  };

  const getCalculation = () => {
    const current = getCurrentNumber();
    if (current === 1) return null;
    
    const isEven = current % 2 === 0;
    if (isEven) {
      return (
        <span className="font-mono text-lg">
          {current} ÷ 2 = {current / 2}
        </span>
      );
    }
    return (
      <span className="font-mono text-lg">
        (3 × {current}) + 1 = {3 * current + 1}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
          <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
          The Collatz Conjecture Journey
        </h3>
        <p className="text-gray-600">Watch any number transform into 1 following simple rules!</p>
      </div>
      <p className="text-gray-600 mb-4">
        The Collatz Conjecture is a famous unsolved problem in mathematics. It says if you take any positive number and follow these simple rules, you will always eventually reach 1. Let's try it out!
      </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Enter a starting number:</label>
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-lg"
              placeholder="Enter a positive number"
              min="1"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleStart}
              disabled={!inputNumber || parseInt(inputNumber) <= 0}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 font-semibold"
            >
              Start Journey
            </button>
            <button
              onClick={handleRunAll}
              disabled={!inputNumber || parseInt(inputNumber) <= 0 || isRunning}
              className="px-6 py-2 border border-green-500 text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50 font-semibold flex items-center"
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isRunning ? 'Running...' : 'Run All Steps'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-500 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold flex items-center"
            >
              <Repeat className="mr-2 h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {sequence.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-4 shadow-inner min-h-[6rem] mb-4">
            {sequence.map((num, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`flex h-10 w-10 items-center justify-center rounded-md border text-xl font-bold bg-white transition-all ${
                  index === sequence.length - 1 && !isFinished ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                }`}>
                  {num}
                </span>
                {index < sequence.length - 1 && <ArrowRight className="h-5 w-5 text-gray-400" />}
              </div>
            ))}
          </div>
        )}

        {sequence.length > 0 && !isFinished && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h4 className="font-bold mb-2">What's the next step?</h4>
            {getRuleDescription()}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
              >
                Calculate Next Number
              </button>
              <div className="bg-blue-100 p-2 rounded-md">
                {getCalculation()}
              </div>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="mt-6 rounded-lg border border-green-500 bg-green-50 p-4 text-green-800">
            <h4 className="font-bold flex items-center">
              <PartyPopper className="mr-2 h-5 w-5" /> 
              You reached 1!
            </h4>
            <p className="mt-2">
              Amazing! You've seen the conjecture in action. The sequence took {sequence.length - 1} steps to reach 1. 
              No matter what number mathematicians have tried, they've always ended up at 1. It's a simple pattern, 
              but nobody has been able to prove it's true for ALL numbers.
            </p>
            <div className="mt-4 text-sm">
              <p><strong>Sequence length:</strong> {sequence.length} numbers</p>
              <p><strong>Steps taken:</strong> {sequence.length - 1}</p>
              <p><strong>Peak value:</strong> {Math.max(...sequence)}</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 border border-green-500 text-green-800 hover:bg-green-100 hover:text-green-900 rounded-lg font-semibold flex items-center"
            >
              <Repeat className="mr-2" /> Try Another Number
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
          <p>💡 <strong>Fun Fact:</strong> Try numbers like 27, 15, or 7 to see interesting sequences!</p>
        </div>
    </div>
  );
}

export default CollatzVisualizer;
