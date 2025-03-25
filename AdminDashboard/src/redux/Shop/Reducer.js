import { CREATE_SHOP_FAILURE, CREATE_SHOP_REQUEST, CREATE_SHOP_SUCCESS, GET_SHOP_BY_ID_FAILURE, GET_SHOP_BY_ID_REQUEST, GET_SHOP_BY_ID_SUCCESS, GET_SHOPS_FAILURE, GET_SHOPS_REQUEST, GET_SHOPS_SUCCESS, UPDATE_SHOP_FAILURE, UPDATE_SHOP_REQUEST, UPDATE_SHOP_STATEMENT_FAILURE, UPDATE_SHOP_STATEMENT_REQUEST, UPDATE_SHOP_STATEMENT_SUCCESS, UPDATE_SHOP_SUCCESS, UPDATE_SHOP_STATUS_REQUEST, UPDATE_SHOP_STATUS_SUCCESS, UPDATE_SHOP_STATUS_FAILURE } from "./ActionTypes";

const initialState = {
    shop: null,
    shops: [],
    loading: false,
    error: null
};

export const shopReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SHOP_REQUEST:
        case GET_SHOP_BY_ID_REQUEST:
        case UPDATE_SHOP_STATEMENT_REQUEST:
        case UPDATE_SHOP_REQUEST:
        case GET_SHOPS_REQUEST:
        case UPDATE_SHOP_STATUS_REQUEST:
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

        case GET_SHOP_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload.data
            };
        case UPDATE_SHOP_STATEMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload.data
            };
        case UPDATE_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload.data
            };
        case UPDATE_SHOP_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload.data
            };
        case GET_SHOPS_SUCCESS:
            return {
                ...state,
                loading: false,
                shops: action.payload
            };

        case GET_SHOP_BY_ID_FAILURE:
        case CREATE_SHOP_FAILURE:
        case UPDATE_SHOP_STATEMENT_FAILURE:
        case UPDATE_SHOP_FAILURE:
        case GET_SHOPS_FAILURE:
        case UPDATE_SHOP_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};