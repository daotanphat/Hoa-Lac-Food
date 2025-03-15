import { GET_ALL_CATEGORY_FAILURE, GET_ALL_CATEGORY_REQUEST, GET_ALL_CATEGORY_SUCCESS } from "./ActionTypes";

const initialState = {
    categories: [],
    message: null,
    isLoading: false,
    error: null
}

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_ALL_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                categories: action.payload.data
            };
        case GET_ALL_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};