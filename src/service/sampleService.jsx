import { getSamplesByAppointmentId } from "../apiHandler/sampleAPIHandler";

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
