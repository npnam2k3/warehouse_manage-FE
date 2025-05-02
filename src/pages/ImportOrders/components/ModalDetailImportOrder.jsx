import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatMoney";
import { formattedDateTime } from "../../../utils/handleDateTime";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../../constant/order";

export default function ModalDetailImportOrder({ open, setOpen, data }) {
  if (!data) return null;

  const {
    supplier,
    import_order_code,
    total_amount,
    amount_paid,
    amount_due,
    payment_status,
    payment_due_date,
    order_status,
    createdAt,
    import_order_details,
    paymentDetails,
  } = data;

  const calcTotalQuantity = () =>
    import_order_details.reduce((sum, item) => sum + item.quantity, 0);
  const calcTotalAmount = () =>
    import_order_details.reduce(
      (sum, item) => sum + item.quantity * item.purchase_price,
      0
    );
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <DialogTitle>Chi tiết hóa đơn nhập</DialogTitle>
      <DialogContent dividers>
        {/* Nhà cung cấp */}
        <Typography variant="h6" gutterBottom>
          Thông tin nhà cung cấp
        </Typography>
        <Box mb="20px">
          <Typography>
            Tên nhà cung cấp: <strong>{supplier.name_company}</strong>
          </Typography>
          <Typography>Số điện thoại: {supplier.phone}</Typography>
          <Typography>Email: {supplier.email}</Typography>
          <Typography>Địa chỉ: {supplier.address}</Typography>
        </Box>

        {/* Thông tin hóa đơn */}
        <Typography variant="h6" gutterBottom>
          Thông tin hóa đơn
        </Typography>
        <Box mb="20px">
          <Typography>
            Mã hóa đơn: <strong>{import_order_code}</strong>
          </Typography>
          <Typography>
            Tổng tiền hóa đơn: <strong>{formatCurrency(total_amount)}</strong>
          </Typography>
          <Typography>
            Số tiền đã thanh toán:{" "}
            <strong>{formatCurrency(amount_paid)}</strong>
          </Typography>
          {order_status !== "CANCELED" && (
            <Typography>
              Số tiền còn lại:{" "}
              <strong
                style={{ color: payment_status !== "PAID" ? "red" : "inherit" }}
              >
                {formatCurrency(amount_due)}
              </strong>
            </Typography>
          )}
          <Typography>
            Ngày tạo hóa đơn: <strong>{formattedDateTime(createdAt)}</strong>
          </Typography>
          {order_status !== "CANCELED" && (
            <Typography>
              Ngày đến hạn thanh toán:{" "}
              <strong>
                {payment_due_date
                  ? formattedDateTime(payment_due_date)
                  : "Không có"}
              </strong>
            </Typography>
          )}
          <Typography>
            Trạng thái hóa đơn:
            <strong
              style={{ color: order_status === "CANCELED" ? "red" : "inherit" }}
            >
              {ORDER_STATUS[order_status]}
            </strong>
          </Typography>
          <Typography>
            Trạng thái thanh toán:{" "}
            <Chip
              label={PAYMENT_STATUS[payment_status]}
              color={
                payment_status === "PAID"
                  ? "success"
                  : payment_status === "PARTIALLY_PAID"
                  ? "warning"
                  : "error"
              }
              size="small"
            />
          </Typography>
        </Box>

        {/* Danh sách sản phẩm */}
        <Typography variant="h6" gutterBottom>
          Danh sách sản phẩm trong hóa đơn
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Mã SP</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {import_order_details.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.product_code}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.purchase_price.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="right">
                    {(item.purchase_price * item.quantity).toLocaleString()} đ
                  </TableCell>
                </TableRow>
              ))}

              {/* Hàng tổng */}
              <TableRow>
                <TableCell colSpan={2}>
                  <strong>Tổng đơn:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{calcTotalQuantity()}</strong>
                </TableCell>
                <TableCell />
                <TableCell align="right">
                  <strong>{formatCurrency(calcTotalAmount())}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Lịch sử thanh toán */}
        <Typography variant="h6" gutterBottom sx={{ mt: "20px" }}>
          Lịch sử thanh toán
        </Typography>
        {paymentDetails.length === 0 ? (
          <Typography sx={{ fontStyle: "italic", textAlign: "center" }}>
            Chưa có lần thanh toán nào.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Số tiền đã thanh toán</TableCell>
                  <TableCell>Ngày thanh toán</TableCell>
                  <TableCell>Phương thức</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentDetails.map((pd) => (
                  <TableRow key={pd.id}>
                    <TableCell>{formatCurrency(pd.amount)}</TableCell>
                    <TableCell>{formattedDateTime(pd.createdAt)}</TableCell>
                    <TableCell>
                      {PAYMENT_METHOD[pd.payment?.payment_method]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          variant="contained"
          color="primary"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
