import axiosClient from "./axiosClient";

export const adjustInventory = async (body) => {
  return axiosClient.post("/inventory-adjustment", body);
};

export const getAdjustmentInventoryLog = async ({ limit, page }) => {
  return axiosClient.get(`/inventory-adjustment?limit=${limit}&page=${page}`);
};
