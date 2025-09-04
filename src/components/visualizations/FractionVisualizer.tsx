import React, { useState, useEffect, useCallback } from 'react';

interface FractionVisualizerProps {
  fractions?: {
    numerator1: number;
    denominator1: number;
    numerator2: number;
    denominator2: number;
  };
  operation?: 'add' | 'subtract' | 'compare';
  onComplete?: (isCorrect: boolean, commonDenominator: number) => void;
  showHint?: boolean;
}

interface Fraction {
  numerator: number;
  denominator: number;
  value: number;
}

const predefinedFractions = [
    { f1: { n: 1, d: 2 }, f2: { n: 1, d: 3 }, cd: 6 },
    { f1: { n: 1, d: 4 }, f2: { n: 1, d: 6 }, cd: 12 },
    { f1: { n: 2, d: 3 }, f2: { n: 1, d: 4 }, cd: 12 },
    { f1: { n: 3, d: 5 }, f2: { n: 2, d: 7 }, cd: 35 },
    { f1: { n: 1, d: 2 }, f2: { n: 2, d: 5 }, cd: 10 },
    { f1: { n: 3, d: 4 }, f2: { n: 1, d: 8 }, cd: 8 }
  ];

const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  fractions,
  operation = 'add',
  onComplete,
  showHint = true
}) => {
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2, value: 0.5 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 3, value: 0.333 });
  const [commonDenominator, setCommonDenominator] = useState<number>(6);
  const [userAnswer, setUserAnswer] = useState<number>(6);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<'add' | 'subtract' | 'compare'>(operation);

  // Calculate GCD (Greatest Common Divisor)
  const gcd = useCallback((a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  }, []);

  // Calculate LCM (Least Common Multiple)
  const lcm = useCallback((a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  }, [gcd]);

  useEffect(() => {
    if (fractions) {
      const newCD = lcm(fractions.denominator1, fractions.denominator2);
      setFraction1({
        numerator: fractions.numerator1,
        denominator: fractions.denominator1,
        value: fractions.numerator1 / fractions.denominator1
      });
      setFraction2({
        numerator: fractions.numerator2,
        denominator: fractions.denominator2,
        value: fractions.numerator2 / fractions.denominator2
      });
      setCommonDenominator(newCD);
      setUserAnswer(newCD);
    } else {
      // Select a random fraction pair
      const randomPair = predefinedFractions[Math.floor(Math.random() * predefinedFractions.length)];
      setFraction1({
        numerator: randomPair.f1.n,
        denominator: randomPair.f1.d,
        value: randomPair.f1.n / randomPair.f1.d
      });
      setFraction2({
        numerator: randomPair.f2.n,
        denominator: randomPair.f2.d,
        value: randomPair.f2.n / randomPair.f2.d
      });
      setCommonDenominator(randomPair.cd);
      setUserAnswer(randomPair.cd);
    }
    setShowResult(false);
    setIsCorrect(false);
  }, [fractions, lcm]);

  const handleSliderChange = (value: number) => {
    setCommonDenominator(value);
    setUserAnswer(value);
  };

  const handleAnswerSubmit = () => {
    const correct = userAnswer === lcm(fraction1.denominator, fraction2.denominator);
    setIsCorrect(correct);
    setShowResult(true);
    onComplete?.(correct, userAnswer);
  };

  const generateNewFractions = () => {
    const randomPair = predefinedFractions[Math.floor(Math.random() * predefinedFractions.length)];
    setFraction1({
      numerator: randomPair.f1.n,
      denominator: randomPair.f1.d,
      value: randomPair.f1.n / randomPair.f1.d
    });
    setFraction2({
      numerator: randomPair.f2.n,
      denominator: randomPair.f2.d,
      value: randomPair.f2.n / randomPair.f2.d
    });
    const newCD = lcm(randomPair.f1.d, randomPair.f2.d);
    setCommonDenominator(newCD);
    setUserAnswer(newCD);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getEquivalentFraction = (fraction: Fraction, newDenominator: number) => {
    const newNumerator = (fraction.numerator * newDenominator) / fraction.denominator;
    return { numerator: newNumerator, denominator: newDenominator };
  };

  const renderFractionBar = (fraction: Fraction, newDenominator: number, color: string, label: string) => {
    const equivalent = getEquivalentFraction(fraction, newDenominator);
    const barWidth = 300;
    const segmentWidth = barWidth / newDenominator;
    
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700 mr-4">{label}:</span>
          <span className="text-lg font-bold">
            {fraction.numerator}/{fraction.denominator}
          </span>
          {newDenominator !== fraction.denominator && (
            <span className="text-sm text-gray-500 ml-2">
              = {equivalent.numerator}/{equivalent.denominator}
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="relative" style={{ width: barWidth, height: 40 }}>
            {/* Background segments */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: newDenominator }, (_, i) => (
                <div
                  key={i}
                  className="border border-gray-300"
                  style={{ width: segmentWidth }}
                />
              ))}
            </div>
            
            {/* Filled segments */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: equivalent.numerator }, (_, i) => (
                <div
                  key={i}
                  className={`${color} border border-gray-400`}
                  style={{ width: segmentWidth }}
                />
              ))}
            </div>
            
            {/* Fraction labels on segments */}
            <div className="absolute -bottom-6 flex">
              {Array.from({ length: newDenominator }, (_, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 text-center"
                  style={{ width: segmentWidth }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getOperationSymbol = () => {
    switch (currentOperation) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'compare': return '?';
      default: return '+';
    }
  };

  const getOperationText = () => {
    switch (currentOperation) {
      case 'add': return 'Add these fractions';
      case 'subtract': return 'Subtract these fractions';
      case 'compare': return 'Compare these fractions';
      default: return 'Add these fractions';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🍕 Fraction Visualizer - Common Denominators
        </h3>
        <p className="text-gray-600 mb-4">
          Use the slider to find the common denominator and see how fractions change!
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700">
            {getOperationText()}
          </h4>
          <button
            onClick={generateNewFractions}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Fractions
          </button>
        </div>

        {/* Operation selector */}
        <div className="flex space-x-4 mb-6">
          {(['add', 'subtract', 'compare'] as const).map((op) => (
            <button
              key={op}
              onClick={() => setCurrentOperation(op)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentOperation === op
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {op === 'add' ? '➕ Add' : op === 'subtract' ? '➖ Subtract' : '🔍 Compare'}
            </button>
          ))}
        </div>

        {/* Fraction visualization */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {fraction1.numerator}/{fraction1.denominator}
              </div>
              <div className="text-sm text-gray-600">First Fraction</div>
            </div>
            
            <div className="text-3xl font-bold text-gray-600">
              {getOperationSymbol()}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {fraction2.numerator}/{fraction2.denominator}
              </div>
              <div className="text-sm text-gray-600">Second Fraction</div>
            </div>
          </div>

          {/* Visual bars */}
          {renderFractionBar(fraction1, commonDenominator, 'bg-blue-400', 'First Fraction')}
          {renderFractionBar(fraction2, commonDenominator, 'bg-green-400', 'Second Fraction')}
        </div>

        {/* Common denominator slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Common Denominator: {commonDenominator}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={commonDenominator}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        {/* Answer input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the least common denominator?
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(parseInt(e.target.value) || 0)}
              min="1"
              max="100"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your answer"
            />
            <button
              onClick={handleAnswerSubmit}
              disabled={!userAnswer}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          </div>
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className={`p-4 rounded-lg border-2 mb-4 ${
            isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">
                {isCorrect ? '✅' : '❌'}
              </span>
              <h4 className="text-lg font-bold">
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </h4>
            </div>
            <p className="text-gray-700">
              {isCorrect 
                ? `Great job! The least common denominator is ${lcm(fraction1.denominator, fraction2.denominator)}.`
                : `The least common denominator is ${lcm(fraction1.denominator, fraction2.denominator)}. Your answer was ${userAnswer}.`
              }
            </p>
          </div>
        )}

        {/* Calculation explanation */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-gray-700 mb-3">Calculation:</h5>
          <div className="text-sm text-gray-600 space-y-1">
            <p>First fraction: {fraction1.numerator}/{fraction1.denominator} = {fraction1.value.toFixed(3)}</p>
            <p>Second fraction: {fraction2.numerator}/{fraction2.denominator} = {fraction2.value.toFixed(3)}</p>
            <p>Least Common Denominator: LCM({fraction1.denominator}, {fraction2.denominator}) = {lcm(fraction1.denominator, fraction2.denominator)}</p>
            <p>Equivalent fractions: {fraction1.numerator}/{fraction1.denominator} = {getEquivalentFraction(fraction1, lcm(fraction1.denominator, fraction2.denominator)).numerator}/{lcm(fraction1.denominator, fraction2.denominator)}</p>
            <p>Equivalent fractions: {fraction2.numerator}/{fraction2.denominator} = {getEquivalentFraction(fraction2, lcm(fraction1.denominator, fraction2.denominator)).numerator}/{lcm(fraction1.denominator, fraction2.denominator)}</p>
          </div>
        </div>

        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Hint:</strong> The least common denominator is the smallest number that both denominators divide into evenly. 
              Use the slider to see how the fractions change when you change the common denominator!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionVisualizer;
