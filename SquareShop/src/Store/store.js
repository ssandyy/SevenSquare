import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the reducer directly

const store = configureStore({
  reducer: {
    auth: authReducer, // Use the imported reducer
    // TODO: add more slices here for posts
  }
});

export default store;