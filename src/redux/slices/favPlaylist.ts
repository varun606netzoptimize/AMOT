// ** Component Imports
import instance from '../../configs/axios';
import {ENDPOINT} from '../../constants';

// ** Third Party Imports
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

export const favPlaylist = createAsyncThunk('favPlaylist', async userId => {
  try {
    const response = await instance.get(
      `${ENDPOINT.FAVORITE_PLAYLIST}/${userId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
});

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

const favPlaylistSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(favPlaylist.pending, state => {
        state.loading = true;
      })
      .addCase(favPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(favPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favPlaylistSlice.reducer;
