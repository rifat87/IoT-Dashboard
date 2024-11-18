import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData).then((response) => {
    localStorage.setItem('token', response.data.token);
  });
};

export default { register, login };
