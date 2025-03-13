import { api } from '../../config/Api';
import { GET_USER_INFO_FAILURE, GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS } from './ActionTypes';

export const getUserInfo = () => async (dispatch) => {
    dispatch({ type: GET_USER_INFO_REQUEST })
    try {
        const response = await api.get('/api/auth/info');
        dispatch({ type: GET_USER_INFO_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data || 'Get user info failed.';
        dispatch({ type: GET_USER_INFO_FAILURE, payload: errorMessage });
    }
}