import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatMoney";

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

const TableProductsSales = ({ productsSales }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 500, overflowY: "auto" }}
    >
      <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Mã sản phẩm</StyledTableCell>
            <StyledTableCell align="center">Tên sản phẩm</StyledTableCell>
            <StyledTableCell align="center">Số lượng đã bán</StyledTableCell>
            <StyledTableCell align="center">Doanh thu</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productsSales.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.product_code}
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                {row.quantity_sold}
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                {formatCurrency(row.revenue_of_product)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableProductsSales;
