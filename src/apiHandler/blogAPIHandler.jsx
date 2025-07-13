import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const rootBlog = `${API_URL}/api/Blog`;

export const getBlog = async () => {
  const response = await axios.get(`${rootBlog}`);
  return response.data;
};

export const postBlog = async (blogData) => {
  const response = await axios.post(`${rootBlog}`, blogData);
  return response.data;
};
