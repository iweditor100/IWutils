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
    async(err) => {
        const original = err.config;

        if(err.response?.status === 401 && !original._retry) {
            original._retry = true;


            try {
                // ask backend for new access token 
                const refreshRes = await axios.get(`${backendURL}/auth/refresh`, {
                    withCredentials: true
                });


                const newAccessToken = refreshRes.data.accessToken;


                // update the redux store with new token. 
                const prevUser = store.getState().auth.user;

                store.dispatch(
                    loginSuccess({
                        user:prevUser,
                        accessToken: newAccessToken,
                    })
                )


                // attach new token to failed request: 
                original.headers["Authorization"] = `Bearer ${newAccessToken}`;


                // Retry the original Request: 
                return axiosClient(original);
            } catch(refreshErr) {
                // Refresh token -> invalid -> logout user.
                store.dispatch(logout());
            }
        } 

        return Promise.reject(err);
    }
)


export default axiosClient;