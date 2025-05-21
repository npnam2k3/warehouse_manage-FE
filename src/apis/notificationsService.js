import axiosClient from "./axiosClient";

const path = "/notifications";
export const getNotifications = () => {
  return axiosClient.get(path);
};

export const getNotificationsUnseen = () => {
  return axiosClient.get(`${path}/unseen`);
};

export const markSeenNotification = (id) => {
  return axiosClient.patch(`${path}/seen/${id}`);
};

export const getOneNotification = (id) => {
  return axiosClient.get(`${path}/${id}`);
};
