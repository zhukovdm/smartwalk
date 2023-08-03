import { createSlice } from "@reduxjs/toolkit";

type SessionState = {
  login: boolean;
  solid: boolean;
};

const initialState = (): SessionState => {
  return { login: false, solid: false };
};

export const sessionSlice = createSlice({
  name: "session",
  initialState: initialState(),
  reducers: {
    resetSession: () => { return initialState(); },
    setSessionLogin: (state) => { state.login = true; },
    setSessionSolid: (state) => { state.solid = true; }
  }
});

export const {
  resetSession,
  setSessionLogin,
  setSessionSolid
} = sessionSlice.actions;

export default sessionSlice.reducer;
