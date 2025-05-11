import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TableProductsSales from "./TableProductsSales";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  getCurrentDay,
  getFirstDayOfCurrentMonth,
} from "../../../utils/handleDateTime";
import {
  getProductsSales,
  getProductsSalesForExcel,
} from "../../../apis/statisticReportService";
import { formatCurrencyForExportExcel } from "../../../utils/formatMoney";
import exportToExcel from "../../../utils/exportDataExcel";
import { toast } from "react-toastify";

const StatisticProduct = () => {
  dayjs.locale("vi");
  const [monthYear, setmonthYear] = useState(dayjs());
  const [fromDate, setFromDate] = useState(getFirstDayOfCurrentMonth());
  const [toDate, setToDate] = useState(getCurrentDay());

  const [productsSales, setProductsSales] = useState([]);

  const handleClickFilterProductsSales = () => {
    fetchDateProductsSales();
  };

  const handleClickExcelExport = async () => {
    const month = monthYear.format("MM");
    const year = monthYear.format("YYYY");

    try {
      const res = await getProductsSalesForExcel({ month, year });
      const productsSales = res.data.data;

      const excelData = productsSales.map((item) => ({
        "Mã sản phẩm": item.product_code,
        "Tên sản phẩm": item.name,
        "Số lượng bán": item.quantity_sold,
        "Doanh thu": formatCurrencyForExportExcel(item.revenue),
        "Số lượng nhập": item.quantity_imported,
        "Chi phí nhập": formatCurrencyForExportExcel(item.cost),
      }));

      exportToExcel({
        data: excelData,
        fileName: `Báo cáo sản phẩm tháng ${month} năm ${year}`,
      });
    } catch (error) {
      toast.error("Lỗi xuất file excel");
      console.log(error);
    }
  };

  const fetchDateProductsSales = async () => {
    let fromDateValid;
    let toDateValid;
    if (!fromDate) {
      fromDateValid = getFirstDayOfCurrentMonth();
    } else {
      fromDateValid = fromDate;
    }

    if (!toDate) {
      toDateValid = getCurrentDay();
    } else {
      toDateValid = toDate;
    }

    try {
      const res = await getProductsSales({
        fromDate: fromDateValid,
        toDate: toDateValid,
      });
      setProductsSales(res.data.data);
      setQuantityProductsSalesForChart(
        formatDataQuantityProductsSalesForChart(res.data.data)
      );
      setRevenueProductsSalesForChart(
        formatDataRevenueProductsSalesForChart(res.data.data)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDateProductsSales();
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: "10px", textAlign: "center", fontSize: "22px" }}
        >
          Bảng doanh số bán hàng của các sản phẩm tháng hiện tại
        </Typography>
        <Typography
          variant="p"
          gutterBottom
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: "20px",
            fontStyle: "italic",
            fontSize: "18px",
          }}
        >
          (Có thể lọc để xem số liệu theo thời gian)
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              label="Từ ngày"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Đến ngày"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleClickFilterProductsSales}
            >
              Lọc
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TableProductsSales productsSales={productsSales} />
      </Box>

      <Box sx={{ mt: "60px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography>
            Xuất file Excel số lượng bán và nhập của tất cả các sản phẩm theo
            tháng:{" "}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Chọn tháng năm"
              views={["month", "year"]}
              value={monthYear}
              onChange={(newValue) => {
                setmonthYear(newValue);
              }}
              slotProps={{
                popper: {
                  placement: "bottom-start",
                },
                textField: {
                  size: "small",
                  sx: {
                    width: "200px",
                    "& .MuiInputBase-root": {
                      height: 36,
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Button variant="contained" onClick={handleClickExcelExport}>
          Xuất Excel
        </Button>
      </Box>
    </Box>
  );
};

export default StatisticProduct;
