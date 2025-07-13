import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootAddress = `${API_URL}/api/Address`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAddressesOfUser = async (userId) => {
  try {
    const response = await axios.get(rootAddress, {
      params: { userId },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await axios.post(rootAddress, addressData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await axios.delete(`${rootAddress}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (id, addressData) => {
  try {
    const response = await axios.put(`${rootAddress}/${id}`, addressData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
