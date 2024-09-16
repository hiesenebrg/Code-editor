// src/axiosSetup.js
import axios from 'axios';

export const setupAxiosInterceptors = (setLoading) => {
    // Attach interceptors globally
    axios.interceptors.request.use(
        (config) => {
            console.log('Global Axios request initialized');
            setLoading(true);  // Start loader
            return config;
        },
        (error) => {
            setLoading(false);  // Stop loader on error
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            console.log('Global Axios request completed');
            setLoading(false);  // Stop loader
            return response;
        },
        (error) => {
            setLoading(false);  // Stop loader on error
            return Promise.reject(error);
        }
    );
};
