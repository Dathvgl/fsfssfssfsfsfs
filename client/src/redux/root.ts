import { combineReducers } from "@reduxjs/toolkit";
import { playerReducer } from "./slices/player";
import { userReducer } from "./slices/user";

const rootReducer = combineReducers({
  user: userReducer,
  player: playerReducer,
});

export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
