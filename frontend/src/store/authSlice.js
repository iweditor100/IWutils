import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loadingAuth: true,   // to avoid flicker
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },

        finishLoading: (state) => {
            state.loadingAuth = false;
        }
    }
});

export const { loginSuccess, logout, finishLoading } = authSlice.actions;
export default authSlice.reducer;
