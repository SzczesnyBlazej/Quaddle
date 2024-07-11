// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

axiosInstance.interceptors.request.use((config) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
