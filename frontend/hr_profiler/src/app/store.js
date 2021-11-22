import { configureStore } from '@reduxjs/toolkit';
import userInfo from '../slices/slices/userInfoSlice';
import config from '../slices/slices/configurations';
import scrappedData from '../slices/slices/dataSlice';
// import webSocket from '../slices/slices/webSocketSlice';

export const store = configureStore({
  reducer: {
    userInfo,
    config,
    scrappedData,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
