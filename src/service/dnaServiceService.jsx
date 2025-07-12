import {
  getAllServices,
  getServiceById,
  createService,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
} from "../apiHandler/dnaServiceAPIHandler";

export const fetchAllServices = async () => {
  try {
    return await getAllServices();
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch services"
    );
  }
};

export const fetchServiceById = async (id) => {
  if (!id) throw new Error("Service ID is required");
  try {
    return await getServiceById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch service");
  }
};

export const addService = async (serviceData) => {
  const requiredFields = [
    "name",
    "description",
    "allowHomeKit",
    "price",
    "type",
  ];
  const missingFields = requiredFields.filter(
    (field) => serviceData[field] === undefined || serviceData[field] === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  try {
    return await createService(serviceData);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create service"
    );
  }
};

export const updateService = async (id, serviceData) => {
  if (!id) throw new Error("Service ID is required");
  const requiredFields = [
    "name",
    "description",
    "allowHomeKit",
    "price",
    "type",
  ];
  const missingFields = requiredFields.filter(
    (field) => serviceData[field] === undefined || serviceData[field] === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  try {
    return await apiUpdateService(id, serviceData);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update service"
    );
  }
};

export const deleteService = async (id) => {
  if (!id) throw new Error("Service ID is required");
  try {
    return await apiDeleteService(id);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete service"
    );
  }
};
