import { createSlice } from '@reduxjs/toolkit';

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: {
    client: null,
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
  },
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
      if (action.payload) {
        state.reconnectAttempts = 0;
      }
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
  },
});

export const { 
  setClient, 
  setConnected, 
  incrementReconnectAttempts, 
  resetReconnectAttempts 
} = websocketSlice.actions;

export default websocketSlice.reducer;
