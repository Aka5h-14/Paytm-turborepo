import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './slices/counter'
import hamburgerSlice from './slices/hamburger';
import loadingSlice from './slices/loading';
import errorSlice from './slices/errorState';

const store = configureStore({
    reducer: {
        counter: counterSlice,
        hamburger: hamburgerSlice,
        loading: loadingSlice,
        error: errorSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;