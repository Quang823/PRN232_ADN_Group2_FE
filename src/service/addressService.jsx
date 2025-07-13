import {
  getAddressesOfUser as getAddressesOfUserAPI,
  addAddress as addAddressAPI,
  deleteAddress as apiDeleteAddress,
  updateAddress as apiUpdateAddress,
} from "../apiHandler/addressAPIHandler";

export const fetchAddressesOfUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  try {
    return await getAddressesOfUserAPI(userId);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch addresses"
    );
  }
};

export const createAddress = async (addressData) => {
  if (!addressData || !addressData.userId)
    throw new Error("Address data and userId are required");
  try {
    return await addAddressAPI(addressData);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add address");
  }
};

export const deleteAddress = async (id) => {
  return apiDeleteAddress(id);
};

export const updateAddress = async (id, addressData) => {
  return apiUpdateAddress(id, addressData);
};
