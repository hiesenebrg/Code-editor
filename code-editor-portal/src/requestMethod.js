// requestMethods.js
import axios from 'axios';

export const SOCKET_BASE_URL = 'https://code-editor-5vm5.onrender.com';
export const BASE_URL = 'https://code-editor-5vm5.onrender.com/api';
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
