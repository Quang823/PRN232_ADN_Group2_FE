import { uploadToCloudinaryAPIHandler } from "../apiHandler/uploadImageToCloudinaryAPIHandler";

const UPLOAD_PRESET = "inter-trans-connect";
const FOLDER_NAME = "storesource";

export const uploadToCloudinaryService = async (file) => {
  if (!file) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", FOLDER_NAME);

  try {
    const data = await uploadToCloudinaryAPIHandler(formData);
    return data?.secure_url || null;
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    return null;
  }
};
