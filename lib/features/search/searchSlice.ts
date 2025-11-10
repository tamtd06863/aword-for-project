import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  query: string;
}

export const initialState: SearchState = {
  query: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    clearQuery: (state) => {
      state.query = "";
    },
  },
});

export const selectAuth = (state: { search: SearchState }) => state.search;

export default searchSlice.reducer;

export const { setQuery, clearQuery } = searchSlice.actions;
