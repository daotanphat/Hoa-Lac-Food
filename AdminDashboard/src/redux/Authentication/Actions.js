import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes";
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

            // Fetch user info and get the data directly
            const userInfo = await dispatch(getUserInfo());
            if (userInfo.data.shopId !== null) {
                toast.success(response.data.message || 'Login successfully!');

                setTimeout(() => {
                    navigate('/');
                }, 500);
            } else {
                toast.success('You need to create a shop first!');

                setTimeout(() => {
                    navigate('/create-shop');
                }, 500);
            }


        }
    } catch (error) {
        console.log(error);

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

export const register = (requestData, navigate) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const response = await api.post('/api/auth/register', requestData, { skipAuth: true });

        if (response.status === 200) {
            dispatch({ type: REGISTER_SUCCESS, payload: response.data });
            toast.success(response.data.message || 'Register successfully!');
            
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    }
};