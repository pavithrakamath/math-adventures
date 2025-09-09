import { useState } from 'react';
import { ArrowRight, Repeat, PartyPopper, Calculator, Sparkles } from 'lucide-react';

interface KaprekarVisualizerProps {
  initialNumber?: string;
}

interface KaprekarStep {
  stepNumber: number;
  currentNumber: string;
  largest: string;
  smallest: string;
  difference: string;
  isKaprekar?: boolean;
}

export const KaprekarVisualizer: React.FC<KaprekarVisualizerProps> = ({
  initialNumber = '1234'
}) => {
  const [inputNumber, setInputNumber] = useState(initialNumber);
  const [sequence, setSequence] = useState<KaprekarStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const validateInput = (input: string): boolean => {
    if (!/^\d{4}$/.test(input)) return false;
    const uniqueDigits = new Set(input.split(''));
    return uniqueDigits.size > 1; // Must have at least 2 different digits
  };

  const createKaprekarStep = (currentNum: string, stepNum: number): KaprekarStep => {
    const padded = currentNum.padStart(4, '0');
    const digits = padded.split('').sort();
    const smallest = digits.join('');
    const largest = digits.reverse().join('');
    const difference = (parseInt(largest) - parseInt(smallest)).toString().padStart(4, '0');
    
    return {
      stepNumber: stepNum,
      currentNumber: padded,
      largest,
      smallest,
      difference,
      isKaprekar: difference === '6174'
    };
  };

  const handleStart = () => {
    if (!validateInput(inputNumber)) return;
    
    const initialStep = createKaprekarStep(inputNumber, 1);
    setSequence([initialStep]);
    setIsFinished(initialStep.difference === '6174');
    setIsRunning(false);
  };

  const handleNextStep = () => {
    if (isFinished || sequence.length === 0) return;

    const lastStep = sequence[sequence.length - 1];
    
    // If the last step's difference is 6174, add one final step showing 6174
    if (lastStep.difference === '6174') {
      const finalStep: KaprekarStep = {
        stepNumber: sequence.length + 1,
        currentNumber: '6174',
        largest: '7641',
        smallest: '1467',
        difference: '6174',
        isKaprekar: true
      };
      setSequence(prev => [...prev, finalStep]);
      setIsFinished(true);
      return;
    }

    const nextStep = createKaprekarStep(lastStep.difference, sequence.length + 1);
    setSequence(prev => [...prev, nextStep]);
    
    if (nextStep.difference === '6174') {
      // Don't set finished yet, let the user click once more to see 6174
    }
  };

  const handleReset = () => {
    setSequence([]);
    setIsFinished(false);
    setIsRunning(false);
  };

  const handleRunAll = () => {
    if (!validateInput(inputNumber)) return;
    
    setIsRunning(true);
    const newSequence: KaprekarStep[] = [];
    let current = inputNumber;
    let stepCount = 1;
    
    while (stepCount <= 7) { // Kaprekar's process always converges within 7 steps
      const step = createKaprekarStep(current, stepCount);
      newSequence.push(step);
      
      if (step.difference === '6174') {
        // Add the final step showing 6174
        const finalStep: KaprekarStep = {
          stepNumber: stepCount + 1,
          currentNumber: '6174',
          largest: '7641',
          smallest: '1467',
          difference: '6174',
          isKaprekar: true
        };
        newSequence.push(finalStep);
        break;
      }
      
      current = step.difference;
      stepCount++;
    }
    
    setSequence(newSequence);
    setIsFinished(true);
    setIsRunning(false);
  };

  const getCurrentStep = () => {
    return sequence.length > 0 ? sequence[sequence.length - 1] : null;
  };

  const getRuleDescription = () => {
    const current = getCurrentStep();
    if (!current) return null;
    
    // Don't show if we're already at the final 6174 step
    if (current.currentNumber === '6174' && current.isKaprekar) return null;
    
    return (
      <div className="space-y-3">
        <p className="text-gray-600 text-center">
          Take the current number and rearrange its digits:
        </p>
        
        <div className="flex items-center justify-center gap-4 text-lg">
          <div className="text-center">
            <div className="text-gray-500 text-sm">Current Number</div>
            <div className="font-mono text-xl font-bold bg-gray-100 px-3 py-2 rounded">
              {current.currentNumber}
            </div>
          </div>
          
          <div className="text-gray-400">→</div>
          
          <div className="text-center">
            <div className="text-blue-600 text-sm font-medium">Largest to Smallest</div>
            <div className="font-mono text-xl font-bold bg-blue-50 text-blue-800 px-3 py-2 rounded">
              {current.largest}
            </div>
          </div>
          
          <div className="text-xl font-bold text-gray-600">-</div>
          
          <div className="text-center">
            <div className="text-green-600 text-sm font-medium">Smallest to Largest</div>
            <div className="font-mono text-xl font-bold bg-green-50 text-green-800 px-3 py-2 rounded">
              {current.smallest}
            </div>
          </div>
          
          <div className="text-xl font-bold text-gray-600">=</div>
          
          <div className="text-center">
            <div className="text-purple-600 text-sm font-medium">Result</div>
            <div className="font-mono text-xl font-bold bg-purple-50 text-purple-800 px-3 py-2 rounded">
              {current.difference}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCalculation = () => {
    const current = getCurrentStep();
    if (!current) return null;
    
    // Don't show if we're already at the final 6174 step
    if (current.currentNumber === '6174' && current.isKaprekar) return null;
    
    return (
      <span className="font-mono text-lg">
        {current.largest} - {current.smallest} = {current.difference}
      </span>
    );
  };


  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
          Kaprekar's Magic Number Journey
        </h3>
        <p className="text-gray-600">Watch any 4-digit number transform into 6174 following Kaprekar's process!</p>
      </div>

      <p className="text-gray-600 mb-4">
        Kaprekar's process is a fascinating mathematical operation. Take any 4-digit number with at least two different digits, 
        arrange the digits from largest to smallest and smallest to largest, then subtract. 
        Repeat this process and you'll always reach 6174 - Kaprekar's constant!
      </p>
        
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Enter a 4-digit number (with at least 2 different digits):</label>
          <input
            type="text"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            className="w-full p-3 border rounded-lg text-center text-lg"
            placeholder="1234"
            maxLength={4}
          />
          {inputNumber.length === 4 && !validateInput(inputNumber) && (
            <p className="text-red-600 text-sm mt-1">Please use at least 2 different digits (e.g., not 1111)</p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleStart}
            disabled={!validateInput(inputNumber)}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 font-semibold"
          >
            Start Journey
          </button>
          <button
            onClick={handleRunAll}
            disabled={!validateInput(inputNumber) || isRunning}
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
          {sequence.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`flex h-12 w-16 items-center justify-center rounded-md border text-sm font-bold bg-white transition-all ${
                index === sequence.length - 1 && !isFinished ? 'border-2 border-purple-500 ring-2 ring-purple-200' : 
                step.isKaprekar ? 'border-2 border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                {step.currentNumber}
              </span>
              {index < sequence.length - 1 && <ArrowRight className="h-5 w-5 text-gray-400" />}
            </div>
          ))}
        </div>
      )}

      {sequence.length > 0 && !isFinished && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <h4 className="font-bold mb-2">
            {(() => {
              const current = getCurrentStep();
              if (!current) return 'What\'s the next step?';
              
              // If we're at 8352, the next calculation will give us 6174
              const digits = current.difference.split('').sort();
              const smallest = digits.join('');
              const largest = digits.reverse().join('');
              const nextResult = (parseInt(largest) - parseInt(smallest)).toString().padStart(4, '0');
              
              return nextResult === '6174' ? 'Final step - reaching Kaprekar\'s constant!' : 'What\'s the next step?';
            })()}
          </h4>
          {getRuleDescription()}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
            >
              {(() => {
                const current = getCurrentStep();
                if (!current) return 'Calculate Next Number';
                
                // If we're at 8352, the next calculation will give us 6174
                const digits = current.difference.split('').sort();
                const smallest = digits.join('');
                const largest = digits.reverse().join('');
                const nextResult = (parseInt(largest) - parseInt(smallest)).toString().padStart(4, '0');
                
                return nextResult === '6174' ? 'Show 6174!' : 'Calculate Next Number';
              })()}
            </button>
            <div className="bg-purple-100 p-2 rounded-md">
              {getCalculation()}
            </div>
          </div>
        </div>
      )}

      {isFinished && (
        <div className="mt-6 rounded-lg border border-green-500 bg-green-50 p-4 text-green-800">
          <h4 className="font-bold flex items-center">
            <PartyPopper className="mr-2 h-5 w-5" /> 
            You reached 6174 - Kaprekar's Constant!
          </h4>
          <p className="mt-2">
            Incredible! You've witnessed the magic of Kaprekar's process. The sequence took {sequence.length - 1} steps to reach 6174. 
            This amazing mathematical constant was discovered by D.R. Kaprekar, and remarkably, 
            every 4-digit number (with at least two different digits) will eventually reach 6174!
          </p>
          <div className="mt-4 text-sm">
            <p><strong>Sequence length:</strong> {sequence.length} numbers</p>
            <p><strong>Steps taken:</strong> {sequence.length - 1}</p>
            <p><strong>Starting number:</strong> {inputNumber}</p>
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
        <p>💡 <strong>Fun Fact:</strong> Try numbers like 3524, 1001, or 2005 to see interesting transformation paths!</p>
      </div>
    </div>
  );
};

export default KaprekarVisualizer;