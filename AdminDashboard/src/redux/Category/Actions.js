import { toast } from "react-toastify";
import { api } from '../../config/Api';
import {
    GET_ALL_CATEGORY_FAILURE,
    GET_ALL_CATEGORY_REQUEST,
    GET_ALL_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAILURE,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE
} from "./ActionTypes";

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

export const updateCategory = (id, requestData) => async (dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });

    try {
        const response = await api.put(`/api/category/${id}/update`, requestData);

        if (response.status === 200) {
            dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: response.data });
            dispatch(getAllCategory());
            toast.success("Category updated successfully!");
            return true;
        }
    } catch (error) {
        let errorMessage = "Failed to update category.";

        // Handle validation errors
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            errorMessage = Object.values(validationErrors)[0]?.[0] || errorMessage;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
        return false;
    }
};

export const createCategory = (name) => async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    try {
        const response = await api.post('/api/category', { name });

        if (response.status === 200) {
            dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
            dispatch(getAllCategory());
            toast.success("Category created successfully!");
        }
    } catch (error) {
        let errorMessage = "Failed to create category.";

        // Handle validation errors
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            errorMessage = Object.values(validationErrors)[0]?.[0] || errorMessage;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        dispatch({ type: CREATE_CATEGORY_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const deleteCategory = (id) => async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });

    try {
        const response = await api.delete(`/api/category/${id}`);

        if (response.status === 200) {
            dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: response.data });
            dispatch(getAllCategory());
            toast.success("Category deleted successfully!");
        }
    } catch (error) {
        let errorMessage = "Failed to delete category.";

        if (error.response?.status === 400) {
            errorMessage = "This category cannot be deleted!";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        dispatch({ type: DELETE_CATEGORY_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};