import { api } from "../../config/Api";
import { ADD_FOOD_TO_CART_FAILURE, ADD_FOOD_TO_CART_REQUEST, ADD_FOOD_TO_CART_SUCCESS, GET_CART_OF_USER_FAILURE, GET_CART_OF_USER_REQUEST, GET_CART_OF_USER_SUCCESS } from "./ActionTypes";
import { toast } from "react-toastify";

export const addFoodToCart = (requestData) => async (dispatch) => {
    dispatch({ type: ADD_FOOD_TO_CART_REQUEST });
    try {
        toast.success("Food added to cart successfully!");
        const response = await api.put(
            "/api/cart/add/food",
            requestData,
        );

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
        console.log(response.data);
        
        
        dispatch({ type: GET_CART_OF_USER_SUCCESS, payload: response.data });
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Failed to get cart.";
        dispatch({ type: GET_CART_OF_USER_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};