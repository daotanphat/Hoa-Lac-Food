import {
    GET_ALL_FOOD_REQUEST,
    GET_ALL_FOOD_SUCCESS,
    GET_ALL_FOOD_FAILURE,
    GET_SHOP_FOOD_REQUEST,
    GET_SHOP_FOOD_SUCCESS,
    GET_SHOP_FOOD_FAILURE
} from "./ActionTypes";

const initialState = {
    foods: [],
    shopFoods: [],
    loading: false,
    error: null
};

export const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_FOOD_REQUEST:
        case GET_SHOP_FOOD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_ALL_FOOD_SUCCESS:
            return {
                ...state,
                loading: false,
                foods: action.payload
            };
        case GET_SHOP_FOOD_SUCCESS:
            return {
                ...state,
                loading: false,
                shopFoods: action.payload
            };

        case GET_ALL_FOOD_FAILURE:
        case GET_SHOP_FOOD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
