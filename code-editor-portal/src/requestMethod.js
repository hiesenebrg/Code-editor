import axios from "axios";
export const SOCKET_BASE_URL = "http://localhost:8000";
export const BASE_URL = "http://localhost:8000/api";
const TOKEN = 'adbc'
console.log("toke_Token ", TOKEN);
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = (TOKEN) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};