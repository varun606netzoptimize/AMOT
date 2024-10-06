// ** Component Imports
import instance from '../../configs/axios';
import {ENDPOINT} from '../../constants';

// ** Third Party Imports
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const search = createAsyncThunk('search', async (value: string) => {
  try {
    const response = await instance.get(`${ENDPOINT.SEARCH}/${value}?time=${new Date().getTime()}`);
    return response.data;
  } catch (error: any) {
    // Toast.show({
    //   type: 'error',
    //   text1: error?.response?.data?.message,
    // });
    // throw error;
    console.log(error, 'Error in search audio');
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

const searchSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(search.pending, state => {
        state.loading = true;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(search.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;
