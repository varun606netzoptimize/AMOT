// ** Constant Imports
import { ENDPOINT } from '../../constants';

// ** Component Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import instance from '../../configs/axios';

// ** Third Party Imports
import Toast from 'react-native-toast-message';

export const freePlaylists = createAsyncThunk(
  'freePlaylists',
  async (page: number) => {
    try {
      const response = await instance.get(
        `${ENDPOINT.FREE_PLAYLIST}?page=${page}?time=${new Date().getTime()}`,
      );
      return response.data;
    } catch (error: any) {
    
      throw error;
    }
  },
);

interface InitialState {
  data: any[];
  loading: boolean;
  error: unknown | null;
}

const initialState: InitialState = {
  data: [],
  loading: false,
  error: null,
};

const freePlaylistSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(freePlaylists.pending, state => {
        state.loading = true;
      })
      .addCase(freePlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(freePlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default freePlaylistSlice.reducer;
