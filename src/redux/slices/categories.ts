/* eslint-disable prettier/prettier */
// ** Component Imports
import instance from '../../configs/axios';
import { ENDPOINT } from '../../constants';

// ** Third Party Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

export const categories = createAsyncThunk('categories', async () => {
  try {
    const response = await instance.get(`${ENDPOINT.CATEGORIES}?time=${new Date().getTime()}`);
    return response.data;
  } catch (error: any) {
    console.log(error?.response?.data, 'Error in categories');
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

const categorySlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(categories.pending, state => {
        state.loading = true;
      })
      .addCase(categories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(categories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
