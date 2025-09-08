import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DefaultVisualizationProps {
  message?: string;
  className?: string;
}

const DefaultVisualization: React.FC<DefaultVisualizationProps> = ({
  message = 'Visualization not available',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default DefaultVisualization;
