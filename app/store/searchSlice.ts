import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  thumbnail: string;
  original: string;
  title: string;
  link: string;
  source: string;
  is_product: boolean;
  favicon: string;
}

export type QueryType = 'text' | 'image';

interface SearchState {
  results: SearchResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  query: string;
  queryType: QueryType;
  imageFile: File | null;
}

const initialState: SearchState = {
  results: [],
  status: 'idle',
  error: null,
  query: '',
  queryType: 'text',
  imageFile: null,
};

export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async ({ query, queryType }: { query: string; queryType: QueryType }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/search?q=${query}&type=${queryType}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch search results');
    }
  }
);

export const fetchImageSearchResults = createAsyncThunk(
  'search/fetchImageResults',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/v1/image-search', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch image search results');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setQueryType(state, action: PayloadAction<QueryType>) {
      state.queryType = action.payload;
    },
    setImageFile(state, action: PayloadAction<File | null>) {
      state.imageFile = action.payload;
    },
    clearResults(state) {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = 'loading';
        state.results = []; // Clear results when a new search starts
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchImageSearchResults.pending, (state) => {
        state.status = 'loading';
        state.results = []; // Clear results when a new image search starts
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchImageSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(fetchImageSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, setQueryType, setImageFile, clearResults } = searchSlice.actions;
export default searchSlice.reducer;