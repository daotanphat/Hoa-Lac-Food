import {
    GET_ORDER_BY_USER_FAILURE,
    GET_ORDER_BY_USER_REQUEST,
    GET_ORDER_BY_USER_SUCCESS,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAILURE
} from "./ActionTypes";

const initialState = {
    orders: [],
    loading: false,
    error: null,
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER_BY_USER_REQUEST:
        case CANCEL_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_ORDER_BY_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload
                        ? { ...order, status: "Canceled" }
                        : order
                )
            };

        case CANCEL_ORDER_FAILURE:
        case GET_ORDER_BY_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};