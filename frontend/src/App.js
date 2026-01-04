import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { fetchPuzzle } from './store/puzzleSlice';
import PuzzleList from './components/PuzzleList';
import PuzzleGrid from './components/PuzzleGrid';
import CreatePuzzle from './components/CreatePuzzle';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState('list');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectPuzzle = (puzzleId) => {
    setSelectedPuzzleId(puzzleId);
    dispatch(fetchPuzzle(puzzleId));
    setCurrentView('puzzle');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPuzzleId(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧩 Puzzle Platform</h1>
        <nav className="app-nav">
          {currentView === 'puzzle' && (
            <button onClick={handleBackToList}>← Back to Puzzles</button>
          )}
          {currentView === 'list' && (
            <button onClick={() => setShowCreateModal(true)}>+ Create Puzzle</button>
          )}
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'list' && (
          <PuzzleList onSelectPuzzle={handleSelectPuzzle} />
        )}
        {currentView === 'puzzle' && selectedPuzzleId && (
          <PuzzleGrid puzzleId={selectedPuzzleId} />
        )}
      </main>

      {showCreateModal && (
        <CreatePuzzle onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
