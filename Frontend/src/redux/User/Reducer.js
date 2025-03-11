import { GET_USER_INFO_FAILURE, GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS } from "./ActionTypes"

const initialState = {
    userInfo: null,
    isLoading: false,
    error: null
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_INFO_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case GET_USER_INFO_SUCCESS:
            return {
                ...state,
                isLoading: false,
                userInfo: action.payload.data
            }
        case GET_USER_INFO_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state;
    }
}