import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000/api'
});

// Interceptor to automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle 401 responses globally
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/auth/login';
    }
    return Promise.reject(error);
});

export default api;
