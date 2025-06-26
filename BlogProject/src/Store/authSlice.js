import { createSlice } from 'react-redux';

// const initialState = {
//         status: false,
//         userData: null
//     }

const authSlice = createSlice({
    name: "auth",
    initialState : {
        status: false,
        userData: null
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload  // name is same userData == userData
            // or
            // state.userData = action.payload.userData
        },
        // we dont have to pass anything so no need of action 
        logout: (state) => {
            state.status = false,
            state.userData = null;
        }
    }
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducers;