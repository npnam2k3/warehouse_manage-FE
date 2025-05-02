import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import StatusOfOrder from "../../components/StatusOfOrder";
import { getAllImportOrder } from "../../apis/importOrderService";
import TableImportOrder from "./components/TableImportOrder";
import ModalCreateImportOrder from "./components/ModalCreateImportOrder";

const payment_status = [
  {
    label: "Tất cả",
    id: 1,
    payment_status: "ALL",
  },
  {
    label: "Chưa thanh toán",
    id: 2,
    payment_status: "UNPAID",
  },
  {
    label: "Đã thanh toán 1 phần",
    id: 3,
    payment_status: "PARTIALLY_PAID",
  },
  {
    label: "Đã thanh toán",
    id: 4,
    payment_status: "PAID",
  },
];

const order_status = [
  {
    label: "Tất cả",
    id: 1,
    order_status: "ALL",
  },
  {
    label: "Đang xử lý",
    id: 2,
    order_status: "PROCESSING",
  },
  {
    label: "Đã xác nhận",
    id: 3,
    order_status: "COMPLETED",
  },
  {
    label: "Đã hủy",
    id: 4,
    order_status: "CANCELED",
  },
];
const ImportOrders = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [importOrders, setImportOrders] = useState([]);

  const [openModalCreateImportOrder, setOpenModalCreateImportOrder] =
    useState(false);

  const handleChangePaymentStatus = (event, newValue) => {
    setPaymentStatus(newValue);
  };
  const handleChangeOrderStatus = (event, newValue) => {
    setOrderStatus(newValue);
  };
  const handleClickFilterButton = () => {
    setPage(1);
    fetchData();
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleClickCreateButton = () => {
    setOpenModalCreateImportOrder(true);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllImportOrder({
        limit,
        payment_status: paymentStatus?.payment_status,
        order_status: orderStatus?.order_status,
        page,
        search,
      });
      setImportOrders(res.data?.data?.orders);
      setTotalPages(res.data?.data?.totalPages);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      {/* title and button add */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý hóa đơn nhập
        </Typography>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px", mx: "30px" }}
          onClick={handleClickCreateButton}
        >
          <AddIcon />
          <Typography variant="span">Tạo mới hóa đơn nhập</Typography>
        </Button>
      </Box>

      {/* search and filter */}
      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          mt: "30px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 9, display: "flex", gap: "20px" }}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên nhà cung cấp"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* trạng thái thanh toán */}
          <StatusOfOrder
            options={payment_status}
            label={"Trạng thái thanh toán"}
            value={paymentStatus}
            handleChange={handleChangePaymentStatus}
          />

          {/* trạng thái hóa đơn*/}
          <StatusOfOrder
            options={order_status}
            label={"Trạng thái hóa đơn"}
            value={orderStatus}
            handleChange={handleChangeOrderStatus}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Button variant="outlined" onClick={handleClickFilterButton}>
            Lọc
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          mt: "30px",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ size: "24px" }} />
          </Box>
        ) : importOrders.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
            Không tìm thấy hóa đơn.
          </Typography>
        ) : (
          <TableImportOrder
            data={importOrders}
            fetchData={fetchData}
            setPage={setPage}
          />
        )}
        {importOrders.length > 0 && (
          <Box sx={{ mt: "24px", display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        )}
      </Box>

      {openModalCreateImportOrder && (
        <ModalCreateImportOrder
          open={openModalCreateImportOrder}
          setOpen={setOpenModalCreateImportOrder}
          fetchData={fetchData}
          setPage={setPage}
        />
      )}
    </Box>
  );
};

export default ImportOrders;
