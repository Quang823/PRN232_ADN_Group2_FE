import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootPayment = `${API_URL}/api/Payment`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createPaymentLink = async (paymentData) => {
  try {
    const response = await axios.post(
      `${rootPayment}/create-link`,
      paymentData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPayment = async (orderCode) => {
  try {
    const response = await axios.post(
      `${rootPayment}/check-payment?orderCode=${orderCode}`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsOfUser = async (userId) => {
  try {
    const response = await axios.get(
      `${rootPayment}/payments-of-users/${userId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
