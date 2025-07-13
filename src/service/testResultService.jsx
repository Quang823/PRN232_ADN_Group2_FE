import { postTestResult } from "../apiHandler/testResultAPIHandler";

export const submitTestResult = async ({
  appointmentId,
  resultDate,
  description,
}) => {
  if (!appointmentId || !resultDate || !description)
    throw new Error("Missing required fields");
  try {
    return await postTestResult({ appointmentId, resultDate, description });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit test result"
    );
  }
};
