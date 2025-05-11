export const formatCurrency = (value) => {
  if (isNaN(value)) return "0₫";
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const formatCurrencyForExportExcel = (value) => {
  return value.toLocaleString("en-US");
};
