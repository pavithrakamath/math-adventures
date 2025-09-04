import React, { useState, useEffect } from 'react';

interface FactorCheckerProps {
  targetNumber?: number;
  onComplete?: (isPrime: boolean, factors: number[]) => void;
  showHint?: boolean;
}

const FactorChecker: React.FC<FactorCheckerProps> = ({ 
  targetNumber, 
  onComplete, 
  showHint = true 
}) => {
  const [number, setNumber] = useState<number>(targetNumber || 17);
  const [checkedFactors, setCheckedFactors] = useState<Set<number>>(new Set());
  const [foundFactors, setFoundFactors] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isPrime, setIsPrime] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Calculate all distinct factors of the number
  const getAllFactors = (num: number): number[] => {
    const factors: number[] = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        factors.push(i);
      }
    }
    return factors;
  };

  const allFactors = getAllFactors(number);
  const maxCheck = Math.floor(number / 2);
  const factorsToCheck = Array.from({ length: maxCheck }, (_, i) => i + 1);

  useEffect(() => {
    setCheckedFactors(new Set());
    setFoundFactors([]);
    setIsComplete(false);
    setShowResult(false);
    setIsPrime(false);
    
    // Handle special case: 1 is neither prime nor composite
    if (number === 1) {
      setIsComplete(true);
      setShowResult(true);
      setIsPrime(false); // We'll handle this specially in the display
    }
  }, [number]);

  const handleFactorClick = (factor: number) => {
    if (isComplete) return;

    const newCheckedFactors = new Set(checkedFactors);
    newCheckedFactors.add(factor);

    if (number % factor === 0) {
      const partner = number / factor;
      const newFoundFactors = [...foundFactors];
      
      // Add the factor if not already added
      if (!newFoundFactors.includes(factor)) {
        newFoundFactors.push(factor);
      }
      
      // Add the partner factor if it's different and not already added
      if (partner !== factor && !newFoundFactors.includes(partner)) {
        newFoundFactors.push(partner);
      }
      
      // Special case: when student clicks 1, automatically add the number itself
      if (factor === 1 && !newFoundFactors.includes(number)) {
        newFoundFactors.push(number);
      }
      
      setFoundFactors(newFoundFactors);
      
      // Mark as composite if we found any factor other than 1 and the number itself
      if (factor !== 1 && factor !== number) {
        setIsPrime(false);
      }
      
      // Check if we've found all factors after updating
      const foundAllFactors = allFactors.every(factor => newFoundFactors.includes(factor));
      
      if (foundAllFactors) {
        // Found all factors - determine if prime or composite
        const hasOtherFactors = allFactors.some(factor => factor !== 1 && factor !== number);
        
        if (hasOtherFactors) {
          // Has factors other than 1 and itself, it's composite
          setIsPrime(false);
        } else {
          // Only has 1 and itself as factors, it's prime
          setIsPrime(true);
        }
        
        setIsComplete(true);
        setShowResult(true);
        onComplete?.(!hasOtherFactors, newFoundFactors);
      }
    }

    setCheckedFactors(newCheckedFactors);
  };

  const resetChecker = () => {
    setCheckedFactors(new Set());
    setFoundFactors([]);
    setIsComplete(false);
    setShowResult(false);
    setIsPrime(false);
  };

  const getFactorStatus = (factor: number) => {
    if (!checkedFactors.has(factor)) return 'unchecked';
    if (foundFactors.includes(factor)) return 'factor';
    return 'checked';
  };

  const getFactorColor = (factor: number) => {
    const status = getFactorStatus(factor);
    switch (status) {
      case 'unchecked':
        return 'bg-gray-200 hover:bg-gray-300';
      case 'checked':
        return 'bg-red-200 text-red-800'; // Not a factor - WRONG
      case 'factor':
        return 'bg-green-200 text-green-800'; // Factor found - GOOD!
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🔍 Factor Finder
        </h3>
        <p className="text-gray-600 mb-4">
          Find all the factors of {number} by clicking on numbers below. 
          Remember: every number has 1 and itself as factors, so we only need to check numbers up to {maxCheck}!
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number to check:
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
            min="1"
            max="100"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isComplete}
          />
          <button
            onClick={resetChecker}
            className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!isComplete}
          >
            Reset
          </button>
        </div>

        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-800 text-sm mb-2">
              💡 <strong>Example:</strong> To check if 3 is a factor of 15: 15 ÷ 3 = 5 (whole number) ✅ So 3 IS a factor!
            </p>
            <p className="text-blue-800 text-sm">
              <strong>Smart tip:</strong> You only need to check numbers up to {maxCheck} because bigger numbers would have smaller partners! 🤓
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          🎯 Your Mission: Find all the factors of {number}!
        </h4>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800 text-sm mb-2">
            <strong>How to play:</strong> Click on each number below to test if it divides evenly into {number}
          </p>
          <p className="text-yellow-800 text-sm">
            <strong>Example:</strong> If 15 ÷ 3 = 5 (whole number, no remainder), then 3 is a factor! ✅
          </p>
        </div>
        <div className="grid grid-cols-8 gap-2 mb-4">
          {factorsToCheck.map((factor) => {
            const status = getFactorStatus(factor);
            return (
              <button
                key={factor}
                onClick={() => handleFactorClick(factor)}
                disabled={isComplete}
                className={`p-3 rounded-lg font-medium transition-colors ${getFactorColor(factor)} ${
                  isComplete 
                    ? 'cursor-not-allowed opacity-60' 
                    : 'cursor-pointer hover:shadow-md'
                }`}
                title={
                  isComplete
                    ? 'All factors have been found!'
                    : status === 'unchecked' 
                    ? `Click to check if ${factor} is a factor of ${number}`
                    : status === 'checked'
                    ? `${factor} is NOT a factor of ${number}`
                    : `${factor} IS a factor of ${number} (${number} ÷ ${factor} = ${number / factor})`
                }
              >
                {factor}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span>Click me!</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
            <span>❌ Not a factor</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
            <span>✅ Is a factor!</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          {isComplete ? "🎯 All factors found!" : "🎉 Great job! You found these factors:"}
        </h4>
        <div className="flex flex-wrap gap-2">
          {foundFactors.length > 0 ? (
            foundFactors
              .sort((a, b) => a - b)
              .map((factor) => {
                const partner = number / factor;
                const isSpecial = factor === 1 || factor === number;
                return (
                  <span
                    key={factor}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isComplete 
                        ? isSpecial 
                          ? 'bg-blue-200 text-blue-900 border-2 border-blue-400'
                          : 'bg-green-200 text-green-900 border-2 border-green-400'
                        : isSpecial
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {factor === 1 
                      ? `1 (because ${number} ÷ 1 = ${number})`
                      : factor === number
                      ? `${number} (because ${number} ÷ ${number} = 1)`
                      : partner === factor
                      ? `${factor} (because ${factor} × ${factor} = ${number})`
                      : `${factor} & ${partner} (because ${factor} × ${partner} = ${number})`
                    }
                  </span>
                );
              })
          ) : (
            <span className="text-gray-500 italic">No factors found yet - start clicking on numbers above! 🖱️</span>
          )}
        </div>
        {isComplete && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium text-sm">
              ✅ <strong>Complete!</strong> All factors of {number} are: 1, {foundFactors.filter(factor => factor !== 1 && factor !== number).join(', ')}, {number}
            </p>
            <p className="text-green-700 text-xs mt-1">
              💡 Note: Every number has 1 and itself as factors. We only checked numbers up to {maxCheck} because larger factors would have smaller partners!
            </p>
          </div>
        )}
        {foundFactors.length > 0 && !isComplete && (
          <div className="mt-2 text-sm text-gray-600">
            <p>💡 Remember: Every number has at least 1 and itself as factors. We're looking for other factors in between!</p>
          </div>
        )}
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg border-2 ${
          number === 1
            ? 'bg-yellow-50 border-yellow-200'
            : isPrime 
            ? 'bg-green-50 border-green-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">
              {number === 1 ? '⭐' : isPrime ? '🎉' : '🔢'}
            </span>
            <h4 className="text-lg font-bold">
              {number === 1 
                ? 'Special! 1 is neither prime nor composite!' 
                : isPrime 
                ? 'Amazing! It\'s a PRIME number!' 
                : 'Cool! It\'s a COMPOSITE number!'
              }
            </h4>
          </div>
          <p className="text-gray-700 mb-2">
            {number === 1
              ? `1 is a special number! It only has 1 factor: itself. It's neither prime nor composite! 🌟`
              : isPrime 
              ? `${number} is special! It only has 2 factors: 1 and ${number}. That makes it PRIME! 🌟`
              : `${number} has more than 2 factors, so it's called COMPOSITE!`
            }
          </p>
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              {number === 1
                ? '⭐ 1 is unique! It\'s the only number that\'s neither prime nor composite!'
                : isPrime 
                ? '🌟 Prime numbers are like the building blocks of all other numbers!'
                : '🔧 Composite numbers can be broken down into smaller parts!'
              }
            </p>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="mt-6 text-sm text-gray-600">
          <p className="text-green-600 font-medium">
            🎯 <strong>Mission Complete!</strong> {number} is {number === 1 ? 'neither prime nor composite' : isPrime ? 'prime' : 'composite'}!
          </p>
        </div>
      )}
    </div>
  );
};

export default FactorChecker;