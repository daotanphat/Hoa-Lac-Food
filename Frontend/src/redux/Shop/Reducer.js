import {
    GET_SHOPS_REQUEST,
    GET_SHOPS_SUCCESS,
    GET_SHOPS_FAILURE
} from "./ActionTypes";

const initialState = {
    shops: [],
    loading: false,
    error: null
};

export const shopReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SHOPS_REQUEST:
            return {
                ...state, loading: true,
                error: null
            };

        case GET_SHOPS_SUCCESS:
            return {
                ...state,
                loading: false,
                shops: action.payload
            };

        case GET_SHOPS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};