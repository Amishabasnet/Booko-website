import apiClient from "@/app/utils/apiClient";

const AUTH_URL = "/auth";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => apiClient.post(`${AUTH_URL}/register`, data);

export const loginUser = (data: {
  email: string;
  password: string;
}) => apiClient.post(`${AUTH_URL}/login`, data);

export const getProfile = () =>
  apiClient.get(`${AUTH_URL}/profile`);
