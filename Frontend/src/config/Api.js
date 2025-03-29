import axios from "axios";
import { toast } from "react-toastify";

export const API_URL = "http://localhost:5168";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("Please log in to perform this action");
            localStorage.removeItem("token"); // Remove invalid token
            // Add delay before redirect to allow toast to display
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        }
        return Promise.reject(error);
    }
);