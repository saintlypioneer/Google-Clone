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

export type QueryType = 'text' | 'image' | 'imageUrl';

interface SearchState {
  results: SearchResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  query: string;
  queryType: QueryType;
  imageFile: File | null;
  imageUrl: string | null;
}

const initialState: SearchState = {
  results: [],
  status: 'idle',
  error: null,
  query: '',
  queryType: 'text',
  imageFile: null,
  imageUrl: null,
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
  async (payload: File | string, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (payload instanceof File) {
        formData.append('image', payload);
      } else if (typeof payload === 'string') {
        formData.append('imageUrl', payload);
      } else {
        throw new Error('Invalid payload type');
      }

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
      state.imageUrl = action.payload ? URL.createObjectURL(action.payload) : null;
    },
    setImageUrl(state, action: PayloadAction<string | null>) {
      state.imageUrl = action.payload;
      state.imageFile = null;
    },
    clearResults(state) {
      state.results = [];
    },
    updateImageUrl(state, action: PayloadAction<string>) {
      state.imageUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = 'loading';
        state.results = [];
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
        if (state.queryType === 'text' && action.payload.length > 0) {
          state.imageUrl = action.payload[0].original;
        }
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchImageSearchResults.pending, (state) => {
        state.status = 'loading';
        state.results = [];
        state.error = null;
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

export const { 
  setQuery, 
  setQueryType, 
  setImageFile, 
  setImageUrl, 
  clearResults, 
  updateImageUrl 
} = searchSlice.actions;

export default searchSlice.reducer;