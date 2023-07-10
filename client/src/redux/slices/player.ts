import { createSlice } from "@reduxjs/toolkit";

type PlayerState = {
  id?: string;
  src?: string;
  played?: boolean;
  loop?: string;
  volume: number;
  error?: string;
};

const initialState: PlayerState = { volume: 0.1 };

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    init: (state, action) => {
      state.id = action.payload.id;
      state.src = action.payload.src;
      state.error = undefined;
    },
    played: (state, action) => {
      state.played = action.payload.played;
    },
    volumed: (state, action) => {
      state.volume = action.payload.volume;
    },
    empty: (state) => {
      state.src = undefined;
      state.error = undefined;
    },
  },
});

export const { init, played, volumed, empty } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
