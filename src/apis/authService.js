import axiosClient from "./axiosClient";

export const login = async (body) => {
  const res = await axiosClient.post("/auth/login", body);
  return res;
};

export const getProfile = async () => {
  return await axiosClient.get("/auth/profile");
};

export const logout = async () => {
  return await axiosClient.post("/auth/logout");
};

export const changePassword = async (body) => {
  return await axiosClient.post("/auth/changePassword", body);
};
export const forgotPassword = async (body) => {
  return await axiosClient.post("/auth/forgotPassword", body);
};
export const resetPassword = async (body, token) => {
  return await axiosClient.put(`/auth/resetPassword/${token}`, body);
};
