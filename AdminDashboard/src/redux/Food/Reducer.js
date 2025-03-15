import {
    GET_SHOP_FOOD_REQUEST,
    GET_SHOP_FOOD_SUCCESS,
    GET_SHOP_FOOD_FAILURE,
    UPDATE_FOOD_STATUS_REQUEST,
    UPDATE_FOOD_STATUS_FAILURE,
    UPDATE_FOOD_STATUS_SUCCESS,
    UPDATE_FOOD_REQUEST,
    UPDATE_FOOD_SUCCESS,
    UPDATE_FOOD_FAILURE,
    CREATE_FOOD_REQUEST,
    CREATE_FOOD_SUCCESS,
    CREATE_FOOD_FAILURE
} from "./ActionTypes";

const initialState = {
    shopFoods: [],
    loading: false,
    error: null
};

export const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SHOP_FOOD_REQUEST:
        case UPDATE_FOOD_STATUS_REQUEST:
        case UPDATE_FOOD_REQUEST:
        case CREATE_FOOD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_SHOP_FOOD_SUCCESS:
            return {
                ...state,
                loading: false,
                shopFoods: action.payload
            };
        case UPDATE_FOOD_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                shopFoods: state.shopFoods.map(food =>
                    food.id === action.payload.id ? action.payload : food
                )
            };
        case UPDATE_FOOD_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                shopFoods: state.shopFoods.map(food =>
                    food.id === action.payload.id ? action.payload : food
                )
            };
        case CREATE_FOOD_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                shopFoods: [...state.shopFoods, action.payload]
            };

        case UPDATE_FOOD_STATUS_FAILURE:
        case GET_SHOP_FOOD_FAILURE:
        case UPDATE_FOOD_FAILURE:
        case CREATE_FOOD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
