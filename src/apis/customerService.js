import axiosClient from "./axiosClient";

export const getAllCustomer = async ({ limit, page, search, isDebt }) => {
  let path = `/customers?limit=${limit}&page=${page}`;
  if (search) {
    path += `&search=${search}`;
  }
  if (isDebt) {
    path += `&isDebt=${isDebt}`;
  }
  return axiosClient.get(path);
};

export const createCustomer = async (body) => {
  return axiosClient.post("/customers", body);
};

export const updateCustomer = async (customerId, body) => {
  return axiosClient.patch(`/customers/${customerId}`, body);
};

export const getOneCustomer = async (customerId) => {
  return axiosClient.get(`/customers/${customerId}`);
};
export const deleteCustomer = async (customerId) => {
  return axiosClient.delete(`/customers/${customerId}`);
};

export const getAllCustomersNoPagination = async () => {
  return axiosClient.get("/customers/getAll");
};

export const getCustomersHaveDebt = async (search) => {
  let path = `/customers/getCustomersHaveDebt`;
  if (search) {
    path += `?search=${search}`;
  }
  return axiosClient.get(path);
};
