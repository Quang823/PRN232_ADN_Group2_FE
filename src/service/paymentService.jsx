import {
  createPaymentLink,
  checkPayment as checkPaymentAPI,
  getPaymentsOfUser as getPaymentsOfUserAPI,
} from "../apiHandler/paymentAPIHandler";

export const addPayment = async (paymentData) => {
  const requiredFields = ["appointmentId", "price"];
  const missingFields = requiredFields.filter(
    (field) => paymentData[field] === undefined || paymentData[field] === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  try {
    return await createPaymentLink(paymentData);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create payment link"
    );
  }
};

export const checkPayment = async (orderCode) => {
  try {
    return await checkPaymentAPI(orderCode);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to check payment status"
    );
  }
};

export const fetchPaymentsOfUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  try {
    return await getPaymentsOfUserAPI(userId);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch payment history"
    );
  }
};
