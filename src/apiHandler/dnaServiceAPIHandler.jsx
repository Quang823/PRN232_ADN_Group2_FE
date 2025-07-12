import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootService = `${API_URL}/api/Service`;

export const getAllServices = async () => {
  try {
    const response = await axios.get(rootService);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${rootService}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(rootService, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${rootService}/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${rootService}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
