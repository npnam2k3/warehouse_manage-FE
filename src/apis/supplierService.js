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

export const addProductToSupplier = async (body) => {
  return axiosClient.post("/supplies/add-product-to-supplier", body);
};
export const deleteProductFromSupplier = async (body) => {
  return axiosClient.post("/supplies/delete-product-from-supplier", body);
};

export const getAllSuppliersNoPagination = async () => {
  return axiosClient.get("/supplies/getAll");
};

export const getProductsOfSupplier = async (id) => {
  return axiosClient.get(`/supplies/get-products-of-supplier/${id}`);
};
