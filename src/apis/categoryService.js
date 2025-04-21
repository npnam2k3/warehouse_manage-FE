import axiosClient from "./axiosClient";

export const getAll = async () => {
  return axiosClient.get("/category");
};

export const create = async (body) => {
  return await axiosClient.post("/category", body);
};

export const update = async (categoryId, body) => {
  return await axiosClient.patch(`/category/${categoryId}`, body);
};

export const deleteCategory = async (categoryId) => {
  return await axiosClient.delete(`/category/${categoryId}`);
};

export const getOne = async (categoryId) => {
  return await axiosClient.get(`/category/${categoryId}`);
};
