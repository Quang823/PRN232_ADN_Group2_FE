import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootFeedback = `${API_URL}/api/Feedback`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(rootFeedback, feedbackData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeedbacksByServiceId = async (serviceId) => {
  try {
    const response = await axios.get(`${rootFeedback}/service/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
