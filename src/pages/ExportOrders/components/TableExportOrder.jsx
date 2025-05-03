import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Chip, Tooltip } from "@mui/material";
import { ToastContext } from "../../../contexts/toastProvider";
import { formatCurrency } from "../../../utils/formatMoney";
import { formattedDateTime } from "../../../utils/handleDateTime";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../constant/order";
import {
  confirmExportOrder,
  getOneExportOrder,
} from "../../../apis/exportOrderService";

import ModalDetailExportOrder from "./ModalDetailExportOrder";
import ModalCancelExportOrder from "./ModalCancelExportOrder";
import ModalPaymentExportOrder from "../../../components/payments/ModalPaymentExportOrder";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#A1E3F9",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableExportOrder({ data, setPage, fetchData }) {
  const { toast } = React.useContext(ToastContext);
  const [selectedExportOrder, setSelectedExportOrder] = React.useState(null);
  const [openModalCancel, setOpenModalCancel] = React.useState(false);
  const [openExportOrderDetail, setOpenExportOrderDetail] =
    React.useState(false);

  const [openModalPayment, setOpenModalPayment] = React.useState(false);

  const handleClickDetailExportOrder = (order) => {
    fetchDataGetOneExportOrder(order?.id);
    setOpenExportOrderDetail(true);
  };

  const handleClickConfirm = async (id) => {
    try {
      const res = await confirmExportOrder(id);
      toast.success(res.data?.message);
      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleClickCancel = (exportOrder) => {
    setSelectedExportOrder(exportOrder);
    setOpenModalCancel(true);
  };

  const handleClickPayment = (order) => {
    fetchDataGetOneExportOrder(order?.id);
    setOpenModalPayment(true);
  };

  const fetchDataGetOneExportOrder = async (id) => {
    try {
      const res = await getOneExportOrder(id);
      setSelectedExportOrder(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Mã hóa đơn</StyledTableCell>
            <StyledTableCell>Tên khách hàng</StyledTableCell>
            <StyledTableCell>Ngày tạo</StyledTableCell>
            <StyledTableCell>Tổng tiền</StyledTableCell>
            <StyledTableCell>Trạng thái thanh toán</StyledTableCell>
            <StyledTableCell>Trạng thái hóa đơn</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.export_order_code}
              </StyledTableCell>
              <StyledTableCell>{row.customer?.fullname}</StyledTableCell>
              <StyledTableCell>
                {formattedDateTime(row.createdAt)}
              </StyledTableCell>
              <StyledTableCell>
                {formatCurrency(row.total_amount)}
              </StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={PAYMENT_STATUS[row.payment_status]}
                  color={
                    row.payment_status === "PAID"
                      ? "success"
                      : row.payment_status === "PARTIALLY_PAID"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={ORDER_STATUS[row.order_status]}
                  color={
                    row.order_status === "COMPLETED"
                      ? "success"
                      : row.order_status === "PROCESSING"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Chi tiết" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#EEF1DA",
                      color: "#FFA725",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickDetailExportOrder(row)}
                  >
                    <VisibilityIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>

                <Tooltip title="Thanh toán" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#F7BAAD",
                      color: "#FF5634",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",

                      cursor:
                        row.payment_status !== "PAID" &&
                        row.order_status === "COMPLETED"
                          ? "pointer"
                          : "default",
                      visibility:
                        row.payment_status !== "PAID" &&
                        row.order_status === "COMPLETED"
                          ? "visible"
                          : "hidden",
                      pointerEvents:
                        row.payment_status !== "PAID" &&
                        row.order_status === "COMPLETED"
                          ? "auto"
                          : "none",
                    }}
                    onClick={() => handleClickPayment(row)}
                  >
                    <PaymentIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>

                <Tooltip title="Xác nhận hóa đơn" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#7AE2CF",
                      color: "#B5FCCD",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor:
                        row.order_status === "PROCESSING"
                          ? "pointer"
                          : "default",
                      visibility:
                        row.order_status === "PROCESSING"
                          ? "visible"
                          : "hidden",
                      pointerEvents:
                        row.order_status === "PROCESSING" ? "auto" : "none",
                    }}
                    onClick={() => handleClickConfirm(row.id)}
                  >
                    <CheckIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>

                <Tooltip title="Hủy hóa đơn" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#E83F25",
                      color: "#FF9A9A",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor:
                        row.order_status === "PROCESSING"
                          ? "pointer"
                          : "default",
                      visibility:
                        row.order_status === "PROCESSING"
                          ? "visible"
                          : "hidden",
                      pointerEvents:
                        row.order_status === "PROCESSING" ? "auto" : "none",
                    }}
                    onClick={() => handleClickCancel(row)}
                  >
                    <CancelIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

      {/* modal view detail import order */}
      {openExportOrderDetail && (
        <ModalDetailExportOrder
          open={openExportOrderDetail}
          setOpen={setOpenExportOrderDetail}
          data={selectedExportOrder}
        />
      )}

      {/* modal cancel */}
      {openModalCancel && (
        <ModalCancelExportOrder
          open={openModalCancel}
          setOpen={setOpenModalCancel}
          fetchData={fetchData}
          setPage={setPage}
          export_order={selectedExportOrder}
        />
      )}

      {/* modal payment */}
      {openModalPayment && (
        <ModalPaymentExportOrder
          open={openModalPayment}
          setOpen={setOpenModalPayment}
          export_order={selectedExportOrder}
          fetchData={fetchData}
          setPage={setPage}
        />
      )}
    </TableContainer>
  );
}
