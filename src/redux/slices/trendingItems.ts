/* eslint-disable prettier/prettier */
// ** Component Imports
import instance from '../../configs/axios';
import { ENDPOINT } from '../../constants';

// ** Third Party Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const trendingItems = createAsyncThunk('trendingItems', async (isConnected) => {
    try {
        const response = await instance.get(ENDPOINT.TRENDING);
        return response.data;
    } catch (error: any) {
        console.log(error?.response?.data, 'Error in trendingItems');
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

const trendingSlice = createSlice({
    name: 'data',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(trendingItems.pending, state => {
                state.loading = true;
            })
            .addCase(trendingItems.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(trendingItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default trendingSlice.reducer;