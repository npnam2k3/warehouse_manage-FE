import { Box, Button, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TableOrdersUpcomingPayment from "./TableOrdersUpcomingPayment";
import "dayjs/locale/vi";
import {
  getNumOrdersMonthly,
  getOrdersInMonth,
  getOrdersUpcomingPayment,
} from "../../../apis/statisticReportService";
import { ToastContext } from "../../../contexts/toastProvider";
import { formattedDateTime } from "../../../utils/handleDateTime";
import { TYPE_ORDER } from "../../../constant/order";
import { formatCurrencyForExportExcel } from "../../../utils/formatMoney";
import exportToExcel from "../../../utils/exportDataExcel";

const StatisticOrders = () => {
  const { toast } = useContext(ToastContext);

  dayjs.locale("vi");
  const [year, setYear] = useState(dayjs());
  const [monthYear, setmonthYear] = useState(dayjs());
  const [numUpcoming, setNumUpcoming] = useState("");

  const [numOrdersMonthly, setNumOrdersMonthly] = useState([]);
  const [ordersUpcomingPayment, setOrdersUpcomingPayment] = useState([]);

  const handleClickFilterNumOrders = () => {
    fetchDataNumOrdersMonthly();
  };

  const handleClickFilterNumUpcoming = () => {
    if (!numUpcoming || numUpcoming <= 0) {
      toast.error(`Số ngày đến hạn phải là số lớn hơn 0`);
      return;
    }
    fetchDataOrdersUpcomingPayment();
  };

  const handleClickExcelExport = async () => {
    const month = monthYear.format("MM");
    const year = monthYear.format("YYYY");

    try {
      const res = await getOrdersInMonth({ month, year }); // Gọi API và chờ hoàn thành
      const orders = res.data.data;

      const excelData = orders.map((item) => ({
        "Ngày tạo": formattedDateTime(item.createdAt),
        "Mã hóa đơn":
          item.type_order === "IMPORT"
            ? item.import_order_code
            : item.export_order_code,
        "Loại hóa đơn": TYPE_ORDER[item.type_order],
        "Tổng tiền": formatCurrencyForExportExcel(item.total_amount),
        "Đối tác":
          item.type_order === "IMPORT"
            ? item.supplier?.name_company
            : item.customer?.fullname,
      }));

      exportToExcel({
        data: excelData,
        fileName: `Báo cáo hóa đơn trong tháng ${month} năm ${year}`,
      });
    } catch (error) {
      toast.error("Lỗi khi xuất file Excel");
      console.error(error);
    }
  };

  const fetchDataNumOrdersMonthly = async () => {
    try {
      const res = await getNumOrdersMonthly(year.format("YYYY"));
      setNumOrdersMonthly(formatDataNumOrdersMonthly(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const formatDataNumOrdersMonthly = (rawData) => {
    return rawData.map((item) => ({
      month: `Tháng ${item.month}`,
      import_order: Number(item.num_import_orders),
      export_order: Number(item.num_export_orders),
      io_canceled: Number(item.num_import_orders_canceled),
      eo_canceled: Number(item.num_export_orders_canceled),
    }));
  };

  const fetchDataOrdersUpcomingPayment = async () => {
    try {
      const res = await getOrdersUpcomingPayment(numUpcoming || 5);
      setOrdersUpcomingPayment(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataNumOrdersMonthly();
    fetchDataOrdersUpcomingPayment();
  }, []);
  return (
    <Box sx={{ mt: 2 }}>
      <Box mt={4}>
        <Typography
          variant="h6"
          sx={{ mb: "10px", textAlign: "center", fontSize: "22px" }}
        >
          Biểu đồ số lượng đơn hàng các tháng trong năm
        </Typography>
        <Typography
          variant="p"
          gutterBottom
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: "30px",
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
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
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
              onClick={handleClickFilterNumOrders}
            >
              Lọc
            </Button>
          </Box>
        </Box>
        <ResponsiveContainer width="95%" height={400}>
          <LineChart
            data={numOrdersMonthly}
            margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dy={10} dataKey="month" interval={0} />
            <YAxis
              label={{
                value: "Số lượng đơn",
                angle: 0,
                position: "top",
                offset: 0,
                dy: -15,
                dx: 20,
              }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: 20 }} />
            <Line
              type="monotone"
              dataKey="export_order"
              stroke="#8884d8"
              name="Đơn xuất"
            />
            <Line
              type="monotone"
              dataKey="import_order"
              stroke="#82ca9d"
              name="Đơn nhập"
            />
            <Line
              type="monotone"
              dataKey="io_canceled"
              stroke="#FF9F00"
              name="Đơn nhập bị hủy"
            />
            <Line
              type="monotone"
              dataKey="eo_canceled"
              stroke="#C5172E"
              name="Đơn xuất bị hủy"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box mt={6}>
        <Typography
          variant="h6"
          sx={{ mb: "5px", textAlign: "center", fontSize: "22px" }}
        >
          Đơn sắp đến hạn thanh toán
        </Typography>
        <Typography
          variant="p"
          sx={{
            mb: "16px",
            textAlign: "center",
            fontSize: "18px",
            fontStyle: "italic",
            display: "flex",
            justifyContent: "center",
          }}
        >
          (Mặc định 5 ngày)
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
            mb: "30px",
          }}
        >
          <TextField
            label="Số ngày sắp đến hạn"
            size="small"
            type="number"
            sx={{ width: "300px" }}
            value={numUpcoming}
            onChange={(e) => setNumUpcoming(e.target.value)}
            inputProps={{
              input: {
                min: 0,
              },
            }}
          />
          <Button
            variant="contained"
            sx={{ width: "200px" }}
            onClick={handleClickFilterNumUpcoming}
          >
            Lọc
          </Button>
        </Box>
        <Box>
          <TableOrdersUpcomingPayment data={ordersUpcomingPayment} />
        </Box>
      </Box>
      <Box mt={4}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography>Xuất file Excel các đơn trong tháng: </Typography>
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

export default StatisticOrders;
