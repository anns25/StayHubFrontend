import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import operationsReducer from './slices/operationSlice'
import activeHotelReducer from './slices/activeHotelSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    operations: operationsReducer,
    activeHotel: activeHotelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling dates if needed
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;