import {
   Action,
   configureStore,
   ThunkAction,
} from '@reduxjs/toolkit';
import projectReducer from '@/features/projects/projectSlice';

export const store = configureStore({
   reducer: {
      project: projectReducer,
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
>;