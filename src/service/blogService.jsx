import { getBlog, postBlog } from "../apiHandler/blogAPIHandler";

export const fetchBlogs = async () => {
  return await getBlog();
};

export const createBlog = async (blogData) => {
  return await postBlog(blogData);
};
