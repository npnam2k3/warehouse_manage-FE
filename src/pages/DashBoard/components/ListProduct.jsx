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
  Typography,
} from "@mui/material";
import React from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#A1E3F9",
    color: theme.palette.common.black,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
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
const ListProduct = ({ products, inventoryThreshold }) => {
  return (
    <Box sx={{ p: "20px" }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ textAlign: "center", mb: "20px" }}
      >
        Sản phẩm trong các kho có số lượng thấp
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Mã sản phẩm</StyledTableCell>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell>Kho lưu trữ</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Ngưỡng đánh giá</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row?.product?.product_code}
                </StyledTableCell>
                <StyledTableCell>{row?.product?.name}</StyledTableCell>
                <StyledTableCell>{row?.warehouse?.name}</StyledTableCell>
                <StyledTableCell>{row?.quantity}</StyledTableCell>
                <StyledTableCell>{inventoryThreshold}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListProduct;
