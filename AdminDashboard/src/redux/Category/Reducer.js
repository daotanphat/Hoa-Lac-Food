import {
    GET_ALL_CATEGORY_REQUEST,
    GET_ALL_CATEGORY_SUCCESS,
    GET_ALL_CATEGORY_FAILURE,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAILURE,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE
} from './ActionTypes';

const initialState = {
    categories: [],
    loading: false,
    error: null
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_CATEGORY_REQUEST:
        case UPDATE_CATEGORY_REQUEST:
        case CREATE_CATEGORY_REQUEST:
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_ALL_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload.data,
                error: null
            };

        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };

        case CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };

        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };

        case GET_ALL_CATEGORY_FAILURE:
        case UPDATE_CATEGORY_FAILURE:
        case CREATE_CATEGORY_FAILURE:
        case DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};