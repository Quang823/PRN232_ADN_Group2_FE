import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootAuth = `${API_URL}/api/Auth`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const getUserProfile = async (userId = null) => {
  try {
    const response = await axios.get(
      `${rootAuth}/user-profile${userId ? `?userId=${userId}` : ""}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
