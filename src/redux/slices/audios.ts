// ** Component Imports
import instance from '../../configs/axios';
import { ENDPOINT } from '../../constants';

// ** Third Party Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

export const audios = createAsyncThunk('audios', async (id: number) => {
  try {
    const response = await instance.get(`${ENDPOINT.AUDIO}/${id}`);
    return response.data;
  } catch (error: any) {

    console.log('error?.response?.data:', error?.response?.data)
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

const audioSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(audios.pending, state => {
        state.loading = true;
      })
      .addCase(audios.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(audios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default audioSlice.reducer;
