import { GET_ORDER_BY_USER_FAILURE, GET_ORDER_BY_USER_REQUEST, GET_ORDER_BY_USER_SUCCESS, CANCEL_ORDER_REQUEST, CANCEL_ORDER_SUCCESS, CANCEL_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE } from "./ActionTypes";
import { api } from '../../config/Api';
import { toast } from "react-toastify";

export const getOrdersByCustomer = () => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_USER_REQUEST });

    try {
        const response = await api.get("/odata/order/customer");
        dispatch({ type: GET_ORDER_BY_USER_SUCCESS, payload: response.data });
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
        dispatch({ type: GET_ORDER_BY_USER_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const cancelOrder = (orderId) => async (dispatch) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });

    try {
        const response = await api.put(`/odata/order/${orderId}/cancel`);
        
        // If the cancellation was successful
        if (response.data && response.data.status === "success") {
            dispatch({ type: CANCEL_ORDER_SUCCESS, payload: orderId });
            toast.success("Order cancelled successfully!");
            
            // Refresh the orders list
            dispatch(getOrdersByCustomer());
            
            return true;
        } else {
            const errorMessage = response.data?.message || "Failed to cancel order.";
            dispatch({ type: CANCEL_ORDER_FAILURE, payload: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Failed to cancel order.";
        dispatch({ type: CANCEL_ORDER_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
        return false;
    }
};

export const createOrder = (orderData, navigate) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
        const response = await api.post('/api/Order', orderData);
        
        if (response.status === 200) {
            dispatch({ type: CREATE_ORDER_SUCCESS, payload: response.data });
            toast.success('Order created successfully!');
            navigate('/order'); // Navigate to order page after successful creation
        }
    } catch (error) {
        const errorMessage = error.response?.data || 'Failed to create order. Please try again.';
        toast.error(errorMessage);
        dispatch({ type: CREATE_ORDER_FAILURE, payload: errorMessage });
    }
};