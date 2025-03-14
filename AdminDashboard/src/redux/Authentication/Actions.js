import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_SUCCESS } from "./ActionTypes";
import { api } from '../../config/Api';
import { toast } from "react-toastify";
import { getUserInfo } from "../User/Actions";

export const login = (requestData, navigate) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const response = await api.post('/api/Auth/login', requestData, { skipAuth: true });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.data.token);
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
            
            //Fetch user info after successful login
            dispatch(getUserInfo());
            
            toast.success(response.data.message || 'Login successfully!');

            setTimeout(() => {
                navigate('/');
            }, 500);
        }
    } catch (error) {
        const errorMessage = error.response?.data || 'Login failed. Please try again.';
        toast.error(errorMessage);
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    }
}

export const logout = () => (dispatch) => {
    try {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        dispatch({ type: LOGOUT_SUCCESS, payload: { message: "Logout successful" } });
    } catch (error) {
        dispatch({ type: LOGOUT_FAILURE, payload: "Logout failed" });
    }
};