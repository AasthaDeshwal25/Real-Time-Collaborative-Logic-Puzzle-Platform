import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPuzzles } from '../store/puzzleSlice';
import './PuzzleList.css';

const PuzzleList = ({ onSelectPuzzle }) => {
  const dispatch = useDispatch();
  const { puzzles, loading } = useSelector(state => state.puzzle);

  useEffect(() => {
    dispatch(fetchPuzzles());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading puzzles...</div>;
  }

  return (
    <div className="puzzle-list">
      <h2>Puzzle Collection</h2>
      {puzzles.length === 0 ? (
        <div className="no-puzzles">
          <p>No puzzles yet!</p>
          <p>Create your first puzzle to get started!</p>
        </div>
      ) : (
        <div className="puzzle-cards">
          {puzzles.map(puzzle => (
            <div 
              key={puzzle.id} 
              className={`puzzle-card ${puzzle.solved ? 'completed' : ''}`}
              onClick={() => onSelectPuzzle(puzzle.id)}
            >
              <h3>{puzzle.name}</h3>
              <div className={`puzzle-status ${puzzle.solved ? 'solved' : 'unsolved'}`}>
                {puzzle.solved ? '✅ Completed' : '🎯 Ready to solve'}
              </div>
              <div className="puzzle-date">
                Created: {new Date(puzzle.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PuzzleList;
