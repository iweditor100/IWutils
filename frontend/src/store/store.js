import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js'
import storageMiddleware from "./storageMiddleware.js";

// 1. Load User from Desk (Hydration)
const preloadedState = () => {
    try {
        const serializedUser = localStorage.getItem('authUser');
        if (serializedUser) {
            return {
                auth: {
                    user: JSON.parse(serializedUser),
                    accessToken: null, // Token is MEMORY ONLY (Security)
                    isAuthenticated: true, // We assume true until proven false
                    loadingAuth: false // No loading, instant access
                }
            };
        }
    } catch (e) {
        return undefined;
    }
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: preloadedState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(storageMiddleware.middleware),
})