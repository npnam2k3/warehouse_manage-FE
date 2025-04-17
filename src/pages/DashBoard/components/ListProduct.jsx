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
const ListProduct = () => {
  const data = [
    {
      name: "Nước nắm Nam Ngư",
      category: "Nước mắm",
      quantity: 20,
    },
    {
      name: "Nước nắm Nam Ngư",
      category: "Nước mắm",
      quantity: 20,
    },
    {
      name: "Nước nắm Nam Ngư",
      category: "Nước mắm",
      quantity: 20,
    },
    {
      name: "Nước nắm Nam Ngư",
      category: "Nước mắm",
      quantity: 20,
    },
  ];
  return (
    <Box sx={{ p: "20px" }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ textAlign: "center", mb: "20px" }}
      >
        Sản phẩm có lượng tồn kho thấp
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell>Danh mục</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell>{row.category}</StyledTableCell>
                <StyledTableCell>{row.quantity}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListProduct;
