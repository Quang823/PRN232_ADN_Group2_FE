import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootTestPerson = `${API_URL}/api/TestPerson`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addTestPersons = async (testPersons) => {
  try {
    const response = await axios.post(rootTestPerson, testPersons, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTestPersonById = async (id) => {
  try {
    const response = await axios.get(`${rootTestPerson}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
