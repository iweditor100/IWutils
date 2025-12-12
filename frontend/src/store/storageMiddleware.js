import { createListenerMiddleware } from "@reduxjs/toolkit";
import { loginSuccess, logout } from "./authSlice";

const storageMiddleware = createListenerMiddleware();

// 1. LISTEN FOR LOGIN (Save USER only, ignore Token)
storageMiddleware.startListening({
    actionCreator: loginSuccess,
    effect: async (action, listenerApi) => {
        const { user } = action.payload; // Extract ONLY user
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
        }
    }
});

// 2. LISTEN FOR LOGOUT (Clear Storage)
storageMiddleware.startListening({
    actionCreator: logout,
    effect: async (action, listenerApi) => {
        localStorage.removeItem("authUser");
    }
});

export default storageMiddleware;
