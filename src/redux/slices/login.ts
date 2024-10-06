// ** Component Imports
import instance from '../../configs/axios';
import { ENDPOINT } from '../../constants';

// ** Third Party Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

// ** Types Imports
import { FormData, UserData } from '../../@types';

export const login = createAsyncThunk('login', async (data: FormData) => {

  try {
    await instance
      .post(`${ENDPOINT.LOGIN}`, data)
      .then(async response => {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      });
  } catch (error: any) {

    Toast.show({
      type: 'error',
      text1: error?.response?.data?.message ? error?.response?.data?.message : 'Login Error: something went wrong.',
    });
    throw error;
  }
});

interface InitialState {
  data: UserData[];
  loading: boolean;
  error: unknown | null;
}

const initialState: InitialState = {
  data: [],
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'data',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
