import axios from "axios";

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
            localStorage.removeItem("token"); // Remove invalid token
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);