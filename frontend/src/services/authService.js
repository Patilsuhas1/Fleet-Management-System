import api from '../api/axiosConfig';

const AuthService = {
    login: async (username, password) => {
        const response = await api.post('/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getHeader: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return { Authorization: 'Bearer ' + user.token };
        } else {
            return {};
        }
    }
};

export default AuthService;
