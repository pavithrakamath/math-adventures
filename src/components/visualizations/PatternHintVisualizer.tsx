import React from 'react';

interface PatternHintVisualizerProps {
  patternType: 'triangular' | 'square' | 'fibonacci' | 'arithmetic' | 'geometric' | 'custom';
  sequence: number[];
  customPattern?: string;
}

const PatternHintVisualizer: React.FC<PatternHintVisualizerProps> = ({
  patternType,
  sequence,
  customPattern
}) => {
  const renderTriangularPattern = () => {
    const dots = [];
    let dotCount = 0;
    
    for (let i = 0; i < sequence.length; i++) {
      const currentNumber = sequence[i];
      const dotsInRow = i + 1;
      
      dots.push(
        <div key={i} className="flex flex-col items-center mb-4">
          <div className="text-sm font-semibold mb-2">n = {i + 1}: {currentNumber} dots</div>
          <div className="flex flex-col items-center">
            {Array.from({ length: dotsInRow }, (_, j) => (
              <div key={j} className="flex">
                {Array.from({ length: j + 1 }, (_, k) => (
                  <div key={k} className="w-3 h-3 bg-blue-500 rounded-full m-0.5"></div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Formula: n(n+1)/2 = {i + 1}({i + 1}+1)/2 = {currentNumber}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-lg">Triangular Numbers Pattern</h4>
          <p className="text-sm text-gray-600">Each number represents dots arranged in a triangle</p>
        </div>
        {dots}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-semibold">Next numbers:</p>
          <p className="text-sm">
            n=6: 6×7/2 = 21<br/>
            n=7: 7×8/2 = 28<br/>
            n=8: 8×9/2 = 36
          </p>
        </div>
      </div>
    );
  };

  const renderSquarePattern = () => {
    const squares = [];
    
    for (let i = 0; i < Math.min(sequence.length, 4); i++) {
      const sideLength = i + 1;
      const totalDots = sequence[i];
      
      squares.push(
        <div key={i} className="flex flex-col items-center mb-4">
          <div className="text-sm font-semibold mb-2">n = {sideLength}: {totalDots} dots</div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${sideLength}, 1fr)` }}>
            {Array.from({ length: totalDots }, (_, j) => (
              <div key={j} className="w-3 h-3 bg-green-500 rounded-sm"></div>
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Formula: n² = {sideLength}² = {totalDots}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-lg">Square Numbers Pattern</h4>
          <p className="text-sm text-gray-600">Each number represents dots in a square grid</p>
        </div>
        {squares}
      </div>
    );
  };

  const renderArithmeticPattern = () => {
    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
      differences.push(sequence[i] - sequence[i - 1]);
    }
    
    const commonDifference = differences[0];
    const nextNumbers = [];
    for (let i = 1; i <= 3; i++) {
      nextNumbers.push(sequence[sequence.length - 1] + (commonDifference * i));
    }
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-lg">Arithmetic Sequence</h4>
          <p className="text-sm text-gray-600">Each number increases by the same amount</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-lg font-mono">
              {sequence.map((num, i) => (
                <span key={i} className="inline-block mx-1 px-2 py-1 bg-white rounded border">
                  {num}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-3">
            <div className="text-sm text-gray-600">Differences:</div>
            <div className="text-sm font-mono">
              {differences.map((diff, i) => (
                <span key={i} className="inline-block mx-1 px-2 py-1 bg-blue-100 rounded">
                  +{diff}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Common difference: {commonDifference}</div>
            <div className="text-sm font-semibold mt-2">Next numbers: {nextNumbers.join(', ')}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGeometricPattern = () => {
    const ratios = [];
    for (let i = 1; i < sequence.length; i++) {
      ratios.push(sequence[i] / sequence[i - 1]);
    }
    
    const commonRatio = ratios[0];
    const nextNumbers = [];
    for (let i = 1; i <= 3; i++) {
      nextNumbers.push(sequence[sequence.length - 1] * Math.pow(commonRatio, i));
    }
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-lg">Geometric Sequence</h4>
          <p className="text-sm text-gray-600">Each number is multiplied by the same amount</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-lg font-mono">
              {sequence.map((num, i) => (
                <span key={i} className="inline-block mx-1 px-2 py-1 bg-white rounded border">
                  {num}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-3">
            <div className="text-sm text-gray-600">Ratios:</div>
            <div className="text-sm font-mono">
              {ratios.map((ratio, i) => (
                <span key={i} className="inline-block mx-1 px-2 py-1 bg-green-100 rounded">
                  ×{ratio}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Common ratio: {commonRatio}</div>
            <div className="text-sm font-semibold mt-2">Next numbers: {nextNumbers.join(', ')}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomPattern = () => {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-lg">Custom Pattern</h4>
          <p className="text-sm text-gray-600">{customPattern}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-mono">
              {sequence.map((num, i) => (
                <span key={i} className="inline-block mx-1 px-2 py-1 bg-white rounded border">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPattern = () => {
    switch (patternType) {
      case 'triangular':
        return renderTriangularPattern();
      case 'square':
        return renderSquarePattern();
      case 'arithmetic':
        return renderArithmeticPattern();
      case 'geometric':
        return renderGeometricPattern();
      case 'custom':
        return renderCustomPattern();
      default:
        return renderArithmeticPattern();
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {renderPattern()}
    </div>
  );
};

export default PatternHintVisualizer;
