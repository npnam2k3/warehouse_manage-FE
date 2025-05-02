import axiosClient from "./axiosClient";

export const createPayment = async (body) => {
  return axiosClient.post("/payments", body);
};
