import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
);

export const authService = {
  async signup(name, email, password, program, yearLevel) {
    const response = await api.post('/auth/signup', {
      name, email, password, program, yearLevel: parseInt(yearLevel)
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};
