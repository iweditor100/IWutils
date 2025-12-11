import { loginSuccess, logout, finishLoading } from "../store/authSlice";
import { store } from "../store/store";
import axiosClient from "./axiosClient";

export const restoreSession = async () => {
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
        store.dispatch(logout());
        return false;
    } finally {
        // tell the app that loading is finish
        store.dispatch(finishLoading());
    }
};
