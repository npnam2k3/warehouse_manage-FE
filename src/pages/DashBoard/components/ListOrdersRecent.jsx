import {
  Box,
  Chip,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../constant/order";
import { formatCurrency } from "../../../utils/formatMoney";
import { formattedDateTime } from "../../../utils/handleDateTime";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#A1E3F9",
    color: theme.palette.common.black,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
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
const ListOrdersRecent = ({ isListImportOrder, listOrders }) => {
  return (
    <Box sx={{ p: "20px" }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ textAlign: "center", mb: "20px" }}
      >
        {isListImportOrder
          ? "Danh sách các đơn nhập gần đây (3 ngày gần đây)"
          : "Danh sách các đơn xuất gần đây (3 ngày gần đây)"}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Mã đơn hàng</StyledTableCell>
              <StyledTableCell>Tổng tiền</StyledTableCell>
              <StyledTableCell>Trạng thái thanh toán</StyledTableCell>
              <StyledTableCell>Trạng thái hóa đơn</StyledTableCell>
              <StyledTableCell>Đã thanh toán</StyledTableCell>
              <StyledTableCell>Còn lại</StyledTableCell>
              <StyledTableCell>Ngày tạo</StyledTableCell>
            </TableRow>
          </TableHead>
          {listOrders?.length > 0 ? (
            <TableBody>
              {listOrders?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {isListImportOrder
                      ? row.import_order_code
                      : row.export_order_code}
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
                  <StyledTableCell>
                    {formatCurrency(row.amount_paid)}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: row.amount_due > 0 ? "red" : "inherit" }}
                  >
                    {formatCurrency(row.amount_due)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {formattedDateTime(row.createdAt)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          ) : (
            <Typography
              variant="p"
              sx={{ fontSize: "18px", mt: "10px", textAlign: "center" }}
            >
              Chưa có hóa đơn nào
            </Typography>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListOrdersRecent;
