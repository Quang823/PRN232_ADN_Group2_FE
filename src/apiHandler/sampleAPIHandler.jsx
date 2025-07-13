import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootSample = `${API_URL}/api/Sample`;

export const getSamplesByAppointmentId = async (appoinmentId) => {
  try {
    const response = await axios.get(`${rootSample}/by-appointment`, {
      params: { appoinmentId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const collectSamples = async ({ appointmentId, sampleIds }) => {
  try {
    const response = await axios.post(
      `${rootSample}/collect`,
      { appointmentId, sampleIds },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
