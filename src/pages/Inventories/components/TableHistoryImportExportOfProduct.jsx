import {
  Box,
  Pagination,
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
import { formattedDateTime } from "../../../utils/handleDateTime";
import { formatCurrency } from "../../../utils/formatMoney";

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

export default function TableHistoryImportExportOfProduct({
  data,
  isImport,
  totalPages,
  handleChangePage,
  page,
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell>Kho lưu trữ</StyledTableCell>
              <StyledTableCell>
                {isImport ? "Giá nhập" : "Giá bán"}
              </StyledTableCell>
              <StyledTableCell>
                {isImport ? "Ngày nhập" : "Ngày bán"}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name_product}
                </StyledTableCell>
                <StyledTableCell>{row.warehouse_name}</StyledTableCell>
                <StyledTableCell>
                  {formatCurrency(
                    isImport ? row.purchase_price : row.sell_price
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {formattedDateTime(
                    isImport ? row.date_purchase : row.date_sell
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
          <Typography
            component={"p"}
            sx={{ fontStyle: "italic", textAlign: "center", padding: "10px" }}
          >
            Chưa có lịch sử {isImport ? "nhập hàng" : "xuất hàng"}
          </Typography>
        )}
      </TableContainer>
      {data.length > 0 && (
        <Box sx={{ mt: "24px", display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            onChange={handleChangePage}
          />
        </Box>
      )}
    </>
  );
}
