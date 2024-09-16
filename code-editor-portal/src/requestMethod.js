// requestMethods.js
import axios from 'axios';

export const SOCKET_BASE_URL = 'http://localhost:8000';
export const BASE_URL = 'http://localhost:8000/api';
const TOKEN = 'adbc';

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = (TOKEN) => {
  console.log('Axios request initialized');
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};
