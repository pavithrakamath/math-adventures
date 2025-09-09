import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
  emoji?: string;
}

export interface BarChartProps {
  data: BarChartData[];
  mode?: 'static' | 'interactive' | 'lesson';
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  maxValue?: number;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
  // Interactive mode props
  onDataChange?: (data: BarChartData[]) => void;
  allowEdit?: boolean;
  // Lesson mode props
  question?: string;
  correctAnswer?: string | number;
  onAnswer?: (answer: string | number, isCorrect: boolean) => void;
  showFeedback?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  mode = 'static',
  title,
  xAxisLabel,
  yAxisLabel,
  maxValue,
  showValues = true,
  animated = true,
  className = '',
  onDataChange,
  allowEdit = true,
  question,
  correctAnswer,
  onAnswer,
  showFeedback = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | number | null>(null);
  const [editingData, setEditingData] = useState<BarChartData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize editing data
  useEffect(() => {
    if (data.length > 0) {
      setEditingData([...data]);
    }
  }, [data]);

  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const colors = useMemo(() => [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ], []);

  const getBarColor = (index: number, customColor?: string) => {
    return customColor || colors[index % colors.length];
  };

  const getBarHeight = (value: number) => {
    return (value / max) * 200; // Max height of 200px
  };

  // Handle bar click for lesson mode
  const handleBarClick = (barLabel: string, barValue: number) => {
    if (showAnswer || isEditing || mode !== 'lesson') return;

    setSelectedBar(barLabel);
    setUserAnswer(barLabel);
    
    if (correctAnswer !== undefined) {
      const correct = barLabel === correctAnswer || barValue === correctAnswer;
      setIsCorrect(correct);
      setShowAnswer(true);
      onAnswer?.(barLabel, correct);
    }
  };

  // Interactive mode functions
  const addDataPoint = () => {
    const emojis = ['🍎', '🍌', '🍊', '🍇', '🥕', '🥦', '🍞', '🧀'];
    
    const newItem: BarChartData = {
      label: `Item ${editingData.length + 1}`,
      value: Math.floor(Math.random() * 20) + 1,
      color: colors[editingData.length % colors.length],
      emoji: emojis[editingData.length % emojis.length]
    };
    
    const newData = [...editingData, newItem];
    setEditingData(newData);
    onDataChange?.(newData);
  };

  const removeDataPoint = (index: number) => {
    const newData = editingData.filter((_, i) => i !== index);
    setEditingData(newData);
    onDataChange?.(newData);
  };

  const updateValue = (index: number, newValue: number) => {
    const newData = [...editingData];
    newData[index].value = Math.max(0, Math.min(50, newValue));
    setEditingData(newData);
    onDataChange?.(newData);
  };

  const updateLabel = (index: number, newLabel: string) => {
    const newData = [...editingData];
    newData[index].label = newLabel;
    setEditingData(newData);
    onDataChange?.(newData);
  };

  const reset = () => {
    setEditingData([]);
    onDataChange?.([]);
  };

  // Canvas drawing for interactive mode
  const drawGraph = useCallback(() => {
    if (mode !== 'interactive') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (i * max) / 5;
      const y = height - padding - (i * chartHeight) / 5;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // Draw bars
    if (editingData.length > 0) {
      const barWidth = chartWidth / editingData.length * 0.8;
      const barSpacing = chartWidth / editingData.length;

      editingData.forEach((item, index) => {
        const barHeight = (item.value / max) * chartHeight;
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = item.color || colors[index % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top of bar
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);

        // Draw label below bar
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);

        // Draw emoji if available
        if (item.emoji) {
          ctx.font = '20px Arial';
          ctx.fillText(item.emoji, x + barWidth / 2, y - 25);
        }
      });
    }

    // Draw title
    if (title) {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 30);
    }
  }, [editingData, max, title, colors, mode]);

  useEffect(() => {
    if (mode === 'interactive') {
      drawGraph();
    }
  }, [drawGraph, mode]);

  // Handle empty data
  if (data.length === 0 && mode !== 'interactive') {
    return (
      <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentData = mode === 'interactive' ? editingData : data;

  // Static mode rendering
  if (mode === 'static') {
    return (
      <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`} role="img" aria-label={title || 'Bar chart'}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {title}
          </h3>
        )}
        
        <div className="flex items-end justify-center space-x-2 h-64">
          {currentData.map((item, index) => {
            const height = getBarHeight(item.value);
            const color = getBarColor(index, item.color);
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                {/* Bar */}
                <motion.div
                  className="relative w-12 rounded-t-lg flex flex-col justify-end"
                  style={{ height: '200px' }}
                  initial={animated ? { scaleY: 0 } : { scaleY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: animated ? index * 0.1 : 0,
                    ease: 'easeOut'
                  }}
                >
                  <motion.div
                    className="w-full rounded-t-lg relative"
                    style={{ 
                      height: `${height}px`,
                      backgroundColor: color,
                      opacity: 0.8
                    }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Value on top of bar */}
                    {showValues && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                        {item.value}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
                
                {/* Label */}
                <div className="text-xs text-center text-gray-600 max-w-16">
                  {item.emoji && (
                    <div className="text-lg mb-1">{item.emoji}</div>
                  )}
                  <div className="break-words">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Axis Labels */}
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          {xAxisLabel && (
            <span className="text-center w-full">{xAxisLabel}</span>
          )}
        </div>
        
        {yAxisLabel && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-600">
            {yAxisLabel}
          </div>
        )}
      </div>
    );
  }

  // Interactive mode rendering
  if (mode === 'interactive') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title || "Interactive Bar Graph"}
            </h3>
            <p className="text-sm text-gray-600">
              {allowEdit ? 'Add data points and adjust values to create your bar graph!' : 'View the interactive bar graph below.'}
            </p>
          </div>

          {/* Graph Canvas */}
          <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full"
            />
          </div>

          {/* Controls */}
          {allowEdit && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addDataPoint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  + Add Data Point
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </motion.button>
              </div>

              {/* Data Points Editor */}
              {editingData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Data Points:</h4>
                  {editingData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.emoji}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateLabel(index, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Label"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Value:</label>
                        <input
                          type="number"
                          min="0"
                          max={max}
                          value={item.value}
                          onChange={(e) => updateValue(index, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeDataPoint(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Graph Statistics */}
          {editingData.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Graph Statistics:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Total Items:</span>
                  <span className="ml-2 text-blue-900">{editingData.length}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Highest Value:</span>
                  <span className="ml-2 text-blue-900">
                    {Math.max(...editingData.map(item => item.value))}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Lowest Value:</span>
                  <span className="ml-2 text-blue-900">
                    {Math.min(...editingData.map(item => item.value))}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Average:</span>
                  <span className="ml-2 text-blue-900">
                    {(editingData.reduce((sum, item) => sum + item.value, 0) / editingData.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lesson mode rendering
  if (mode === 'lesson') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            📊 {title || "Interactive Bar Chart"}
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
              style={{ height: '300px' }}
            >
              {currentData.map((bar, index) => {
                const isSelected = selectedBar === bar.label;
                const barHeight = getBarHeight(bar.value);
                const barWidth = Math.max(40, (800 - (currentData.length - 1) * 20) / currentData.length);
                
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
                        backgroundColor: isSelected ? (showAnswer ? (isCorrect ? '#10b981' : '#ef4444') : '#3b82f6') : (bar.color || colors[index % colors.length]),
                        opacity: isSelected ? 1 : 0.7,
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
              <div>{max}</div>
              <div>{Math.round(max * 0.75)}</div>
              <div>{Math.round(max * 0.5)}</div>
              <div>{Math.round(max * 0.25)}</div>
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
            <div className="text-2xl font-bold text-blue-600">{currentData.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold text-gray-700">Highest Value</div>
            <div className="text-2xl font-bold text-green-600">{max}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold text-gray-700">Lowest Value</div>
            <div className="text-2xl font-bold text-red-600">{Math.min(...currentData.map(d => d.value))}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold text-gray-700">Average</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length) * 10) / 10}
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
                {currentData.map((bar, index) => {
                  const percentage = Math.round((bar.value / max) * 100);
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
  }

  return null;
};

export default BarChart;