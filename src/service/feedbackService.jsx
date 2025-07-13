import { postFeedback } from "../apiHandler/feedbackAPIHandler";
import { getFeedbacksByServiceId } from "../apiHandler/feedbackAPIHandler";
import { getUserProfile } from "./authService";

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

export const fetchFeedbacksByServiceId = async (serviceId) => {
  if (!serviceId) throw new Error("Service ID is required");
  try {
    const feedbacks = await getFeedbacksByServiceId(serviceId);
    // Lấy thông tin user cho từng feedback
    const enriched = await Promise.all(
      feedbacks.map(async (fb) => {
        let user = {};
        try {
          user = await getUserProfile(fb.userId);
        } catch {}
        return {
          ...fb,
          fullName: user.fullName || "Unknown",
          avatarUrl: user.avatarUrl || undefined,
        };
      })
    );
    return enriched;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch feedbacks by serviceId"
    );
  }
};
