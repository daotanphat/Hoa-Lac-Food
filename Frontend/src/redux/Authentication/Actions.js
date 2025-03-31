import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes";
import { api } from '../../config/Api';
import { toast } from "react-toastify";
import { getUserInfo } from "../User/Actions";

// Validation functions
const validateUsername = (username) => {
    // Check length between 3 and 50 characters
    if (username.length < 3 || username.length > 50) {
        return 'Username must be between 3 and 50 characters';
    }
    
    // Check for special characters (only allowing letters, numbers, and underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username cannot contain special characters (only letters, numbers, and underscore)';
    }
    
    return null; // No error
};

const validateEmail = (email) => {
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    return null; // No error
};

const validatePassword = (password) => {
    // Minimum 8 characters
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    
    // Require digit
    if (!/\d/.test(password)) {
        return 'Password must contain at least one digit';
    }
    
    // Require lowercase
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    
    // Require uppercase
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    
    // Require non-alphanumeric
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    
    return null; // No error
};

export const register = (userData, navigate, setCurrState) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    
    // Client-side validation
    const usernameError = validateUsername(userData.userName);
    const emailError = validateEmail(userData.email);
    const passwordError = validatePassword(userData.password);
    
    // If there are any validation errors, don't call the API
    if (usernameError || emailError || passwordError) {
        const errorMessage = usernameError || emailError || passwordError;
        toast.error(errorMessage);
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
        return;
    }
    
    // Create request payload with 'Customer' as default role
    const requestData = {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        role: 'Customer' // Default role for users registering through the frontend
    };
    
    try {
        const response = await api.post('/api/Auth/register', requestData, { skipAuth: true });
        
        if (response.status === 200) {
            dispatch({ type: REGISTER_SUCCESS, payload: response.data });
            toast.success(response.data.message || 'Registration successful! Please login.');
            
            // Reset form and switch to login page after a short delay
            setTimeout(() => {
                setCurrState('Login');
            }, 2000);
        }
    } catch (error) {
        let errorMessage = 'Registration failed. Please try again.';
        
        // Handle different types of error responses
        if (error.response) {
            // Handle array of error objects with code and description
            if (Array.isArray(error.response.data)) {
                const errorData = error.response.data;
                // Check for duplicate username or email errors
                const duplicateErrors = errorData.filter(err => 
                    err.code === 'DuplicateUserName' || err.code === 'DuplicateEmail'
                );
                
                if (duplicateErrors.length > 0) {
                    // Display all duplicate errors
                    duplicateErrors.forEach(err => {
                        toast.error(err.description);
                    });
                    errorMessage = duplicateErrors.map(err => err.description).join(', ');
                }
            } 
            // Handle string error message
            else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } 
            // Handle response with message property
            else if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } 
            // Handle validation errors from server
            else if (error.response.data && error.response.data.errors) {
                const serverErrors = Object.values(error.response.data.errors).flat();
                if (serverErrors.length > 0) {
                    errorMessage = serverErrors[0];
                }
            }
        }
        
        if (errorMessage === 'Registration failed. Please try again.') {
            toast.error(errorMessage);
        }
        
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    }
};

export const login = (requestData, navigate, setShowLogin) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const response = await api.post('/api/Auth/login', requestData, { skipAuth: true });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.data.token);
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });

            // Fetch user info after successful login
            dispatch(getUserInfo());

            toast.success(response.data.message || 'Login successfully!');

            // Increased timeout to allow toast to display
            setTimeout(() => {
                navigate('/');
                setShowLogin(false);
            }, 2000);
        }
    } catch (error) {
        const errorMessage = error.response?.data || 'Login failed. Please try again.';
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
}

export const logout = (navigate) => (dispatch) => {
    try {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        dispatch({ type: LOGOUT_SUCCESS, payload: { message: "Logout successful" } });
        // Added timeout to allow toast to display
        setTimeout(() => {
            navigate('/');
        }, 2000);
    } catch (error) {
        dispatch({ type: LOGOUT_FAILURE, payload: "Logout failed" });
    }
};