import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CountUp from "react-countup";
import {
  getCurrentDay,
  getFirstDayOfCurrentMonth,
} from "../../../utils/handleDateTime";
import {
  getBaseInfo,
  getInfoForChartAndExcelReport,
} from "../../../apis/statisticReportService";
import exportToExcel from "../../../utils/exportDataExcel";
import { formatCurrencyForExportExcel } from "../../../utils/formatMoney";

export default function StatisticCommon() {
  const [year, setYear] = useState(dayjs());
  const [fromDate, setFromDate] = useState(getFirstDayOfCurrentMonth());
  const [toDate, setToDate] = useState(getCurrentDay());

  const [baseInfo, setBaseInfo] = useState({});
  const [dataForChart, setDataForChart] = useState([]);
  const [dataForExcel, setDataForExcel] = useState([]);

  const handleClickFilterBtn = () => {
    fetchDataBaseInfo();
  };

  const handleClickFilterBtnYear = () => {
    fetchDataInfoForChartAndExcelReport();
  };

  const handleClickBtnExportExcel = () => {
    exportToExcel({
      data: dataForExcel,
      fileName: "Báo cáo doanh thu - chi phí",
    });
  };

  const fetchDataBaseInfo = async () => {
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
      const res = await getBaseInfo({
        fromDate: fromDateValid,
        toDate: toDateValid,
      });
      setBaseInfo(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataInfoForChartAndExcelReport = async () => {
    try {
      const res = await getInfoForChartAndExcelReport(year.format("YYYY"));
      // console.log("check data::", res.data);
      setDataForChart(formatDataForChart(res.data.data));
      setDataForExcel(formatDataForExcel(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const formatDataForChart = (rawData) => {
    return rawData.map((item) => {
      return {
        name: `Tháng ${item.month}`,
        revenue: Number(item.total_revenue),
        // profit: Number(item.profit),
        importCost: Number(item.total_cost),
      };
    });
  };

  const formatDataForExcel = (rawData) => {
    return rawData.map((item) => {
      return {
        Tháng: item.month,
        "Doanh thu": formatCurrencyForExportExcel(Number(item.total_revenue)),
        "Chi phí": formatCurrencyForExportExcel(Number(item.total_cost)),
        // "Lợi nhuận": formatCurrencyForExportExcel(Number(item.profit)),
        "Số đơn nhập": Number(item.num_import_orders),
        "Số đơn xuất": Number(item.num_export_orders),
        "Số đơn nhập bị hủy": Number(item.num_import_orders_canceled),
        "Số đơn xuất bị hủy": Number(item.num_export_orders_canceled),
      };
    });
  };

  useEffect(() => {
    fetchDataBaseInfo();
    fetchDataInfoForChartAndExcelReport();
  }, []);

  return (
    <Box mt={2}>
      {/* Bộ lọc */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: "20px" }}>
          Bộ lọc theo khoảng thời gian
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
              onClick={handleClickFilterBtn}
            >
              Lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Số liệu chung */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                sx={{ mb: "8px" }}
              >
                Tổng quan số liệu tháng hiện tại:{" "}
                {fromDate
                  ? dayjs(fromDate).format("DD-MM-YYYY")
                  : dayjs(getFirstDayOfCurrentMonth()).format(
                      "DD-MM-YYYY"
                    )}{" "}
                đến{" "}
                {toDate
                  ? dayjs(toDate).format("DD-MM-YYYY")
                  : dayjs(getCurrentDay()).format("DD-MM-YYYY")}
              </Typography>
              <Typography
                variant="p"
                gutterBottom
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: "18px",
                  fontStyle: "italic",
                  fontSize: "18px",
                }}
              >
                (Có thể lọc để xem số liệu theo thời gian)
              </Typography>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Số đơn nhập
                  </Typography>
                  <Typography variant="h5" color="#10B981" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={Number(baseInfo.num_import_order)}
                      duration={1}
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Số đơn xuất
                  </Typography>
                  <Typography variant="h5" color="#10B981" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={Number(baseInfo.num_export_order)}
                      duration={1}
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Đơn bị hủy
                  </Typography>
                  <Typography variant="h5" color="#EF4444" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={
                        Number(baseInfo.num_import_order_canceled) +
                        Number(baseInfo.num_export_order_canceled)
                      }
                      duration={1}
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Doanh thu
                  </Typography>
                  <Typography variant="h5" color="#10B981" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={Number(baseInfo.total_revenue)}
                      duration={1}
                      suffix=" đ"
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Chi phí
                  </Typography>
                  <Typography variant="h5" color="#EF4444" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={Number(baseInfo.total_cost)}
                      duration={1}
                      suffix=" đ"
                    />
                  </Typography>
                </Grid>
                {/* <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    height: "100px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    Lợi nhuận
                  </Typography>
                  <Typography variant="h5" color="#6B7280" sx={{ flexGrow: 0 }}>
                    <CountUp
                      end={Number(baseInfo.profit)}
                      duration={1}
                      suffix=" đ"
                    />
                  </Typography>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ các tháng trong năm */}
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: "10px", textAlign: "center" }}
        >
          Biểu đồ so sánh doanh thu - chi phí nhập hàng các tháng trong năm
        </Typography>
        <Typography
          variant="p"
          gutterBottom
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: "18px",
            fontStyle: "italic",
            fontSize: "18px",
          }}
        >
          (Chọn năm để xem thêm số liệu)
        </Typography>
        <Box
          sx={{
            mb: "40px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Chọn năm"
                views={["year"]}
                openTo="year"
                value={year}
                onChange={(newValue) => setYear(newValue)}
                slotProps={{
                  popper: {
                    placement: "bottom-start",
                  },
                  textField: {
                    size: "small",
                    sx: {
                      width: "300px",
                      "& .MuiInputBase-root": {
                        height: 36,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ width: "200px" }}
              onClick={handleClickFilterBtnYear}
            >
              Lọc
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              barSize={18}
              data={dataForChart}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                width={80}
                tickFormatter={(value) => {
                  const absValue = Math.abs(value);
                  const sign = value < 0 ? "-" : "";

                  if (absValue >= 1_000_000_000) {
                    return sign + (absValue / 1_000_000_000).toFixed(1) + " tỷ";
                  } else if (absValue >= 1_000_000) {
                    return sign + (absValue / 1_000_000).toFixed(0) + " triệu";
                  } else {
                    return value; // hoặc: return sign + absValue.toString();
                  }
                }}
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 30 }}
              />
              <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              <Bar dataKey="importCost" fill="#82ca9d" name="Chi phí nhập" />
              {/* <Bar dataKey="profit" fill="#ff7300" name="Lợi nhuận" /> */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Xuất Excel */}
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Xuất báo cáo các thông tin: doanh thu, chi phí nhập hàng, số đơn
            nhập/ xuất/ hủy của các tháng trong năm: {year.format("YYYY")} (nếu
            cần)
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleClickBtnExportExcel}
        >
          Xuất Excel
        </Button>
      </Paper>
    </Box>
  );
}
