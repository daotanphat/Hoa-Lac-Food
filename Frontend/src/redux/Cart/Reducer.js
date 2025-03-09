import { ADD_FOOD_TO_CART_FAILURE, ADD_FOOD_TO_CART_REQUEST, ADD_FOOD_TO_CART_SUCCESS, GET_CART_OF_USER_FAILURE, GET_CART_OF_USER_REQUEST, GET_CART_OF_USER_SUCCESS } from "./ActionTypes";

const initialState = {
    carts: [],
    loading: false,
    error: null
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FOOD_TO_CART_REQUEST:
        case GET_CART_OF_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ADD_FOOD_TO_CART_SUCCESS:
            return {
                ...state,
                // cart: [...state.cart, action.payload],
                loading: false,
                error: null
            };
        case GET_CART_OF_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                carts: action.payload.data.cartItems
            };
        case GET_CART_OF_USER_FAILURE:
        case ADD_FOOD_TO_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};