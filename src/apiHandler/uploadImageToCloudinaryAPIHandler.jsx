const CLOUD_NAME = "dk3yac2ie";

export const uploadToCloudinaryAPIHandler = async (formData) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload thất bại! ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi API Cloudinary:", error.message);
    return null;
  }
};
