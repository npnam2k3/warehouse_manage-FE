import axiosClient from "./axiosClient";

export const getAllSupplier = async ({ limit, page, search, isDebt }) => {
  let path = `/supplies?limit=${limit}&page=${page}`;
  if (search) {
    path += `&search=${search}`;
  }
  if (isDebt) {
    path += `&isDebt=${isDebt}`;
  }
  return axiosClient.get(path);
};

export const createSupplier = async (body) => {
  return axiosClient.post("/supplies", body);
};

export const updateSupplier = async (supplierId, body) => {
  return axiosClient.patch(`/supplies/${supplierId}`, body);
};

export const getOneSupplier = async (supplierId) => {
  return axiosClient.get(`/supplies/${supplierId}`);
};
export const deleteSupplier = async (supplierId) => {
  return axiosClient.delete(`/supplies/${supplierId}`);
};
