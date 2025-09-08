import React, { useState } from 'react';

interface SupercellVisualizerProps {
  initialGrid?: number[][];
}

const SupercellVisualizer: React.FC<SupercellVisualizerProps> = ({ 
  initialGrid = [
    [200, 577, 626, 345],
    [43, 79, 375, 63],
    [198, 10, 29, 228]
  ]
}) => {
  const [grid, setGrid] = useState(initialGrid);
  const [supercells, setSupercells] = useState<Array<{row: number, col: number, value: number}>>([]);
  const [showSolution, setShowSolution] = useState(false);

  const findSupercells = () => {
    const newSupercells = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const currentValue = grid[i][j];
        let isSupercell = true;

        // Check all 8 neighbors (including diagonals)
        const neighbors = [
          { row: i - 1, col: j },     // up
          { row: i + 1, col: j },     // down
          { row: i, col: j - 1 },     // left
          { row: i, col: j + 1 },     // right
          { row: i - 1, col: j - 1 }, // up-left
          { row: i - 1, col: j + 1 }, // up-right
          { row: i + 1, col: j - 1 }, // down-left
          { row: i + 1, col: j + 1 }  // down-right
        ];

        // Check all existing neighbors
        for (const neighbor of neighbors) {
          if (neighbor.row >= 0 && neighbor.row < rows && 
              neighbor.col >= 0 && neighbor.col < cols) {
            if (grid[neighbor.row][neighbor.col] >= currentValue) {
              isSupercell = false;
              break;
            }
          }
        }
        
        // A supercell must have neighbors in at least 2 directions (not on edges)
        const validNeighbors = neighbors.filter(neighbor => 
          neighbor.row >= 0 && neighbor.row < rows && 
          neighbor.col >= 0 && neighbor.col < cols
        );
        
        if (validNeighbors.length < 2) {
          isSupercell = false;
        }

        if (isSupercell) {
          newSupercells.push({ row: i, col: j, value: currentValue });
        }
      }
    }

    setSupercells(newSupercells);
    setShowSolution(true);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col] = parseInt(value) || 0;
    setGrid(newGrid);
    setShowSolution(false);
  };

  const resetGrid = () => {
    setGrid(initialGrid);
    setSupercells([]);
    setShowSolution(false);
  };

  const isSupercell = (row: number, col: number) => {
    return supercells.some(sc => sc.row === row && sc.col === col);
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">🔍 Supercell Puzzle</h3>
        <p className="text-gray-600">Find numbers that are greater than all their neighbors!</p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            A supercell is a number that is greater than all its neighboring numbers (up, down, left, right).
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-1 p-4 bg-gray-100 rounded-lg">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center ${
                      isSupercell(rowIndex, colIndex) 
                        ? 'bg-green-200 border-green-500' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <input
                      type="number"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full h-full text-center text-sm font-semibold bg-transparent border-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={findSupercells}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Find Supercells
          </button>
          <button
            onClick={resetGrid}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Reset Grid
          </button>
        </div>
      </div>

      {showSolution && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-center">
            {supercells.length > 0 ? `Found ${supercells.length} Supercell(s)!` : 'No Supercells Found'}
          </h4>
          
          {supercells.length > 0 && (
            <div className="space-y-2">
              {supercells.map((sc, index) => (
                <div key={index} className="text-sm bg-white p-2 rounded border">
                  <span className="font-semibold">Supercell {index + 1}:</span> 
                  Value <span className="font-mono font-bold">{sc.value}</span> at position ({sc.row + 1}, {sc.col + 1})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p>💡 <strong>Tip:</strong> Try creating a grid where the largest numbers are surrounded by smaller ones!</p>
      </div>
    </div>
  );
};

export default SupercellVisualizer;
