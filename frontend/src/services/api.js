import axios from 'axios';

const API = axios.create({
  baseURL: 'https://homebuddy-7ybp.onrender.com/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const serviceAPI = {
  getAll: () => API.get('/services'),
  getById: (id) => API.get(`/services/${id}`)
};

export const providerAPI = {
  getAll: () => API.get('/providers'),
  getByService: (serviceId) => API.get(`/providers/service/${serviceId}`),
  getById: (id) => API.get(`/providers/${id}`),
  getMyProfile: () => API.get('/providers/profile'),
  create: (data) => API.post('/providers', data),
  update: (data) => API.put('/providers/profile', data)
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getProviderBookings: () => API.get('/bookings/provider-bookings'),
  updateStatus: (id, status) => API.patch(`/bookings/${id}/status`, { status })
};

export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getProviderReviews: (providerId) => API.get(`/reviews/provider/${providerId}`),
  getMyReviews: () => API.get('/reviews/my-reviews')
};

export default API;
