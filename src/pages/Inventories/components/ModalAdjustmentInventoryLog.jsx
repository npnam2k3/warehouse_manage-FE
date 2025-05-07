import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAdjustmentInventoryLog } from "../../../apis/adjustInventoryService";
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
const ModalAdjustmentInventoryLog = ({ open, setOpen }) => {
  const [inventoriesLog, setInventoriesLog] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const fetchDataInventoriesLog = async () => {
    try {
      const res = await getAdjustmentInventoryLog({ limit, page });
      setTotalPages(res.data?.data?.totalPages);
      setInventoriesLog(res.data?.data?.inventoryLogs);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchDataInventoriesLog();
  }, [page]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="md"
      fullScreen
    >
      <DialogTitle>Lịch sử điều chỉnh tồn kho</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên sản phẩm</StyledTableCell>
                <StyledTableCell>Kho</StyledTableCell>
                <StyledTableCell>Số lượng cũ</StyledTableCell>
                <StyledTableCell>Số lượng mới</StyledTableCell>
                <StyledTableCell>Chênh lệch</StyledTableCell>
                <StyledTableCell>Lý do điều chỉnh</StyledTableCell>
                <StyledTableCell>Ngày điều chỉnh</StyledTableCell>
                <StyledTableCell>Người thực hiện điều chỉnh</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoriesLog.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.product?.name}
                  </StyledTableCell>
                  <StyledTableCell>{row.warehouse?.name}</StyledTableCell>
                  <StyledTableCell>{row.oldQuantity}</StyledTableCell>
                  <StyledTableCell>{row.newQuantity}</StyledTableCell>
                  <StyledTableCell>{row.discrepancy}</StyledTableCell>
                  <StyledTableCell>{row.reason_change}</StyledTableCell>
                  <StyledTableCell>
                    {formattedDateTime(row.createdAt)}
                  </StyledTableCell>
                  <StyledTableCell>{row.user?.fullname}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {inventoriesLog.length > 0 && (
          <Box sx={{ mt: "24px", display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          variant="outlined"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAdjustmentInventoryLog;
