import { CREATE_SHOP_FAILURE, CREATE_SHOP_REQUEST, CREATE_SHOP_SUCCESS, GET_SHOP_BY_ID_FAILURE, GET_SHOP_BY_ID_REQUEST, GET_SHOP_BY_ID_SUCCESS, UPDATE_SHOP_FAILURE, UPDATE_SHOP_REQUEST, UPDATE_SHOP_STATEMENT_FAILURE, UPDATE_SHOP_STATEMENT_REQUEST, UPDATE_SHOP_STATEMENT_SUCCESS, UPDATE_SHOP_SUCCESS, GET_SHOPS_REQUEST, GET_SHOPS_SUCCESS, GET_SHOPS_FAILURE, UPDATE_SHOP_STATUS_REQUEST, UPDATE_SHOP_STATUS_SUCCESS, UPDATE_SHOP_STATUS_FAILURE } from "./ActionTypes";
import { api } from "../../config/Api";
import { toast } from "react-toastify";
import { getUserInfo } from "../User/Actions";

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
            await dispatch(getUserInfo());
            toast.success("Shop created successfully!");
            navigate("/");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.title || error.response?.data?.message || "Failed to create shop";
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

export const getShops = () => async (dispatch) => {
    dispatch({ type: GET_SHOPS_REQUEST });
    try {
        const response = await api.get("/odata/shop");
        dispatch({ type: GET_SHOPS_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch shops.";
        dispatch({ type: GET_SHOPS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const updateShopStatus = (shopId) => async (dispatch) => {
    dispatch({ type: UPDATE_SHOP_STATUS_REQUEST });

    try {
        const response = await api.put(`/api/shop/${shopId}/update-status`);

        if (response.status === 200) {
            dispatch({ type: UPDATE_SHOP_STATUS_SUCCESS, payload: response.data });
            dispatch(getShops());
            toast.success("Shop status updated successfully!");
        }
    } catch (error) {
        let errorMessage = "Failed to update shop status.";

        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        dispatch({ type: UPDATE_SHOP_STATUS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};