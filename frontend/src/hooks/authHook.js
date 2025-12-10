import {useSelector, useDispatch} from 'react-redux'
import { loginSuccess, logout } from '../store/authSlice'

export function useAuth() {
    const dispatch = useDispatch();
    const {user, accessToken, isAuthenticated} = useSelector(
        (state) => state.auth
    );



    const loginUser = (data) => {
        dispatch(loginSuccess(data));
    };


    const logoutUser = () => {
        dispatch(logout());
    };



    return {
        user, 
        accessToken, 
        isAuthenticated,
        loginUser,
        logoutUser,
    }
}



