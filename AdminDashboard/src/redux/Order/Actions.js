import { api } from '../../config/Api';
import { toast } from "react-toastify";
import { GET_ORDER_BY_SHOP_FAILURE, GET_ORDER_BY_SHOP_REQUEST, GET_ORDER_BY_SHOP_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from './ActionTypes';

export const getOrdersByShop = () => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_SHOP_REQUEST });

    try {
        const response = await api.get("/odata/order/shop");
        dispatch({ type: GET_ORDER_BY_SHOP_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
        dispatch({ type: GET_ORDER_BY_SHOP_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    try {
        const response = await api.put(`/api/order/${orderId}/update-status`, { status });
        dispatch({
            type: UPDATE_ORDER_STATUS_SUCCESS,
            payload: { orderId, status }
        });
        toast.success('Order status updated successfully.');
    } catch (error) {
        console.log(error);
        
        const errorMessage = error.response?.data?.message || "Failed to update order status.";
        dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};