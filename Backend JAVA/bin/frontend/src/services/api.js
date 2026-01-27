import axios from 'axios';

const API_URL = 'http://localhost:9001';

const instance = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to append the token if present
instance.interceptors.request.use(
    config => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    error => Promise.reject(error)
);

const ApiService = {
    // Hubs
    getHubs: (stateName, cityName) => instance.get(`/api/v1/hub?stateName=${stateName}&cityName=${cityName}`).then(res => res.data),
    searchLocations: (query) => instance.get(`/api/v1/locations/search?query=${query}`).then(res => res.data),

    // States & Cities
    getAllStates: () => instance.get('/State').then(res => res.data),
    getCitiesByState: (stateId) => instance.get(`/city/${stateId}`).then(res => res.data),

    // Cars
    getAvailableCars: (hubId, startDate, endDate) => instance.get(`/api/v1/cars/available?hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`).then(res => res.data),
    uploadCars: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return instance.post('/api/v1/cars/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Add-ons
    getAddOns: () => instance.get('/api/v1/addons').then(res => res.data),

    // Bookings
    createBooking: (bookingRequest) => instance.post('/booking/create', bookingRequest).then(res => res.data),
    getBooking: (id) => instance.get(`/booking/${id}`).then(res => res.data),
    processHandover: (request) => instance.post('/booking/process-handover', request).then(res => res.data),
    returnCar: (request) => instance.post('/booking/return', request).then(res => res.data),

    // Customer
    findCustomer: (email) => instance.get(`/find?email=${email}`).then(res => res.data),
    saveCustomer: (customer) => instance.post('/customer/save-or-update', customer).then(res => ({ success: true, data: res.data })),

    // Vendors
    getAllVendors: () => instance.get('/api/v1/vendors').then(res => res.data),
    addVendor: (vendor) => instance.post('/api/v1/vendors', vendor).then(res => res.data),
    testVendorConnection: (id) => instance.post(`/api/v1/vendors/${id}/test-connection`).then(res => res.data),

    // Admin Rates
    uploadRates: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return instance.post('/api/v1/rates/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default ApiService;
