import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootAppointment = `${API_URL}/api/Appointment`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllAppointments = async () => {
  try {
    const response = await axios.get(rootAppointment, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`${rootAppointment}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(rootAppointment, appointmentData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentsOfUser = async (userId) => {
  try {
    const response = await axios.get(`${rootAppointment}/appointment-of-user`, {
      params: { userId },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFilteredAppointments = async ({ status, isHomeKit }) => {
  try {
    const params = {};
    if (status !== undefined && status !== null) params.status = status;
    if (isHomeKit !== undefined && isHomeKit !== null)
      params.isHomeKit = isHomeKit;
    const response = await axios.get(rootAppointment, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
