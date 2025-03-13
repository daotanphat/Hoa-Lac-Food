import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes"

const initialState = {
    user: null,
    email: null,
    jwt: null,
    message: null,
    isLoading: false,
    error: null
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
                user: action.payload.data.userName,
                email: action.payload.data.email,
                jwt: action.payload.data.token,
                message: action.payload.message,
                isLoading: false,
                error: null
            }
        case LOGOUT_SUCCESS:
            return initialState;
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