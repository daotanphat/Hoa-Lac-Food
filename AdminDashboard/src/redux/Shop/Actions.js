import { CREATE_SHOP_FAILURE, CREATE_SHOP_REQUEST, CREATE_SHOP_SUCCESS} from "./ActionTypes";
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