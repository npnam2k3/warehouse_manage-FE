import axiosClient from "./axiosClient";
export const createExportOrder = async (body) => {
  return axiosClient.post("/export-order", body);
};

export const getAllExportOrder = async ({
  limit,
  page,
  search,
  payment_status,
  order_status,
}) => {
  let path = `/export-order?limit=${limit}&page=${page}`;
  if (search) {
    path += `&search=${search}`;
  }
  if (payment_status) {
    path += `&payment_status=${payment_status}`;
  }
  if (order_status) {
    path += `&order_status=${order_status}`;
  }
  return axiosClient.get(path);
};

export const getOneExportOrder = async (id) => {
  return axiosClient.get(`/export-order/${id}`);
};

export const cancelExportOrder = async (body) => {
  return axiosClient.post("/export-order/cancel-export-order", body);
};

export const confirmExportOrder = async (id) => {
  return axiosClient.put(`/export-order/confirm-export-order/${id}`);
};

export const getHistorySellOfProduct = ({ limit, page, productId }) => {
  return axiosClient.get(
    `/export-order/historySellOfProduct/${productId}?limit=${limit}&page=${page}`
  );
};
