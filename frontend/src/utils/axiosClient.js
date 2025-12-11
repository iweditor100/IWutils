import axios from "axios";
import { store } from "../store/store";
import { loginSuccess, logout } from "../store/authSlice";
const backendURL = import.meta.env.VITE_BACKEND_API

const axiosClient = axios.create({
    baseURL:  backendURL,
    withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If refresh call itself fails → don't retry again
    if (original?.url?.includes("/auth/refresh")) {
      store.dispatch(logout());
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshRes = await axiosClient.get("/auth/refresh");

        const { accessToken, user } = refreshRes.data;

        store.dispatch(
          loginSuccess({
            user,
            accessToken,
          })
        );

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return axiosClient(original);
      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);


export default axiosClient;