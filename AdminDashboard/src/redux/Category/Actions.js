import { toast } from "react-toastify";
import { api } from '../../config/Api';
import { GET_ALL_CATEGORY_FAILURE, GET_ALL_CATEGORY_REQUEST, GET_ALL_CATEGORY_SUCCESS } from "./ActionTypes";

export const getAllCategory = () => async (dispatch) => {
    dispatch({ type: GET_ALL_CATEGORY_REQUEST });

    try {
        const response = await api.get("/api/category", { skipAuth: true });

        if (response.status === 200) {
            dispatch({ type: GET_ALL_CATEGORY_SUCCESS, payload: response.data });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to get categories.";
        dispatch({ type: GET_ALL_CATEGORY_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};