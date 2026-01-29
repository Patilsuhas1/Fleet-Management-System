import axios from 'axios';

const API_URL = 'http://localhost:9001/';

const AuthService = {
    login: async (username, password) => {
        const response = await axios.post(API_URL + 'login', { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    googleLogin: async (token) => {
        const response = await axios.post(API_URL + 'api/v1/auth/google', { token });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (userData) => {
        return axios.post(API_URL + 'register', userData);
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;
