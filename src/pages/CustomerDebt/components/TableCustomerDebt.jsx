import {
  Box,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";

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

import React, { useState } from "react";
import { formatCurrency } from "../../../utils/formatMoney";
import ModalPaymentMultipleOrder from "../../../components/payments/ModalPaymentMultipleOrder";
import ModalDetailCustomerDebt from "./ModalDetailCustomerDebt";

const TableCustomerDebt = ({ customersHaveDebt, fetchData }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openModalMultiplePayment, setOpenModalMultiplePayment] =
    useState(false);

  const [selectedCustomerDebt, setSelectedCustomerDebt] = useState(null);
  const handleClickOpenDetail = (customerDebt) => {
    setSelectedCustomerDebt(customerDebt);
    setOpenDetails(true);
  };

  const handleClickOpenModalPayment = (customerDebt) => {
    setSelectedCustomerDebt(customerDebt);
    setOpenModalMultiplePayment(true);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tên khách hàng</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Số điện thoại</StyledTableCell>
            <StyledTableCell>Địa chỉ</StyledTableCell>
            <StyledTableCell>Tổng nợ</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customersHaveDebt.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.fullname}
              </StyledTableCell>
              <StyledTableCell>{row.email}</StyledTableCell>
              <StyledTableCell>{row.phone}</StyledTableCell>
              <StyledTableCell>{row.address}</StyledTableCell>
              <StyledTableCell>{formatCurrency(row.totalDebt)}</StyledTableCell>
              <StyledTableCell
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: "10px",
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
                    onClick={() => handleClickOpenDetail(row)}
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
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickOpenModalPayment(row)}
                  >
                    <PaymentIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

      {/* modal view detail customer */}
      {openDetails && (
        <ModalDetailCustomerDebt
          open={openDetails}
          setOpen={setOpenDetails}
          customerDebt={selectedCustomerDebt}
        />
      )}

      {openModalMultiplePayment && (
        <ModalPaymentMultipleOrder
          listOrders={selectedCustomerDebt?.exportOrders}
          open={openModalMultiplePayment}
          setOpen={setOpenModalMultiplePayment}
          isImportOrder={false}
          fetchData={fetchData}
        />
      )}
    </TableContainer>
  );
};

export default TableCustomerDebt;
