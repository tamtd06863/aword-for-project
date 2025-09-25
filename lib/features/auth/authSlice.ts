import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Auth {
  userId: string;
  avatar_url: string;
  email: string;
  name: string;
}

export interface AuthState {
  auth: Auth;
}

export const initialState: AuthState = {
  auth: {} as Auth,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      // console.log("setAuth", action.payload);
      state.auth = action.payload;
    },

    clearAuth: (state) => {
      state.auth = {} as Auth;
    },
  },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;

export const { setAuth, clearAuth } = authSlice.actions;
