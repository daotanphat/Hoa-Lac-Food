import { GET_ALL_FOOD_REQUEST, GET_ALL_FOOD_SUCCESS, GET_ALL_FOOD_FAILURE } from "./ActionTypes";

const initialState = {
    foods: [],
    loading: false,
    error: null,
};

export const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_FOOD_REQUEST:
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
        case GET_ALL_FOOD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
