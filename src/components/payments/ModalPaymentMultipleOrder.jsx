import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { formatCurrency } from "../../utils/formatMoney";
import { Close } from "@mui/icons-material";
import {
  PaymentMethod,
  PaymentStatus,
  TypePayment,
} from "../../constant/order";
import { NumericFormat } from "react-number-format";
import { ToastContext } from "../../contexts/toastProvider";
import { createPayment } from "../../apis/paymentService";

const ModalPaymentMultipleOrder = ({
  listOrders,
  open,
  setOpen,
  isImportOrder,
  fetchData,
}) => {
  const { toast } = useContext(ToastContext);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSelect = (order) => {
    setSelectedOrders((prev) => {
      const exists = prev.find((item) => item.order_id === order.id);
      if (exists) {
        // Nếu đã có thì bỏ chọn
        return prev.filter((item) => item.order_id !== order.id);
      } else {
        // Nếu chưa có thì thêm vào
        return [
          ...prev,
          {
            order_id: order.id,
          },
        ];
      }
    });
  };
  const handleAmountChange = (orderId, value) => {
    setSelectedOrders((prev) =>
      prev.map((item) =>
        item.order_id === orderId ? { ...item, amount: Number(value) } : item
      )
    );
  };

  const handleDateChange = (orderId, value) => {
    setSelectedOrders((prev) =>
      prev.map((item) =>
        item.order_id === orderId ? { ...item, payment_due_date: value } : item
      )
    );
  };

  const handlePaymentTypeChange = (orderId, value) => {
    setSelectedOrders((prev) => {
      return prev.map((item) =>
        item.order_id === orderId ? { ...item, payment_status: value } : item
      );
    });
  };
  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    for (let item of selectedOrders) {
      const order = listOrders.find((o) => o.id === item.order_id);
      if (item.amount === undefined || item.amount <= 0) {
        toast.error(
          `Vui lòng nhập số tiền thanh toán cho đơn: ${
            isImportOrder ? order.import_order_code : order.export_order_code
          }`
        );
        return;
      }
      if (!item.payment_status) {
        toast.error(
          `Vui lòng chọn hình thức thanh toán cho đơn: ${
            isImportOrder ? order.import_order_code : order.export_order_code
          }`
        );
        return;
      }
      if (
        item.payment_status === PaymentStatus.PAID &&
        item.amount < order.amount_due
      ) {
        toast.error(
          `Đơn ${
            isImportOrder ? order.import_order_code : order.export_order_code
          }: Bạn đã chọn thanh toán toàn bộ nhưng số tiền chưa đủ.`
        );
        return;
      }

      if (
        item.payment_status === PaymentStatus.PARTIALLY_PAID &&
        item.amount === order.amount_due
      ) {
        toast.error(
          `Đơn ${
            isImportOrder ? order.import_order_code : order.export_order_code
          }: Số tiền đã đủ, vui lòng chọn "Thanh toán toàn bộ".`
        );
        return;
      }

      if (
        item.payment_status === PaymentStatus.PARTIALLY_PAID &&
        (!item.payment_due_date || item.payment_due_date === "")
      ) {
        toast.error(
          `Đơn ${
            isImportOrder ? order.import_order_code : order.export_order_code
          }: Vui lòng chọn ngày gia hạn nếu thanh toán một phần`
        );
        return;
      }
    }

    const payload = {
      type: isImportOrder ? TypePayment.IMPORT : TypePayment.EXPORT,
      list_orders: selectedOrders,
      payment_method: paymentMethod,
    };
    try {
      const res = await createPayment(payload);
      toast.success(res.data?.message);

      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setOpen(false);
    }
  };

  const calcTotalAmount = () => {
    return selectedOrders.reduce((sum, curr) => sum + curr.amount, 0);
  };
  return (
    <Dialog open={open} fullScreen onClose={handleClose} maxWidth="md">
      <DialogTitle>
        Chọn hóa đơn để thanh toán
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          {/* <Typography variant="h6" gutterBottom>
            Chọn hóa đơn để thanh toán nhiều
          </Typography> */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Mã hóa đơn</TableCell>
                  <TableCell align="center">Tổng tiền</TableCell>
                  <TableCell align="center">Đã trả</TableCell>
                  <TableCell align="center">Còn lại</TableCell>
                  <TableCell align="center">Số tiền thanh toán</TableCell>
                  <TableCell align="center">Hình thức thanh toán</TableCell>
                  <TableCell align="center">
                    Gia hạn đến (nếu còn thiếu)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOrders.map((order) => {
                  const remaining = order.total_amount - order.amount_paid;
                  const selected = selectedOrders.find(
                    (item) => item.order_id === order.id
                  );

                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected ? true : false}
                          onChange={() => handleSelect(order)}
                        />
                      </TableCell>
                      <TableCell>
                        {order?.import_order_code || order?.export_order_code}
                      </TableCell>
                      <TableCell align="center">
                        {formatCurrency(order?.total_amount)}
                      </TableCell>
                      <TableCell align="center">
                        {formatCurrency(order?.amount_paid)}
                      </TableCell>
                      <TableCell align="center">
                        {formatCurrency(order?.amount_due)}
                      </TableCell>
                      <TableCell align="center">
                        {selected && (
                          <NumericFormat
                            customInput={TextField}
                            thousandSeparator=","
                            decimalSeparator="."
                            allowNegative={false}
                            value={selected.amount}
                            onValueChange={(values) => {
                              const numericValue = Number(values.value || 0);
                              const safeValue =
                                numericValue > remaining
                                  ? remaining
                                  : numericValue;
                              if (numericValue > remaining) {
                                toast.error(
                                  "Số tiền thanh toán không được lớn hơn số tiền còn lại"
                                );
                                handleAmountChange(order.id, 0);
                                return;
                              }
                              handleAmountChange(order.id, safeValue);
                            }}
                            inputProps={{ min: 0, max: remaining }}
                            size="small"
                            sx={{ width: "160px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {selected && (
                          <TextField
                            select
                            value={selected.payment_status || ""}
                            size="small"
                            sx={{ maxWidth: "240px", width: "240px" }}
                            onChange={(e) =>
                              handlePaymentTypeChange(order.id, e.target.value)
                            }
                          >
                            <MenuItem value={PaymentStatus.PAID}>
                              Thanh toán toàn bộ
                            </MenuItem>
                            <MenuItem value={PaymentStatus.PARTIALLY_PAID}>
                              Thanh toán một phần
                            </MenuItem>
                          </TextField>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {selected && (
                          <TextField
                            type="date"
                            size="small"
                            value={selected.payment_due_date}
                            onChange={(e) =>
                              handleDateChange(order.id, e.target.value)
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: "36px" }}
          >
            <TextField
              select
              label="Phương thức thanh toán"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              size="small"
              sx={{ width: "300px" }}
            >
              <MenuItem value={PaymentMethod.CASH}>Tiền mặt</MenuItem>
              <MenuItem value={PaymentMethod.BANK_TRANSFER}>
                Chuyển khoản
              </MenuItem>
            </TextField>

            <Typography>
              <strong>Tổng thanh toán:</strong>{" "}
              <strong>{formatCurrency(calcTotalAmount())}</strong>
            </Typography>

            <Button
              variant="contained"
              color="primary"
              disabled={selectedOrders.length === 0 ? true : false}
              onClick={handleSubmit}
            >
              Thanh toán các đơn đã chọn
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPaymentMultipleOrder;
