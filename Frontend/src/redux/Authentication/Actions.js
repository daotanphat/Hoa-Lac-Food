import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_SUCCESS } from "./ActionTypes";
import { api } from '../../config/Api';

export const login = (requestData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const { data } = await api.post('/api/Auth/login', requestData);

        if (data !== null) {
            localStorage.setItem('token', data.data.token);
        }
        dispatch({ type: LOGIN_SUCCESS, payload: data })
        return { status: data.status, data: data.data };
    } catch (error) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
        return { status: statusCode, message: errorMessage };
    }
}

export const logout = () => (dispatch) => {
    try {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT_SUCCESS, payload: { message: "Logout successful" } });
    } catch (error) {
        dispatch({ type: LOGOUT_FAILURE, payload: "Logout failed" });
    }
};