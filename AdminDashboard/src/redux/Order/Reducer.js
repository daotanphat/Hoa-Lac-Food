import {
    GET_ORDER_BY_SHOP_REQUEST,
    GET_ORDER_BY_SHOP_SUCCESS,
    GET_ORDER_BY_SHOP_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE
} from './ActionTypes';

const initialState = {
    orders: [],
    loading: false,
    error: null
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER_BY_SHOP_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case GET_ORDER_BY_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: null
            };
            
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map(order => 
                    order.id === action.payload.orderId
                        ? { ...order, status: action.payload.status }
                        : order
                ),
                error: null
            };
            
        case GET_ORDER_BY_SHOP_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        default:
            return state;
    }
};