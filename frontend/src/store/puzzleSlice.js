import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPuzzles = createAsyncThunk(
  'puzzle/fetchPuzzles',
  async () => {
    const response = await fetch('/api/puzzles');
    return response.json();
  }
);

export const fetchPuzzle = createAsyncThunk(
  'puzzle/fetchPuzzle',
  async (id) => {
    const response = await fetch(`/api/puzzles/${id}`);
    return response.json();
  }
);

export const createPuzzle = createAsyncThunk(
  'puzzle/createPuzzle',
  async (puzzleData) => {
    const response = await fetch('/api/puzzles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(puzzleData),
    });
    return response.json();
  }
);

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState: {
    puzzles: [],
    currentPuzzle: null,
    optimisticMoves: {},
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPuzzle: (state, action) => {
      state.currentPuzzle = action.payload;
      state.optimisticMoves = {};
    },
    applyOptimisticMove: (state, action) => {
      const { row, col, value, moveId } = action.payload;
      state.optimisticMoves[moveId] = { row, col, value, timestamp: Date.now() };
    },
    confirmMove: (state, action) => {
      const { row, col, value } = action.payload;
      if (state.currentPuzzle) {
        const grid = state.currentPuzzle.grid.split('');
        grid[row * 4 + col] = value;
        state.currentPuzzle.grid = grid.join('');
      }
      // Clear matching optimistic moves
      Object.keys(state.optimisticMoves).forEach(moveId => {
        const move = state.optimisticMoves[moveId];
        if (move.row === row && move.col === col) {
          delete state.optimisticMoves[moveId];
        }
      });
    },
    rollbackMove: (state, action) => {
      const { moveId } = action.payload;
      delete state.optimisticMoves[moveId];
    },
    puzzleSolved: (state, action) => {
      if (state.currentPuzzle) {
        state.currentPuzzle.solved = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuzzles.fulfilled, (state, action) => {
        state.puzzles = action.payload;
        state.loading = false;
      })
      .addCase(fetchPuzzle.fulfilled, (state, action) => {
        state.currentPuzzle = action.payload;
        state.optimisticMoves = {};
        state.loading = false;
      })
      .addCase(createPuzzle.fulfilled, (state, action) => {
        state.puzzles.push(action.payload);
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { 
  setCurrentPuzzle, 
  applyOptimisticMove, 
  confirmMove, 
  rollbackMove, 
  puzzleSolved 
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
