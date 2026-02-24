import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => axios.post(`${API_URL}/register`, data);

export const loginUser = (data: {
  email: string;
  password: string;
}) => axios.post(`${API_URL}/login`, data);

export const getProfile = (token: string) =>
  axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
