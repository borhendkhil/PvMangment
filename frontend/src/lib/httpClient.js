import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axios;
