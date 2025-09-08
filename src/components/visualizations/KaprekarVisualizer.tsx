import React, { useState } from 'react';

interface KaprekarVisualizerProps {
  initialNumber?: number;
}

const KaprekarVisualizer: React.FC<KaprekarVisualizerProps> = ({ initialNumber = 1234 }) => {
  const [inputNumber, setInputNumber] = useState(initialNumber.toString());
  const [steps, setSteps] = useState<Array<{step: number, number: string, largest: string, smallest: string, difference: string}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasReached6174, setHasReached6174] = useState(false);

  const runKaprekarProcess = () => {
    setIsRunning(true);
    setSteps([]);
    setHasReached6174(false);
    
    let current = inputNumber.padStart(4, '0');
    const newSteps = [];
    let stepCount = 0;
    const maxSteps = 10;

    while (stepCount < maxSteps) {
      // Ensure we have 4 digits
      current = current.padStart(4, '0');
      
      // Create largest and smallest numbers
      const digits = current.split('').sort();
      const smallest = digits.join('');
      const largest = digits.reverse().join('');
      
      // Calculate difference
      const difference = (parseInt(largest) - parseInt(smallest)).toString().padStart(4, '0');
      
      newSteps.push({
        step: stepCount + 1,
        number: current,
        largest,
        smallest,
        difference
      });

      if (difference === '6174') {
        setHasReached6174(true);
        break;
      }

      current = difference;
      stepCount++;
    }

    setSteps(newSteps);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">✨ Kaprekar's Magic Number</h3>
        <p className="text-gray-600">Watch any 4-digit number transform into 6174!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Enter a 4-digit number:</label>
          <input
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            className="w-full p-3 border rounded-lg text-center text-lg"
            placeholder="1234"
            maxLength={4}
          />
        </div>

        <button
          onClick={runKaprekarProcess}
          disabled={isRunning || inputNumber.length < 4}
          className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 font-semibold"
        >
          {isRunning ? 'Running Magic...' : 'Start Magic Process!'}
        </button>
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-lg">
              {hasReached6174 ? '🎉 Magic Complete! Reached 6174!' : 'Magic in Progress...'}
            </h4>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="text-center mb-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Step {step.step}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-600">Current Number:</div>
                    <div className="text-lg font-mono bg-white p-2 rounded border text-center">
                      {step.number}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-600">Difference:</div>
                    <div className="text-lg font-mono bg-white p-2 rounded border text-center">
                      {step.difference}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border">
                    <div className="font-medium text-gray-600">Largest:</div>
                    <div className="font-mono">{step.largest}</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="font-medium text-gray-600">Smallest:</div>
                    <div className="font-mono">{step.smallest}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
        <p>💡 <strong>Fun Fact:</strong> This magic always works with any 4-digit number that has at least two different digits!</p>
      </div>
    </div>
  );
};

export default KaprekarVisualizer;
