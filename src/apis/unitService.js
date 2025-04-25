import axiosClient from "./axiosClient";

export const createUnit = async (body) => {
  return axiosClient.post("/unit", body);
};

export const getAllUnit = async () => {
  return axiosClient.get("/unit");
};

export const deleteUnit = async (unitId) => {
  return axiosClient.delete(`/unit/${unitId}`);
};
