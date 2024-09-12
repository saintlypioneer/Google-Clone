import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  thumbnail: string;
  original: string;
  title: string;
  link: string;
  source: string;
  is_product: boolean;
  favicon: string;
}

interface SearchState {
  results: SearchResult[];
}

const initialState: SearchState = {
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<SearchResult[]>) {
      state.results = action.payload;
    },
  },
});

export const { setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;