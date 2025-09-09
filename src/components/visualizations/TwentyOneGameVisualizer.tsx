import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface GameState {
  currentNumber: number;
  targetNumber: number;
  maxAdd: number;
  isPlayerTurn: boolean;
  gameOver: boolean;
  winner: 'player' | 'computer' | null;
  moves: Array<{ player: 'player' | 'computer'; added: number; newTotal: number }>;
}

interface TwentyOneGameVisualizerProps {
  className?: string;
}

export const TwentyOneGameVisualizer: React.FC<TwentyOneGameVisualizerProps> = ({ className = '' }) => {
  const [gameMode, setGameMode] = useState<'game1' | 'game2' | 'custom'>('game1');
  const [customTarget, setCustomTarget] = useState(50);
  const [customMaxAdd, setCustomMaxAdd] = useState(5);
  const [gameState, setGameState] = useState<GameState>({
    currentNumber: 0,
    targetNumber: 21,
    maxAdd: 3,
    isPlayerTurn: true,
    gameOver: false,
    winner: null,
    moves: []
  });
  const [showStrategy, setShowStrategy] = useState(false);

  const initializeGame = useCallback(() => {
    const config = {
      game1: { target: 21, maxAdd: 3 },
      game2: { target: 99, maxAdd: 10 },
      custom: { target: customTarget, maxAdd: customMaxAdd }
    };
    
    setGameState({
      currentNumber: 0,
      targetNumber: config[gameMode].target,
      maxAdd: config[gameMode].maxAdd,
      isPlayerTurn: true,
      gameOver: false,
      winner: null,
      moves: []
    });
    setShowStrategy(false);
  }, [gameMode, customTarget, customMaxAdd]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const calculateWinningStrategy = useCallback((target: number, maxAdd: number) => {
    // The winning strategy is to leave your opponent with numbers that are multiples of (maxAdd + 1)
    const keyNumber = maxAdd + 1;
    const winningNumbers = [];
    
    for (let i = keyNumber; i < target; i += keyNumber) {
      winningNumbers.push(i);
    }
    
    return winningNumbers;
  }, []);

  const getComputerMove = useCallback((current: number, _target: number, maxAdd: number) => {
    const keyNumber = maxAdd + 1;
    const remainder = current % keyNumber;
    
    if (remainder === 0) {
      // If we're at a winning position, add 1 to 3 randomly
      return Math.floor(Math.random() * maxAdd) + 1;
    } else {
      // Try to get to the next winning position
      const nextWinning = Math.ceil(current / keyNumber) * keyNumber;
      const needed = nextWinning - current;
      return Math.min(needed, maxAdd);
    }
  }, []);

  const makeMove = useCallback((added: number) => {
    if (gameState.gameOver || !gameState.isPlayerTurn) return;

    const newTotal = gameState.currentNumber + added;
    const newMoves = [...gameState.moves, { player: 'player' as const, added, newTotal }];
    
    let newState = {
      ...gameState,
      currentNumber: newTotal,
      moves: newMoves,
      isPlayerTurn: false
    };

    // Check if player won
    if (newTotal >= gameState.targetNumber) {
      newState = {
        ...newState,
        gameOver: true,
        winner: 'player'
      };
    } else {
      // Computer's turn
      const computerMove = getComputerMove(newTotal, gameState.targetNumber, gameState.maxAdd);
      const computerTotal = newTotal + computerMove;
      
      newState = {
        ...newState,
        currentNumber: computerTotal,
        moves: [...newMoves, { player: 'computer' as const, added: computerMove, newTotal: computerTotal }],
        isPlayerTurn: true
      };

      // Check if computer won
      if (computerTotal >= gameState.targetNumber) {
        newState = {
          ...newState,
          gameOver: true,
          winner: 'computer'
        };
      }
    }

    setGameState(newState);
  }, [gameState, getComputerMove]);

  const winningNumbers = calculateWinningStrategy(gameState.targetNumber, gameState.maxAdd);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🎮 The 21 Game & Variations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Game Mode:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={gameMode === 'game1' ? 'default' : 'outline'}
                onClick={() => setGameMode('game1')}
                className="flex-1 min-w-[120px]"
              >
                Game 1: Target 21, Add 1-3
              </Button>
              <Button
                variant={gameMode === 'game2' ? 'default' : 'outline'}
                onClick={() => setGameMode('game2')}
                className="flex-1 min-w-[120px]"
              >
                Game 2: Target 99, Add 1-10
              </Button>
              <Button
                variant={gameMode === 'custom' ? 'default' : 'outline'}
                onClick={() => setGameMode('custom')}
                className="flex-1 min-w-[120px]"
              >
                Custom Game
              </Button>
            </div>
          </div>

          {/* Custom Game Settings */}
          {gameMode === 'custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Target Number:</label>
                <input
                  type="number"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(parseInt(e.target.value) || 50)}
                  className="w-full p-2 border rounded"
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Add per Turn:</label>
                <input
                  type="number"
                  value={customMaxAdd}
                  onChange={(e) => setCustomMaxAdd(parseInt(e.target.value) || 5)}
                  className="w-full p-2 border rounded"
                  min="2"
                  max="20"
                />
              </div>
            </div>
          )}

          {/* Game Rules */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Rules:</h4>
            <ul className="text-sm space-y-1">
              <li>• Players take turns adding 1 to {gameState.maxAdd} to the current number</li>
              <li>• First player to reach {gameState.targetNumber} wins!</li>
              <li>• You play against the computer</li>
            </ul>
          </div>

          {/* Game Status */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">
              Current Number: {gameState.currentNumber}
            </div>
            <div className="text-lg">
              Target: {gameState.targetNumber} | Max Add: {gameState.maxAdd}
            </div>
            {gameState.gameOver ? (
              <div className={`text-2xl font-bold ${gameState.winner === 'player' ? 'text-green-600' : 'text-red-600'}`}>
                {gameState.winner === 'player' ? '🎉 You Win!' : '🤖 Computer Wins!'}
              </div>
            ) : (
              <div className="text-lg">
                {gameState.isPlayerTurn ? 'Your turn!' : 'Computer is thinking...'}
              </div>
            )}
          </div>

          {/* Game Controls */}
          {!gameState.gameOver && gameState.isPlayerTurn && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-center">Your Move:</h4>
              <div className="flex justify-center gap-3">
                {Array.from({ length: gameState.maxAdd }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    onClick={() => makeMove(num)}
                    disabled={gameState.currentNumber + num > gameState.targetNumber}
                    className="w-16 h-16 text-xl font-bold"
                    variant="outline"
                  >
                    +{num}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Strategy Toggle */}
          <div className="text-center">
            <Button
              onClick={() => setShowStrategy(!showStrategy)}
              variant="outline"
              className="mb-4"
            >
              {showStrategy ? 'Hide' : 'Show'} Winning Strategy
            </Button>
          </div>

          {/* Winning Strategy */}
          {showStrategy && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Winning Strategy:</h4>
              <p className="text-sm mb-3">
                The key is to leave your opponent with numbers that are multiples of {gameState.maxAdd + 1}.
                This way, no matter what they add (1 to {gameState.maxAdd}), you can always add enough to reach the next multiple.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Winning positions: {winningNumbers.join(', ')}</p>
                <p className="text-sm">
                  <strong>Pattern:</strong> Every {gameState.maxAdd + 1} numbers starting from {gameState.maxAdd + 1}
                </p>
              </div>
            </div>
          )}

          {/* Move History */}
          {gameState.moves.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Move History:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {gameState.moves.map((move, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-100 rounded">
                    <span className={move.player === 'player' ? 'text-blue-600' : 'text-red-600'}>
                      {move.player === 'player' ? 'You' : 'Computer'}
                    </span>
                    {' '}added {move.added} → {move.newTotal}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="text-center">
            <Button onClick={initializeGame} variant="outline">
              🔄 New Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwentyOneGameVisualizer;

