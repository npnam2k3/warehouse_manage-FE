import axiosClient from "./axiosClient";
export const getUsers = async ({ page, limit, search }) => {
  if (search) {
    return await axiosClient.get(
      `/users?page=${page}&limit=${limit}&search=${search}`
    );
  }
  return await axiosClient.get(`/users?page=${page}&limit=${limit}`);
};

export const createUser = async (body) => {
  return await axiosClient.post("/users", body);
};

export const lockUser = async (id) => {
  return await axiosClient.patch(`/users/block/${id}`);
};
export const unlockUser = async (id) => {
  return await axiosClient.patch(`/users/unBlock/${id}`);
};
export const deleteUser = async (id) => {
  return await axiosClient.delete(`/users/${id}`);
};

export const updateUser = async (userId, body) => {
  return await axiosClient.patch(`/users/${userId}`, body);
};
