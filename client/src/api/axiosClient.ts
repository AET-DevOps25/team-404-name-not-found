import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

console.log("Axios client created with base URL:", axiosClient.defaults.baseURL);

// Add request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            // Token invalid or expired
            localStorage.removeItem('token');
            window.location.href = '/'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
