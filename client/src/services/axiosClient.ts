import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.API_BASE_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token if available
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
