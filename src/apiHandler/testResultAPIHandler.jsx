import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootTestResult = `${API_URL}/api/TestResult`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postTestResult = async (data) => {
  try {
    const response = await axios.post(rootTestResult, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
