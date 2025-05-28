import axiosClient from "./axiosClient";

const path = "/statistic-report";
export const getBaseInfo = ({ fromDate, toDate }) => {
  return axiosClient.get(
    `${path}/base-info?fromDate=${fromDate}&toDate=${toDate}`
  );
};

export const getInfoForChartAndExcelReport = (year) => {
  return axiosClient.get(`${path}/info-for-chart-excel?year=${year}`);
};

export const getNumOrdersMonthly = (year) => {
  return axiosClient.get(`${path}/orders-monthly?year=${year}`);
};

export const getOrdersUpcomingPayment = (num_date) => {
  return axiosClient.get(
    `${path}/orders-upcoming-payment?num_date=${num_date}`
  );
};

export const getOrderOverdue = () => {
  return axiosClient.get(`${path}/orders-overdue`);
};

export const getOrdersInMonth = ({ month, year }) => {
  return axiosClient.get(`${path}/orders-in-month?month=${month}&year=${year}`);
};

export const getProductsSales = ({ fromDate, toDate }) => {
  return axiosClient.get(
    `${path}/products-sales?fromDate=${fromDate}&toDate=${toDate}`
  );
};

export const getProductsSalesForExcel = ({ month, year }) => {
  return axiosClient.get(
    `${path}/products-sales-for-excel?month=${month}&year=${year}`
  );
};
