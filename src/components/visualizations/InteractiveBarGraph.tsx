import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BarData {
  label: string;
  value: number;
  color: string;
  emoji?: string;
}

interface InteractiveBarGraphProps {
  data?: BarData[];
  maxValue?: number;
  onDataChange?: (data: BarData[]) => void;
  allowEdit?: boolean;
  title?: string;
}

const InteractiveBarGraph: React.FC<InteractiveBarGraphProps> = ({
  data = [],
  maxValue = 20,
  onDataChange,
  allowEdit = true,
  title = "Interactive Bar Graph"
}) => {
  const [graphData, setGraphData] = useState<BarData[]>(data);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const emojis = ['🍎', '🍌', '🍊', '🍇', '🥕', '🥦', '🍞', '🧀'];

  const drawGraph = useCallback(() => {
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
      const value = (i * maxValue) / 5;
      const y = height - padding - (i * chartHeight) / 5;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // Draw bars
    if (graphData.length > 0) {
      const barWidth = chartWidth / graphData.length * 0.8;
      const barSpacing = chartWidth / graphData.length;

      graphData.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = item.color;
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
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 30);
  }, [graphData, maxValue, title]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const addDataPoint = () => {
    const newItem: BarData = {
      label: `Item ${graphData.length + 1}`,
      value: Math.floor(Math.random() * maxValue) + 1,
      color: colors[graphData.length % colors.length],
      emoji: emojis[graphData.length % emojis.length]
    };
    
    const newData = [...graphData, newItem];
    setGraphData(newData);
    onDataChange?.(newData);
  };

  const removeDataPoint = (index: number) => {
    const newData = graphData.filter((_, i) => i !== index);
    setGraphData(newData);
    onDataChange?.(newData);
  };

  const updateValue = (index: number, newValue: number) => {
    const newData = [...graphData];
    newData[index].value = Math.max(0, Math.min(maxValue, newValue));
    setGraphData(newData);
    onDataChange?.(newData);
  };

  const updateLabel = (index: number, newLabel: string) => {
    const newData = [...graphData];
    newData[index].label = newLabel;
    setGraphData(newData);
    onDataChange?.(newData);
  };

  const reset = () => {
    setGraphData([]);
    onDataChange?.([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
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
            {graphData.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Data Points:</h4>
                {graphData.map((item, index) => (
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
                        max={maxValue}
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
        {graphData.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Graph Statistics:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Total Items:</span>
                <span className="ml-2 text-blue-900">{graphData.length}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Highest Value:</span>
                <span className="ml-2 text-blue-900">
                  {Math.max(...graphData.map(item => item.value))}
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Lowest Value:</span>
                <span className="ml-2 text-blue-900">
                  {Math.min(...graphData.map(item => item.value))}
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Average:</span>
                <span className="ml-2 text-blue-900">
                  {(graphData.reduce((sum, item) => sum + item.value, 0) / graphData.length).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveBarGraph;
