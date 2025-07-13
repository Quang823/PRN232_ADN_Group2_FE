import { getSamplesByAppointmentId } from "../apiHandler/sampleAPIHandler";
import { collectSamples } from "../apiHandler/sampleAPIHandler";

export const fetchSamplesByAppointmentId = async (appointmentId) => {
  if (!appointmentId) throw new Error("Appointment ID is required");
  try {
    return await getSamplesByAppointmentId(appointmentId);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch samples by appointmentId"
    );
  }
};

export const collectSamplesService = async ({ appointmentId, sampleIds }) => {
  if (!appointmentId || !Array.isArray(sampleIds) || sampleIds.length === 0) {
    throw new Error("Appointment ID and at least one sampleId are required");
  }
  try {
    return await collectSamples({ appointmentId, sampleIds });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to collect samples"
    );
  }
};
