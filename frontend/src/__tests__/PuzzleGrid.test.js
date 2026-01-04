import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PuzzleGrid from '../components/PuzzleGrid';
import puzzleReducer from '../store/puzzleSlice';
import websocketReducer from '../store/websocketSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      puzzle: puzzleReducer,
      websocket: websocketReducer,
    },
    preloadedState: {
      puzzle: {
        currentPuzzle: {
          id: 1,
          name: 'Test Puzzle',
          grid: '0000000000000000',
          rules: 'Test rules',
          solved: false,
        },
        optimisticMoves: {},
        ...initialState.puzzle,
      },
      websocket: {
        connected: true,
        ...initialState.websocket,
      },
    },
  });
};

// Mock the WebSocket hook
jest.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    connected: true,
    sendMove: jest.fn(),
  }),
}));

describe('PuzzleGrid', () => {
  test('renders puzzle grid correctly', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <PuzzleGrid puzzleId={1} />
      </Provider>
    );

    expect(screen.getByText('Test Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Test rules')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(16);
  });

  test('handles cell click', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <PuzzleGrid puzzleId={1} />
      </Provider>
    );

    const cells = screen.getAllByText('0');
    fireEvent.click(cells[0]);

    // Should apply optimistic update
    const state = store.getState();
    expect(Object.keys(state.puzzle.optimisticMoves)).toHaveLength(1);
  });
});
