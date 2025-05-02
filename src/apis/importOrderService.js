import axiosClient from "./axiosClient";
export const createImportOrder = async (body) => {
  return axiosClient.post("/import-order", body);
};

export const getAllImportOrder = async ({
  limit,
  page,
  search,
  payment_status,
  order_status,
}) => {
  let path = `/import-order?limit=${limit}&page=${page}`;
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

export const getOneImportOrder = async (id) => {
  return axiosClient.get(`/import-order/${id}`);
};

export const cancelImportOrder = async (body) => {
  return axiosClient.post("/import-order/cancel-import-order", body);
};

export const confirmImportOrder = async (id) => {
  return axiosClient.put(`/import-order/confirm-import-order/${id}`);
};
