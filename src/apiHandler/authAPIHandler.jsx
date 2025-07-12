import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootAuth = `${API_URL}/api/Auth`;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${rootAuth}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${rootAuth}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
