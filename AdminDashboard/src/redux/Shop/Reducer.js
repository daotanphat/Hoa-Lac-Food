import { CREATE_SHOP_FAILURE, CREATE_SHOP_REQUEST, CREATE_SHOP_SUCCESS } from "./ActionTypes";

const initialState = {
    shop: null,
    loading: false,
    error: null
};

export const shopReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SHOP_REQUEST:
            return {
                ...state, loading: true,
                error: null
            };

        case CREATE_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload.data
            };

        case CREATE_SHOP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};