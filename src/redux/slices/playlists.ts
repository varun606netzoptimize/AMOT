// ** Constant Imports
import {ENDPOINT} from '../../constants';

// ** Component Imports
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../../configs/axios';

// ** Third Party Imports
import Toast from 'react-native-toast-message';

export const playlists = createAsyncThunk('playlists', async (id) => {
  console.log('id:', id, 'page:', page)

  try {
    const response = await instance.get(`${ENDPOINT.CATEGORIES}/${id}?page=2`);

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

const playlistsSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(playlists.pending, state => {
        state.loading = true;
      })
      .addCase(playlists.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(playlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playlistsSlice.reducer;
