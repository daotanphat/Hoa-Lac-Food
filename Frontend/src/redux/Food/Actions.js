import { toast } from "react-toastify";
import { api } from '../../config/Api'; 
import { GET_ALL_FOOD_REQUEST, GET_ALL_FOOD_SUCCESS, GET_ALL_FOOD_FAILURE } from "./ActionTypes";

export const getTopFoods = () => async (dispatch) => {
    dispatch({ type: GET_ALL_FOOD_REQUEST });

    try {
        const response = await api.get("/odata/food?$top=20", { skipAuth: true });

        if (response.status === 200) {
            dispatch({ type: GET_ALL_FOOD_SUCCESS, payload: response.data });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to get food.";
        dispatch({ type: GET_ALL_FOOD_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const getAllFoods = () => async (dispatch) => {
    dispatch({ type: GET_ALL_FOOD_REQUEST });

    try {
        const response = await api.get("/odata/food", { skipAuth: true });

        if (response.status === 200) {
            dispatch({ type: GET_ALL_FOOD_SUCCESS, payload: response.data });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to get food.";
        dispatch({ type: GET_ALL_FOOD_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};