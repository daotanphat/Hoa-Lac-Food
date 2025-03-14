import { GET_ORDER_BY_SHOP_FAILURE, GET_ORDER_BY_SHOP_REQUEST, GET_ORDER_BY_SHOP_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from "./ActionTypes";

const initialState = {
    orders: [],
    loading: false,
    error: null,
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
                orders: action.payload
            };

        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map(order =>
                    order.orderId === action.payload.orderId
                        ? { ...order, status: action.payload.status }
                        : order
                )
            };

        case UPDATE_ORDER_STATUS_FAILURE:
        case GET_ORDER_BY_SHOP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};