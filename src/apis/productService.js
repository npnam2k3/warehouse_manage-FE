import axiosClient from "./axiosClient";

export const getAllProducts = async ({ limit, search, category, page }) => {
  let path = `/products?limit=${limit}&page=${page}`;
  if (search) {
    path = path + `&search=${search}`;
  }
  if (category) path = path + `&category=${category}`;
  return axiosClient.get(path);
};

export const createProduct = async (body) => {
  return axiosClient.post("/products", body);
};

export const updateProduct = async (productId, body) => {
  return axiosClient.patch(`/products/${productId}`, body);
};

export const getOneProduct = async (productId) => {
  return axiosClient.get(`/products/${productId}`);
};

export const deleteProduct = async (productId) => {
  return axiosClient.delete(`/products/${productId}`);
};

export const getAllProductsNoPagination = async () => {
  return axiosClient.get("/products/getAll");
};

export const getAllProductsHaveQuantityInWarehouse = async () => {
  return axiosClient.get("/products/getAllProductsHaveQuantityInWarehouse");
};
