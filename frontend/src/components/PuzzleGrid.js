import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyOptimisticMove, rollbackMove } from '../store/puzzleSlice';
import { useWebSocket } from '../hooks/useWebSocket';
import './PuzzleGrid.css';

const PuzzleGrid = ({ puzzleId }) => {
  const dispatch = useDispatch();
  const { currentPuzzle, optimisticMoves } = useSelector(state => state.puzzle);
  const { sendMove, connected } = useWebSocket(puzzleId);
  const [pendingMoves, setPendingMoves] = useState({});
  const [totalRewards, setTotalRewards] = useState(0);

  const getCellValue = (row, col) => {
    for (const move of Object.values(optimisticMoves)) {
      if (move.row === row && move.col === col) {
        return move.value;
      }
    }
    
    if (currentPuzzle?.grid) {
      return currentPuzzle.grid[row * 4 + col];
    }
    return '0';
  };

  const handleCellClick = (row, col) => {
    if (!connected || currentPuzzle?.solved) return;
    
    const moveId = `move_${row}_${col}_${Date.now()}`;
    const currentValue = getCellValue(row, col);
    const newValue = currentValue === '0' ? '1' : '0';
    
    dispatch(applyOptimisticMove({ row, col, value: newValue, moveId }));
    setPendingMoves(prev => ({ ...prev, [moveId]: true }));
    
    const moveData = { puzzleId, row, col, value: newValue };
    sendMove(moveData);
    
    setTimeout(() => {
      setPendingMoves(prev => {
        if (prev[moveId]) {
          dispatch(rollbackMove({ moveId }));
          const updated = { ...prev };
          delete updated[moveId];
          return updated;
        }
        return prev;
      });
    }, 4000);
  };

  useEffect(() => {
    if (currentPuzzle?.solved && totalRewards === 0) {
      setTotalRewards(150);
    }
  }, [currentPuzzle?.solved, totalRewards]);

  useEffect(() => {
    const confirmedMoves = Object.keys(optimisticMoves).filter(
      moveId => !pendingMoves[moveId]
    );
    
    if (confirmedMoves.length > 0) {
      setPendingMoves(prev => {
        const updated = { ...prev };
        confirmedMoves.forEach(moveId => delete updated[moveId]);
        return updated;
      });
    }
  }, [optimisticMoves, pendingMoves]);

  if (!currentPuzzle) {
    return <div className="loading">Loading puzzle...</div>;
  }

  return (
    <div className="puzzle-container">
      <h2 className="puzzle-title">{currentPuzzle.name}</h2>
      
      <div className={`connection-indicator ${connected ? 'online' : 'offline'}`}>
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {currentPuzzle.solved ? (
        <div className="puzzle-solved-state">
          <div className="completion-celebration">
            🎉 Puzzle Completed! 🎉
            <div className="reward-points">
              You earned {totalRewards} points!
            </div>
          </div>
          <div className="solved-grid">
            {[0, 1, 2, 3].map(row =>
              [0, 1, 2, 3].map(col => {
                const cellValue = getCellValue(row, col);
                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className={`game-cell solved ${cellValue === '1' ? 'filled' : 'empty'}`}
                  >
                    {cellValue}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="puzzle-active-state">
          <div className="game-status">
            🎯 Solve the puzzle by clicking cells to match the target pattern!
          </div>
          <div className="game-board">
            {[0, 1, 2, 3].map(row =>
              [0, 1, 2, 3].map(col => {
                const cellValue = getCellValue(row, col);
                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className={`game-cell ${cellValue === '1' ? 'filled' : 'empty'}`}
                    onClick={() => handleCellClick(row, col)}
                  >
                    {cellValue}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      
      <div className="game-instructions">
        <h3>Rules:</h3>
        <p>{currentPuzzle.rules}</p>
      </div>
    </div>
  );
};

export default PuzzleGrid;
