import { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, Minus, Equal, ArrowRight, Lightbulb } from 'lucide-react';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface FractionVisualizerProps {
  fraction1: Fraction;
  fraction2: Fraction;
  operation: 'add' | 'subtract';
}

const FractionBar = ({
  numerator,
  denominator,
  highlightColor,
  label,
}: {
  numerator: number;
  denominator: number;
  highlightColor: string;
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="flex w-64 h-10 overflow-hidden border-2 rounded-md border-foreground">
      {Array.from({ length: denominator }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 border-r border-foreground/50 last:border-r-0 transition-colors',
            i < numerator ? highlightColor : 'bg-background/20'
          )}
        />
      ))}
    </div>
    <span className="mt-2 text-lg font-bold font-code">{label}</span>
  </div>
);

export function FractionVisualizer({
  fraction1: f1 = { numerator: 1, denominator: 2 },
  fraction2: f2 = { numerator: 1, denominator: 4 },
  operation = 'add',
}: FractionVisualizerProps) {
  const [stage, setStage] = useState(0);
  const [sliderValue, setSliderValue] = useState(
    Math.max(f1.denominator, f2.denominator)
  );

  const isCommonDenominator =
    sliderValue % f1.denominator === 0 && sliderValue % f2.denominator === 0;

  const f1Converted = {
    numerator: (sliderValue / f1.denominator) * f1.numerator,
    denominator: sliderValue,
  };

  const f2Converted = {
    numerator: (sliderValue / f2.denominator) * f2.numerator,
    denominator: sliderValue,
  };

  const resultNumerator =
    operation === 'add'
      ? f1Converted.numerator + f2Converted.numerator
      : f1Converted.numerator - f2Converted.numerator;

  const resultFraction = {
    numerator: resultNumerator,
    denominator: sliderValue,
  };
  
  const OperationIcon = operation === 'add' ? Plus : Minus;

  const getStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
              We can't add or subtract these yet because the slices (denominators) are different sizes.
            </p>
            <div className="flex flex-col items-center gap-4">
              <FractionBar {...f1} highlightColor="bg-primary" label={`${f1.numerator}/${f1.denominator}`} />
              <OperationIcon className="w-8 h-8 text-muted-foreground" />
              <FractionBar {...f2} highlightColor="bg-accent" label={`${f2.numerator}/${f2.denominator}`} />
            </div>
             <div className="flex justify-end mt-6">
                <Button onClick={() => setStage(1)}>Let's Fix It <ArrowRight/></Button>
             </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="mb-4 text-center text-muted-foreground">
             Move the slider to find a "common denominator"—a number that both {f1.denominator} and {f2.denominator} can divide into. The bars will turn green when you find one.
            </p>
            <div className="flex flex-col items-center gap-4">
                 <FractionBar {...f1Converted} highlightColor={cn(isCommonDenominator ? 'bg-green-500' : 'bg-primary')} label={`${f1Converted.numerator}/${f1Converted.denominator}`}/>
                 <FractionBar {...f2Converted} highlightColor={cn(isCommonDenominator ? 'bg-green-500' : 'bg-accent')} label={`${f2Converted.numerator}/${f2Converted.denominator}`} />
                 <div className="w-full max-w-sm px-4 pt-4">
                    <label htmlFor="denominator-slider" className="block text-sm font-medium text-gray-700 mb-2">
                      Common Denominator: {sliderValue}
                    </label>
                    <input
                        id="denominator-slider"
                        type="range"
                        min={Math.max(f1.denominator, f2.denominator)}
                        max={f1.denominator * f2.denominator * 2}
                        step={1}
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={() => setStage(2)} disabled={!isCommonDenominator}>Combine Them <ArrowRight /></Button>
            </div>
          </>
        );
       case 2:
        return (
            <>
                <p className="mb-4 text-center text-muted-foreground">
                    Now that the slices are the same size, we can easily {operation} the numerators!
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                         <span className="text-2xl font-bold font-code">{`${f1Converted.numerator}/${f1Converted.denominator}`}</span>
                         <OperationIcon className="w-6 h-6" />
                         <span className="text-2xl font-bold font-code">{`${f2Converted.numerator}/${f2Converted.denominator}`}</span>
                         <Equal className="w-6 h-6" />
                         <span className="text-2xl font-bold font-code text-primary">{`${resultFraction.numerator}/${resultFraction.denominator}`}</span>
                    </div>
                     <FractionBar {...resultFraction} highlightColor="bg-primary" label="Result" />
                </div>
                 <div className="mt-4 rounded-lg border border-green-500 bg-green-50 p-4 text-green-800">
                    <p>
                        You've cracked it! Now that you see how it works, try answering the original question again.
                    </p>
                </div>
            </>
        )
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

export default FractionVisualizer;