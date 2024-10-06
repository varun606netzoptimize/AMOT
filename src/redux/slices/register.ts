// ** Third Party Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

// ** Component Imports
import instance from '../../configs/axios';
import {ENDPOINT} from '../../constants';

export const register = createAsyncThunk('register', async data => {
  try {
    const response = await instance.post(ENDPOINT.REGISTER, data);
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.data));

    return response.data;
  } catch (error: any) {

    throw error;
  }
});

interface InitialState {
  data: {};
  loading: boolean;
  error: unknown | null;
}

const initialState: InitialState = {
  data: {},
  loading: false,
  error: null,
};

export const registerFormSlice = createSlice({
  name: 'register',
  initialState: initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<object>) => {
      return {
        ...state,
        data: {...state.data, ...action.payload},
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {updateFormData} = registerFormSlice.actions;

export default registerFormSlice.reducer;
