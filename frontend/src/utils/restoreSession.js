import { loginSuccess, logout, finishLoading } from "../store/authSlice";
import { store } from "../store/store";
import axiosClient from "./axiosClient";

// Helper to check if we even have a chance of being logged in (e.g. check for a flag)
// But since we use HttpOnly cookies, we can't check the cookie existence in JS.
// However, we should avoid spamming the console if we are just strictly visiting the login page.

export const restoreSession = async () => {
    // Optimization: If we already have the user in Redux (via Hydration), 
    // we still run this to VALIDATE validity, but we can do it silently.

    try {
        const res = await axiosClient.get("/auth/refresh");

        const { user, accessToken } = res.data;

        store.dispatch(
            loginSuccess({
                user,
                accessToken,
            })
        );
        return true;
    } catch (err) {
        // If 401/403, it means Cookie is dead/missing.
        // We just logout (Clear Redux + Storage)
        store.dispatch(logout());
        return false;
    } finally {
        store.dispatch(finishLoading());
    }
};
