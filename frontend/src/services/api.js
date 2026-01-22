import axios from './axiosConfig';

const API_BASE = '/api/v1';

const ApiService = {
    // Location Services
    getAllStates: async () => {
        const response = await axios.get('/State');
        return response.data;
    },

    getCitiesByState: async (stateId) => {
        const response = await axios.get(`/city/${stateId}`);
        return response.data;
    },

    getHubs: async (stateName, cityName) => {
        const response = await axios.get(`${API_BASE}/hub`, {
            params: { stateName, cityName }
        });
        return response.data;
    },

    // Car Services
    getAvailableCars: async (hubId, startDate, endDate) => {
        const response = await axios.get(`${API_BASE}/cars/available`, {
            params: { hubId, startDate, endDate }
        });
        return response.data;
    },

    getAddOns: async () => {
        const response = await axios.get(`${API_BASE}/addons`);
        return response.data;
    },

    getCarTypes: async () => {
        const response = await axios.get(`${API_BASE}/car-types`);
        return response.data;
    },

    // Booking Services
    createBooking: async (bookingRequest) => {
        const response = await axios.post('/booking/create', bookingRequest);
        return response.data;
    },

    handoverCar: async (bookingId) => {
        const response = await axios.post(`/booking/handover/${bookingId}`);
        return response.data;
    },

    getBooking: async (bookingId) => {
        const response = await axios.get(`/booking/${bookingId}`);
        return response.data;
    },

    processHandover: async (handoverRequest) => {
        const response = await axios.post('/booking/process-handover', handoverRequest);
        return response.data;
    },

    returnCar: async (returnRequest) => {
        const response = await axios.post('/booking/return', returnRequest);
        return response.data;
    },

    // Admin Services
    uploadRates: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('/api/admin/upload-rates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Customer Services
    findCustomer: async (email) => {
        const response = await axios.get(`/find?email=${email}`);
        return response.data;
    },

    saveCustomer: async (customerData) => {
        const response = await axios.post('/customer/save-or-update', customerData);
        return response.data;
    }
};

export default ApiService;
