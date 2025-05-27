import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Chip,
  MenuItem,
  Pagination,
  Select,
  TablePagination,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatMoney";
import { formattedDateTime } from "../../../utils/handleDateTime";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  TYPE_ORDER,
} from "../../../constant/order";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#A1E3F9",
    color: theme.palette.common.black,
    top: 0,
    zIndex: 1,
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

export default function TableOrdersUpcomingPayment({ data }) {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 500, overflowY: "auto" }}
    >
      <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Mã hóa đơn</StyledTableCell>
            <StyledTableCell align="center">Đối tác</StyledTableCell>
            <StyledTableCell align="center">Ngày tạo</StyledTableCell>
            <StyledTableCell align="center">Tổng tiền</StyledTableCell>
            <StyledTableCell align="center">
              Trạng thái thanh toán
            </StyledTableCell>
            <StyledTableCell align="center">Trạng thái hóa đơn</StyledTableCell>
            <StyledTableCell align="center">Đã thanh toán</StyledTableCell>
            <StyledTableCell align="center">Còn lại</StyledTableCell>
            <StyledTableCell align="center">Loại hóa đơn</StyledTableCell>
            <StyledTableCell align="center">Ngày đến hạn</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.type_order === "EXPORT"
                  ? row.export_order_code
                  : row.import_order_code}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.type_order === "EXPORT"
                  ? row.customer?.fullname
                  : row.supplier.name_company}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formattedDateTime(row.createdAt)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formatCurrency(row.total_amount)}
              </StyledTableCell>
              <StyledTableCell align="center">
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
              <StyledTableCell align="center">
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
              <StyledTableCell align="center">
                {formatCurrency(row.amount_paid)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formatCurrency(row.amount_due)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {TYPE_ORDER[row.type_order]}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formattedDateTime(row.payment_due_date)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Box
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 2,
          borderTop: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "20px",
          }}
        >
          <Typography>Số bản ghi mỗi trang: </Typography>
          <Select
            value={rowsPerPage}
            //   onChange={handleChangeRowsPerPage}
            size="small"
            sx={{ ml: 1 }}
          >
            {[5, 10, 25, 50].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Pagination count={10} color="primary" sx={{ p: "20px" }} />
      </Box> */}
    </TableContainer>
  );
}
