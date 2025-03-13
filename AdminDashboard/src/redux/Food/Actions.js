import { toast } from "react-toastify";
import { api } from '../../config/Api';
import {
    GET_SHOP_FOOD_REQUEST,
    GET_SHOP_FOOD_SUCCESS,
    GET_SHOP_FOOD_FAILURE,
    UPDATE_FOOD_STATUS_REQUEST,
    UPDATE_FOOD_STATUS_SUCCESS,
    UPDATE_FOOD_STATUS_FAILURE
} from "./ActionTypes";

export const getShopFood = (shopId) => async (dispatch) => {
    dispatch({ type: GET_SHOP_FOOD_REQUEST });

    try {
        const response = await api.get(`/odata/Food/GetByShop(shopId=${shopId})`);

        dispatch({ type: GET_SHOP_FOOD_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to get shop's food items.";
        dispatch({ type: GET_SHOP_FOOD_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const updateFoodStatus = (foodId) => async (dispatch) => {
    dispatch({ type: UPDATE_FOOD_STATUS_REQUEST });

    try {
        const response = await api.put(`api/Food/${foodId}/update-status`);
        toast.success("Food status updated successfully.");
        
        dispatch({ type: UPDATE_FOOD_STATUS_SUCCESS, payload: response.data.data });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update food status.";
        dispatch({ type: UPDATE_FOOD_STATUS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};