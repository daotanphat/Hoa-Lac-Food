import { toast } from 'react-toastify';
import { api } from '../../config/Api';
import {
    GET_SHOPS_REQUEST,
    GET_SHOPS_SUCCESS,
    GET_SHOPS_FAILURE,
    GET_SHOP_DETAIL_REQUEST,
    GET_SHOP_DETAIL_SUCCESS,
    GET_SHOP_DETAIL_FAILURE
} from './ActionTypes';

export const getShops = () => async (dispatch) => {
    dispatch({ type: GET_SHOPS_REQUEST });
    try {
        const response = await api.get("/odata/shop");
        dispatch({
            type: GET_SHOPS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch shops.";
        dispatch({ type: GET_SHOPS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};