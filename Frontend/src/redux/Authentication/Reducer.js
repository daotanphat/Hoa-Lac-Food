import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes"

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    message: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                message: action.payload.message
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.data.email,
                isLoading: false,
                jwt: action.payload.data.token,
                message: action.payload.message
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: null,
                jwt: null,
                message: action.payload.message
            }
        case LOGOUT_FAILURE:
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                message: null
            }
        default:
            return state;
    }
}