/* eslint-disable prettier/prettier */
// ** Component Imports
import instance from '../../configs/axios';
import { ENDPOINT } from '../../constants';
// ** Third Party Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export const favTracks = createAsyncThunk('favTracks', async userId => {
  
  try {
    const response = await instance.get(
      `${ENDPOINT.FAVORITE_TRACKS}/${userId}?time=${new Date().getTime()}`,
    );

    return response.data;
  } catch (error) {
    console.log('falied to fetch favorite tracks');
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

const favTracksSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(favTracks.pending, state => {
        state.loading = true;
      })
      .addCase(favTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(favTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favTracksSlice.reducer;
