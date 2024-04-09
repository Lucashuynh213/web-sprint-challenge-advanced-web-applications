// ✨ implement axiosWithAuth
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/api',
  timeout: 5000, // 5 seconds
});

// Function to add authorization header
export const axiosWithAuth = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default instance;