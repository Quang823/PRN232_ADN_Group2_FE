import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
} from "../apiHandler/appointmentAPIHandler";

export const fetchAllAppointments = async () => {
  try {
    return await getAllAppointments();
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch appointments"
    );
  }
};

export const fetchAppointmentById = async (id) => {
  if (!id) throw new Error("Appointment ID is required");
  try {
    return await getAppointmentById(id);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch appointment"
    );
  }
};

export const addAppointment = async (appointmentData) => {
  const requiredFields = ["serviceId", "scheduleDate"];
  const missingFields = requiredFields.filter(
    (field) =>
      appointmentData[field] === undefined || appointmentData[field] === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  try {
    return await createAppointment(appointmentData);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create appointment"
    );
  }
};
