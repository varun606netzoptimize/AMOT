// ** Third Party Imports
import {configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';

// ** Component Imports
import audios from './slices/audios';
import categories from './slices/categories';
import trendingItems from './slices/trendingItems';
import freePlaylists from './slices/freePlaylists';
import login from './slices/login';
import playlists from './slices/playlists';
import register from './slices/register';
import search from './slices/search';
import favPlaylist from './slices/favPlaylist';
import subCategories from './slices/subCategory';

export const store = configureStore({
  reducer: {
    registerUser: register,
    loginUser: login,
    category: categories,
    trending: trendingItems,
    free: freePlaylists,
    playlist: playlists,
    audio: audios,
    search: search,
    getFavPlaylist: favPlaylist,
    subCats: subCategories,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
