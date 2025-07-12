import axios from "axios";

const API_URL = "/api/Blog";

export const getBlog = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const postBlog = async (blogData) => {
  const response = await axios.post(API_URL, blogData);
  return response.data;
};
