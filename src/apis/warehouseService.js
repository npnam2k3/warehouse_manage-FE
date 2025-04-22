import axiosClient from "./axiosClient";

export const getAll = async () => {
  return axiosClient.get("/warehouse");
};
export const create = async (body) => {
  return axiosClient.post("/warehouse", body);
};

export const updateWarehouse = async (warehouseId, body) => {
  return axiosClient.patch(`/warehouse/${warehouseId}`, body);
};

export const deleteWarehouse = async (warehouseId) => {
  return axiosClient.delete(`/warehouse/${warehouseId}`);
};
