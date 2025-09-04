import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InteractivePerimeterProps {
  targetPerimeter?: number;
  shape?: 'circle' | 'rectangle' | 'square';
  onPerimeterChange?: (perimeter: number) => void;
  showGrid?: boolean;
  scale?: number; // pixels per cm
}

const InteractivePerimeter: React.FC<InteractivePerimeterProps> = ({
  targetPerimeter = 0,
  shape = 'circle',
  onPerimeterChange,
  showGrid = true,
  scale = 40 // 40 pixels = 1 cm (so each grid box = 1cm)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPerimeter, setCurrentPerimeter] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [centerPoint, setCenterPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewPoint, setPreviewPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw shape based on current points
    if (points.length > 0) {
      drawShape(ctx, points, shape);
    }
    
    // For circle, draw the center point and compass
    if (shape === 'circle' && centerPoint) {
      if (previewPoint) {
        // Draw compass with preview point while dragging
        drawCompassPreview(ctx, centerPoint, previewPoint);
      } else if (points.length === 1) {
        // Draw just the center point when placed
        drawCompassCenter(ctx, centerPoint);
      }
    }

    // Draw target perimeter info
    if (targetPerimeter > 0) {
      drawTargetInfo(ctx, targetPerimeter, currentPerimeter);
    }
  }, [points, shape, targetPerimeter, currentPerimeter, showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Use the scale factor for grid spacing (20px = 1cm)
    const gridSize = scale; // 20 pixels = 1 cm
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCompassPreview = (ctx: CanvasRenderingContext2D, center: { x: number; y: number }, current: { x: number; y: number }) => {
    const radiusPixels = Math.sqrt(
      Math.pow(current.x - center.x, 2) + Math.pow(current.y - center.y, 2)
    );
    
    // Draw virtual compass
    drawVirtualCompass(ctx, center, current, radiusPixels);
    
    // Draw circle outline
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radiusPixels, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawCompassCenter = (ctx: CanvasRenderingContext2D, center: { x: number; y: number }) => {
    // Draw compass base (center pin)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw compass base ring
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw center crosshairs
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center.x - 12, center.y);
    ctx.lineTo(center.x + 12, center.y);
    ctx.moveTo(center.x, center.y - 12);
    ctx.lineTo(center.x, center.y + 12);
    ctx.stroke();
  };

  const drawVirtualCompass = (ctx: CanvasRenderingContext2D, center: { x: number; y: number }, current: { x: number; y: number }, radius: number) => {
    // Draw compass base (center pin)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw compass base ring
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw compass arm (from center to current point)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
    
    // Draw compass arm tip (pencil point)
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(current.x, current.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw compass arm tip ring
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(current.x, current.y, 4, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw radius measurement line (dashed)
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw radius label
    const midX = (center.x + current.x) / 2;
    const midY = (center.y + current.y) / 2;
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${(radius / scale).toFixed(1)} cm`, midX, midY - 8);
  };

  const drawShape = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], shapeType: string) => {
    if (points.length === 0) return;

    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 3;

    if (shapeType === 'circle' && points.length >= 2) {
      const center = points[0];
      const radiusPixels = Math.sqrt(
        Math.pow(points[1].x - center.x, 2) + Math.pow(points[1].y - center.y, 2)
      );
      const radiusCm = radiusPixels / scale;
      
      ctx.beginPath();
      ctx.arc(center.x, center.y, radiusPixels, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw virtual compass for completed circle
      drawVirtualCompass(ctx, center, points[1], radiusPixels);

      const perimeter = 2 * Math.PI * radiusCm;
      setCurrentPerimeter(perimeter);
      onPerimeterChange?.(perimeter);

    } else if (shapeType === 'rectangle' && points.length >= 2) {
      const start = points[0];
      const end = points[1];
      const widthPixels = Math.abs(end.x - start.x);
      const heightPixels = Math.abs(end.y - start.y);
      const widthCm = widthPixels / scale;
      const heightCm = heightPixels / scale;
      
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);

      ctx.beginPath();
      ctx.rect(x, y, widthPixels, heightPixels);
      ctx.fill();
      ctx.stroke();

      const perimeter = 2 * (widthCm + heightCm);
      setCurrentPerimeter(perimeter);
      onPerimeterChange?.(perimeter);

    } else if (shapeType === 'square' && points.length >= 2) {
      const start = points[0];
      const end = points[1];
      const sidePixels = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));
      const sideCm = sidePixels / scale;
      
      const x = start.x;
      const y = start.y;

      ctx.beginPath();
      ctx.rect(x, y, sidePixels, sidePixels);
      ctx.fill();
      ctx.stroke();

      const perimeter = 4 * sideCm;
      setCurrentPerimeter(perimeter);
      onPerimeterChange?.(perimeter);
    }
  };

  const drawTargetInfo = (ctx: CanvasRenderingContext2D, target: number, current: number) => {
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`🎯 Target: ${target.toFixed(1)} cm`, 10, 30);
    ctx.fillText(`📏 Current: ${current.toFixed(1)} cm`, 10, 50);
    
    const accuracy = Math.abs(target - current) / target;
    if (accuracy < 0.1) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('🎉 Perfect! Great job!', 10, 80);
    } else if (accuracy < 0.2) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('👍 Close! Try again', 10, 80);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('💪 Keep trying!', 10, 80);
    }
    
    // Show difference
    const difference = Math.abs(target - current);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.fillText(`Difference: ${difference.toFixed(1)} cm`, 10, 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isComplete) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (shape === 'circle') {
      if (points.length === 0) {
        // Set center point for circle
        setCenterPoint({ x, y });
        setPoints([{ x, y }]);
        setIsDragging(true);
      } else if (points.length === 1) {
        // Set radius point and complete circle
        setPoints([...points, { x, y }]);
        setIsComplete(true);
        setIsDragging(false);
      }
    } else {
      // Rectangle and square behavior (unchanged)
      if (points.length === 0) {
        setPoints([{ x, y }]);
      } else if (points.length === 1) {
        setPoints([...points, { x, y }]);
        setIsComplete(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || shape !== 'circle' || points.length !== 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update the preview point for compass visualization
    setPreviewPoint({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging && shape === 'circle' && points.length === 1 && previewPoint) {
      // Set the final radius point
      setPoints([...points, previewPoint]);
      setIsDragging(false);
      setIsComplete(true);
      setPreviewPoint(null);
    }
  };

  const reset = () => {
    setPoints([]);
    setIsComplete(false);
    setCurrentPerimeter(0);
    setCenterPoint(null);
    setIsDragging(false);
    setPreviewPoint(null);
  };

  const getInstructions = () => {
    if (shape === 'circle') {
      return points.length === 0 
        ? "Click to place the center of the circle (red pin will appear)"
        : "Drag from the red pin to set the radius (like drawing with a compass)";
    } else if (shape === 'rectangle') {
      return points.length === 0
        ? "Click to place one corner of the rectangle"
        : "Click to place the opposite corner";
    } else {
      return points.length === 0
        ? "Click to place one corner of the square"
        : "Click to place the opposite corner";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🎯 Draw a {shape} with perimeter ≈ {targetPerimeter} cm
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {getInstructions()}
          </p>
          {shape === 'circle' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-700">
                <span className="text-lg">🧭</span>
                <span className="text-sm font-medium">
                  {points.length === 0 
                    ? "Click to place the red compass pin, then drag to draw your circle!"
                    : "Drag from the red pin to set the radius and draw your circle!"
                  }
                </span>
              </div>
            </div>
          )}
          
          {/* Clear instructions with units */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">📏 How to use this tool:</h4>
            <div className="mb-2 p-2 bg-blue-100 rounded text-xs text-blue-700">
              <strong>Scale:</strong> Each grid box = 1 cm (40 pixels = 1 cm)
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              {shape === 'circle' ? (
                <>
                  <li>• <strong>Step 1:</strong> Click to place the center of the circle (like a compass pin)</li>
                  <li>• <strong>Step 2:</strong> Drag to set the radius (like drawing with a compass)</li>
                  <li>• <strong>Formula:</strong> Perimeter = 2 × π × radius ≈ 6.28 × radius</li>
                  <li>• <strong>Target:</strong> You need radius ≈ {targetPerimeter > 0 ? (targetPerimeter / (2 * Math.PI)).toFixed(1) : '?'} cm</li>
                  <li>• <strong>Hint:</strong> That's about {targetPerimeter > 0 ? Math.round(targetPerimeter / (2 * Math.PI)) : '?'} grid boxes from center to edge</li>
                </>
              ) : shape === 'rectangle' ? (
                <>
                  <li>• <strong>Step 1:</strong> Click to place one corner of the rectangle</li>
                  <li>• <strong>Step 2:</strong> Click to place the opposite corner</li>
                  <li>• <strong>Formula:</strong> Perimeter = 2 × (length + width)</li>
                  <li>• <strong>Target:</strong> Try different sizes until perimeter ≈ {targetPerimeter} cm</li>
                </>
              ) : (
                <>
                  <li>• <strong>Step 1:</strong> Click to place one corner of the square</li>
                  <li>• <strong>Step 2:</strong> Click to place the opposite corner</li>
                  <li>• <strong>Formula:</strong> Perimeter = 4 × side length</li>
                  <li>• <strong>Target:</strong> You need side length ≈ {targetPerimeter > 0 ? (targetPerimeter / 4).toFixed(1) : '?'} cm</li>
                  <li>• <strong>Hint:</strong> That's about {targetPerimeter > 0 ? Math.round(targetPerimeter / 4) : '?'} grid boxes for each side</li>
                </>
              )}
            </ul>
          </div>
          
          {targetPerimeter > 0 && (
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Target: {targetPerimeter} cm</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Current: {currentPerimeter.toFixed(1)} cm</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border-2 border-blue-200"
            >
              <div className="text-sm space-y-1">
                <div className="font-bold text-gray-900">📏 Your Result:</div>
                <div className="font-semibold text-blue-600">Perimeter: {currentPerimeter.toFixed(1)} cm</div>
                {targetPerimeter > 0 && (
                  <>
                    <div className="text-gray-600">Target: {targetPerimeter.toFixed(1)} cm</div>
                    <div className={`text-xs font-medium ${
                      Math.abs(targetPerimeter - currentPerimeter) / targetPerimeter < 0.1
                        ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {Math.abs(targetPerimeter - currentPerimeter) / targetPerimeter < 0.1
                        ? '🎉 Perfect! You got it!' : '👍 Close! Try adjusting the size'}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Reset
          </button>
          
          {isComplete && (
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800">📐 Measurements:</div>
              {shape === 'circle' && (
                <div className="space-y-1">
                  <div>🔵 Radius: {((Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))) / scale).toFixed(1)} cm</div>
                  <div>📏 Diameter: {((2 * Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))) / scale).toFixed(1)} cm</div>
                  <div>🧮 Formula used: 2 × π × radius = 2 × 3.14 × {((Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))) / scale).toFixed(1)} = {currentPerimeter.toFixed(1)} cm</div>
                </div>
              )}
              {(shape === 'rectangle' || shape === 'square') && (
                <div className="space-y-1">
                  <div>📏 {shape === 'rectangle' ? 'Width' : 'Side'}: {(Math.abs(points[1].x - points[0].x) / scale).toFixed(1)} cm</div>
                  <div>📏 Height: {(Math.abs(points[1].y - points[0].y) / scale).toFixed(1)} cm</div>
                  <div>🧮 Formula used: {shape === 'rectangle' ? '2 × (width + height)' : '4 × side'} = {shape === 'rectangle' ? `2 × (${(Math.abs(points[1].x - points[0].x) / scale).toFixed(1)} + ${(Math.abs(points[1].y - points[0].y) / scale).toFixed(1)})` : `4 × ${(Math.abs(points[1].x - points[0].x) / scale).toFixed(1)}`} = {currentPerimeter.toFixed(1)} cm</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractivePerimeter;
