import { postFeedback } from "../apiHandler/feedbackAPIHandler";

export const addFeedback = async (feedbackData) => {
  const requiredFields = ["userId", "comment", "rating", "appointmentId"];
  const missingFields = requiredFields.filter(
    (field) => feedbackData[field] === undefined || feedbackData[field] === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  try {
    return await postFeedback(feedbackData);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit feedback"
    );
  }
};
