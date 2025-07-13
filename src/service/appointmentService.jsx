import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  getAppointmentsOfUser as getAppointmentsOfUserAPI,
  getFilteredAppointments,
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

export const fetchAppointmentsOfUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  try {
    return await getAppointmentsOfUserAPI(userId);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch booking history"
    );
  }
};

export const fetchFilteredAppointments = async ({ status, isHomeKit }) => {
  try {
    return await getFilteredAppointments({ status, isHomeKit });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch filtered appointments"
    );
  }
};
