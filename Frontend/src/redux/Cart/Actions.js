import { api } from "../../config/Api";
import { ADD_FOOD_TO_CART_FAILURE, ADD_FOOD_TO_CART_REQUEST, ADD_FOOD_TO_CART_SUCCESS, GET_CART_OF_USER_FAILURE, GET_CART_OF_USER_REQUEST, GET_CART_OF_USER_SUCCESS, REMOVE_ITEM_FROM_CART_FAILURE, REMOVE_ITEM_FROM_CART_REQUEST, REMOVE_ITEM_FROM_CART_SUCCESS } from "./ActionTypes";
import { toast } from "react-toastify";

export const addFoodToCart = (requestData) => async (dispatch) => {
    dispatch({ type: ADD_FOOD_TO_CART_REQUEST });
    try {
        const response = await api.put(
            "/api/cart/add/food",
            requestData,
        );
        toast.success("Food added to cart successfully!");
        dispatch({ type: ADD_FOOD_TO_CART_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);

        const errorMessage = error.response?.data?.message || "Failed to add food to cart.";
        dispatch({ type: ADD_FOOD_TO_CART_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const getCartByUser = () => async (dispatch) => {
    dispatch({ type: GET_CART_OF_USER_REQUEST });
    try {
        const response = await api.get("/api/cart");
        dispatch({ type: GET_CART_OF_USER_SUCCESS, payload: response.data });
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Failed to get cart.";
        dispatch({ type: GET_CART_OF_USER_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const removeItemFromCart = (itemId) => async (dispatch) => {
    dispatch({ type: REMOVE_ITEM_FROM_CART_REQUEST });

    try {
        const response = await api.delete(`/api/cart/${itemId}`);
        console.log(response);

        dispatch({ type: REMOVE_ITEM_FROM_CART_SUCCESS, payload: itemId });
        toast.success("Remove item successfully!");
    } catch (error) {
        console.error(error);

        const errorMessage = error.response?.data?.message || "Failed to remove item from cart.";
        dispatch({ type: REMOVE_ITEM_FROM_CART_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};