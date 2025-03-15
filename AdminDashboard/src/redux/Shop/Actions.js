import { CREATE_SHOP_FAILURE, CREATE_SHOP_REQUEST, CREATE_SHOP_SUCCESS, GET_SHOP_BY_ID_FAILURE, GET_SHOP_BY_ID_REQUEST, GET_SHOP_BY_ID_SUCCESS, UPDATE_SHOP_FAILURE, UPDATE_SHOP_REQUEST, UPDATE_SHOP_STATEMENT_FAILURE, UPDATE_SHOP_STATEMENT_REQUEST, UPDATE_SHOP_STATEMENT_SUCCESS, UPDATE_SHOP_SUCCESS } from "./ActionTypes";
import { api } from "../../config/Api";
import { toast } from "react-toastify";

export const createShop = (formData, navigate) => async (dispatch) => {
    dispatch({ type: CREATE_SHOP_REQUEST });
    try {
        const response = await api.post("/api/Shop", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response.status === 200) {
            dispatch({ type: CREATE_SHOP_SUCCESS, payload: response.data });
            toast.success("Shop created successfully!");
            navigate("/");
        }
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to create shop";
        toast.error(errorMessage);
        dispatch({ type: CREATE_SHOP_FAILURE, payload: errorMessage });
    }
};

export const getShopById = (shopId) => async (dispatch) => {
    dispatch({ type: GET_SHOP_BY_ID_REQUEST });
    try {
        const response = await api.get(`/api/shop/${shopId}`);
        dispatch({ type: GET_SHOP_BY_ID_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to create shop";
        toast.error(errorMessage);
        dispatch({ type: GET_SHOP_BY_ID_FAILURE, payload: errorMessage });
    }
};

export const updateShop = (formData) => async (dispatch) => {
    dispatch({ type: UPDATE_SHOP_REQUEST });
    try {
        const response = await api.put(`/api/shop`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        dispatch({ type: UPDATE_SHOP_SUCCESS, payload: response.data });
        toast.success("Shop updated successfully!");
    } catch (error) {
        console.log(error);

        const errorMessage = error.response?.data || "Failed to update shop";
        toast.error(errorMessage);
        dispatch({ type: UPDATE_SHOP_FAILURE, payload: errorMessage });
    }
};

export const updateShopStatement = (shopName) => async (dispatch) => {
    dispatch({ type: UPDATE_SHOP_STATEMENT_REQUEST });
    try {
        const response = await api.put(`/api/shop/${shopName}/update-statement`);
        console.log(response.data);

        dispatch({ type: UPDATE_SHOP_STATEMENT_SUCCESS, payload: response.data });
        toast.success("Shop updated status successfully!");
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to update shop status";
        toast.error(errorMessage);
        dispatch({ type: UPDATE_SHOP_STATEMENT_FAILURE, payload: errorMessage });
    }
};