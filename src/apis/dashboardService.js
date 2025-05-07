import axiosClient from "./axiosClient";

export const getBaseInfo = async () => {
  return axiosClient.get("/dashboard/base-info");
};
export const getListProductsHaveLowInventory = async () => {
  return axiosClient.get("/dashboard/products-have-low-inventory");
};
export const getOrdersRecent = async () => {
  return axiosClient.get("/dashboard/orders-recent");
};
