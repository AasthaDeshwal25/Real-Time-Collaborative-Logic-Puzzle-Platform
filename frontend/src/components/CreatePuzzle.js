import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPuzzle } from '../store/puzzleSlice';
import './CreatePuzzle.css';

const CreatePuzzle = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    solution: '0000000000000000',
    rules: ''
  });

  const handleGridClick = (index) => {
    const newSolution = formData.solution.split('');
    newSolution[index] = newSolution[index] === '0' ? '1' : '0';
    setFormData({ ...formData, solution: newSolution.join('') });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.rules.trim()) {
      dispatch(createPuzzle(formData));
      onClose();
    }
  };

  return (
    <div className="create-puzzle-modal">
      <div className="modal-content">
        <h2>Create New Puzzle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Puzzle Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter puzzle name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Solution Pattern (click to toggle):</label>
            <div className="solution-grid">
              {formData.solution.split('').map((cell, index) => (
                <div
                  key={index}
                  className={`solution-cell ${cell === '1' ? 'filled' : 'empty'}`}
                  onClick={() => handleGridClick(index)}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Rules:</label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              placeholder="Describe the puzzle rules..."
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit">Create Puzzle</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePuzzle;
