import React, { useState } from 'react';

interface PalindromeVisualizerProps {
  number?: number;
}

const PalindromeVisualizer: React.FC<PalindromeVisualizerProps> = ({ number = 12321 }) => {
  const [inputNumber, setInputNumber] = useState(number.toString());
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ isPalindrome: boolean; steps: string[] } | null>(null);

  const checkPalindrome = () => {
    setIsChecking(true);
    const num = inputNumber;
    const reversed = num.split('').reverse().join('');
    const isPalindrome = num === reversed;
    
    const steps = [
      `Original number: ${num}`,
      `Reversed number: ${reversed}`,
      `Are they the same? ${isPalindrome ? 'Yes!' : 'No!'}`,
      `Result: ${isPalindrome ? 'PALINDROME!' : 'Not a palindrome'}`
    ];
    
    setResult({ isPalindrome, steps });
    setIsChecking(false);
  };

  const reverseAndAdd = () => {
    setIsChecking(true);
    let current = parseInt(inputNumber);
    const steps = [];
    let count = 0;
    
    while (count < 10) { // Limit to prevent infinite loops
      const currentStr = current.toString();
      const reversed = currentStr.split('').reverse().join('');
      const reversedNum = parseInt(reversed);
      const sum = current + reversedNum;
      
      steps.push(`${current} + ${reversed} = ${sum}`);
      
      if (sum.toString() === sum.toString().split('').reverse().join('')) {
        steps.push(`🎉 Found palindrome: ${sum}!`);
        break;
      }
      
      current = sum;
      count++;
    }
    
    setResult({ isPalindrome: false, steps });
    setIsChecking(false);
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">🔄 Palindrome Explorer</h3>
        <p className="text-gray-600">Discover numbers that read the same forwards and backwards!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Enter a number:</label>
          <input
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            className="w-full p-3 border rounded-lg text-center text-lg"
            placeholder="Enter a number"
          />
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={checkPalindrome}
            disabled={isChecking}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Check Palindrome
          </button>
          <button
            onClick={reverseAndAdd}
            disabled={isChecking}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            Reverse & Add
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-center">
            {result.isPalindrome ? '🎉 It\'s a Palindrome!' : 'Reverse & Add Process:'}
          </h4>
          <div className="space-y-2">
            {result.steps.map((step, index) => (
              <div key={index} className="text-sm bg-white p-2 rounded border-l-4 border-blue-500">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        <p>💡 Try numbers like: 121, 1331, 12321, or 1234 for reverse & add!</p>
      </div>
    </div>
  );
};

export default PalindromeVisualizer;
