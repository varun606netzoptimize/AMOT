// ** Constant Imports
import {ENDPOINT} from '../../constants';

// ** Component Imports
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../../configs/axios';

// ** Third Party Imports
import Toast from 'react-native-toast-message';

export const subCategories = createAsyncThunk(
  'subCategories',
  async (id: any) => {
    try {
      const response = await instance.get(`${ENDPOINT.CATEGORIES}/${id}`);
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

const subCategoriesSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(subCategories.pending, state => {
        state.loading = true;
      })
      .addCase(subCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(subCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subCategoriesSlice.reducer;
