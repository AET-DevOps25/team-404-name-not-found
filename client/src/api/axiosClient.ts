import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "/api", // TODO: Set this to your actual API base URL
    headers: {
        "Content-Type": "application/json",
    },
});

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
