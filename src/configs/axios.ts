// ** Third Party Imports
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.BASE_URL;
const headers = {
  Accept: 'application/json',
};

const instance = axios.create({
  baseURL: baseURL,
  headers: headers,
});

instance.interceptors.request.use(
  async config => {
    const authToken = await AsyncStorage.getItem('token');

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
