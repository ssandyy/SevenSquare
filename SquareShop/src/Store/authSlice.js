import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: null, // ← initially unknown
  userData: null,
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload; // Direct payload assignment
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    }
  }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;