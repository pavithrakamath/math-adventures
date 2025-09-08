import React, { useState, useEffect, useMemo } from 'react';

interface BarData {
  label: string;
  value: number;
  color: string;
  emoji?: string;
}

interface ClickableLessonBarChartProps {
  data?: BarData[];
  title?: string;
  question?: string;
  correctAnswer?: string | number;
  onAnswer?: (answer: string | number, isCorrect: boolean) => void;
  showFeedback?: boolean;
  maxValue?: number;
  allowEdit?: boolean;
}

const ClickableLessonBarChart: React.FC<ClickableLessonBarChartProps> = ({
  data,
  title,
  question,
  correctAnswer,
  onAnswer,
  showFeedback = true,
  maxValue,
}) => {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | number | null>(null);
  const [editingData, setEditingData] = useState<BarData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Default data if none provided
  const defaultData: BarData[] = useMemo(() => [
    { label: 'Apples', value: 15, color: '#3b82f6', emoji: '🍎' },
    { label: 'Bananas', value: 12, color: '#ef4444', emoji: '🍌' },
    { label: 'Oranges', value: 8, color: '#10b981', emoji: '🍊' },
    { label: 'Grapes', value: 10, color: '#f59e0b', emoji: '🍇' }
  ], []);

  const chartData = isEditing ? editingData : (data || defaultData);
  const chartTitle = title || "Interactive Bar Chart";
  const maxBarValue = maxValue || Math.max(...chartData.map(d => d.value));
  const chartHeight = 300;
  const barWidth = Math.max(40, (800 - (chartData.length - 1) * 20) / chartData.length);

  // Initialize editing data
  useEffect(() => {
    if (data) {
      setEditingData([...data]);
    } else {
      setEditingData([...defaultData]);
    }
  }, [data, defaultData]);

  useEffect(() => {
    setSelectedBar(null);
    setShowAnswer(false);
    setIsCorrect(false);
    setUserAnswer(null);
  }, [chartData, question]);

  const handleBarClick = (barLabel: string, barValue: number) => {
    if (showAnswer || isEditing) return;

    setSelectedBar(barLabel);
    setUserAnswer(barLabel);
    
    if (correctAnswer !== undefined) {
      const correct = barLabel === correctAnswer || barValue === correctAnswer;
      setIsCorrect(correct);
      setShowAnswer(true);
      onAnswer?.(barLabel, correct);
    }
  };


  const getBarHeight = (value: number) => {
    return (value / maxBarValue) * chartHeight;
  };

  const getBarColor = (bar: BarData, isSelected: boolean) => {
    if (showAnswer && isSelected) {
      return isCorrect ? '#10b981' : '#ef4444'; // green for correct, red for incorrect
    }
    if (isSelected) {
      return '#3b82f6'; // blue for selected
    }
    return bar.color;
  };

  const getBarOpacity = (isSelected: boolean) => {
    if (showAnswer && isSelected) {
      return 1;
    }
    if (isSelected) {
      return 0.8;
    }
    return 0.7;
  };

  const addDataPoint = () => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const emojis = ['🍎', '🍌', '🍊', '🍇', '🥕', '🥦', '🍞', '🧀'];
    
    const newItem: BarData = {
      label: `Item ${editingData.length + 1}`,
      value: Math.floor(Math.random() * 20) + 1,
      color: colors[editingData.length % colors.length],
      emoji: emojis[editingData.length % emojis.length]
    };
    
    setEditingData([...editingData, newItem]);
  };

  const removeDataPoint = (index: number) => {
    const newData = editingData.filter((_, i) => i !== index);
    setEditingData(newData);
  };

  const updateValue = (index: number, newValue: number) => {
    const newData = [...editingData];
    newData[index].value = Math.max(0, Math.min(50, newValue));
    setEditingData(newData);
  };

  const updateLabel = (index: number, newLabel: string) => {
    const newData = [...editingData];
    newData[index].label = newLabel;
    setEditingData(newData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📊 {chartTitle}
        </h3>
        {question && (
          <p className="text-lg text-gray-600 mb-4">
            {question}
          </p>
        )}
        
        {/* Editing Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </button>
          {isEditing && (
            <button
              onClick={addDataPoint}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Data Point
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          {/* Chart container */}
          <div 
            className="flex items-end justify-center space-x-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
            style={{ height: chartHeight + 60 }}
          >
            {chartData.map((bar) => {
              const isSelected = selectedBar === bar.label;
              const barHeight = getBarHeight(bar.value);
              
              return (
                <div key={bar.label} className="flex flex-col items-center">
                  {/* Bar */}
                  <div
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg rounded-t-md ${
                      showAnswer ? 'cursor-default' : 'hover:scale-105'
                    }`}
                    style={{
                      width: barWidth,
                      height: barHeight,
                      backgroundColor: getBarColor(bar, isSelected),
                      opacity: getBarOpacity(isSelected),
                      minHeight: barHeight > 0 ? '20px' : '0px'
                    }}
                    onClick={() => handleBarClick(bar.label, bar.value)}
                  >
                    {/* Value label on bar */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                      {bar.value}
                    </div>
                    
                    {/* Emoji on top of bar */}
                    {bar.emoji && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-2xl">
                        {bar.emoji}
                      </div>
                    )}
                  </div>
                  
                  {/* Bar label */}
                  <div className="mt-2 text-sm font-medium text-gray-700 text-center max-w-[80px]">
                    {bar.label}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-500 -ml-8">
            <div>{maxBarValue}</div>
            <div>{Math.round(maxBarValue * 0.75)}</div>
            <div>{Math.round(maxBarValue * 0.5)}</div>
            <div>{Math.round(maxBarValue * 0.25)}</div>
            <div>0</div>
          </div>
        </div>
      </div>

      {/* Interactive instructions */}
      {!showAnswer && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Click on any bar</strong> to select it as your answer!
          </p>
        </div>
      )}

      {/* Answer feedback */}
      {showAnswer && showFeedback && (
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
              ? `Great job! You selected the correct answer: ${userAnswer}`
              : `Your answer was ${userAnswer}. The correct answer is ${correctAnswer}.`
            }
          </p>
        </div>
      )}

      {/* Chart statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-gray-700">Total Items</div>
          <div className="text-2xl font-bold text-blue-600">{chartData.length}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-gray-700">Highest Value</div>
          <div className="text-2xl font-bold text-green-600">{maxBarValue}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-gray-700">Lowest Value</div>
          <div className="text-2xl font-bold text-red-600">{Math.min(...chartData.map(d => d.value))}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-gray-700">Average</div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length) * 10) / 10}
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Data Table</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                {isEditing && (
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {chartData.map((bar, index) => {
                const percentage = Math.round((bar.value / maxBarValue) * 100);
                const isSelected = selectedBar === bar.label;
                
                return (
                  <tr 
                    key={bar.label}
                    className={`hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateLabel(index, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <>
                          {bar.emoji && <span className="mr-2">{bar.emoji}</span>}
                          {bar.label}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          type="number"
                          value={bar.value}
                          onChange={(e) => updateValue(index, parseInt(e.target.value) || 0)}
                          min="0"
                          max="50"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        bar.value
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{percentage}%</td>
                    <td className="px-4 py-2 text-sm">
                      {!isEditing && isSelected && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          showAnswer 
                            ? (isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {showAnswer ? (isCorrect ? 'Correct' : 'Incorrect') : 'Selected'}
                        </span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => removeDataPoint(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClickableLessonBarChart;
