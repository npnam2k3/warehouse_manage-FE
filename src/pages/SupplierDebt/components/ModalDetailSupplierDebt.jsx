import {
  Box,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import React, { useState } from "react";
import { formattedDateTime } from "../../../utils/handleDateTime";
import { formatCurrency } from "../../../utils/formatMoney";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../constant/order";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const ModalDetailSupplierDebt = ({ supplierDebt, open, setOpen }) => {
  const [openDetails, setOpenDetails] = useState({});

  const toggleDetail = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Chi tiết công nợ nhà cung cấp:{" "}
        <strong>{supplierDebt?.name_company}</strong>
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
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tổng nợ hiện tại:{" "}
              <span style={{ color: "red" }}>
                {formatCurrency(supplierDebt?.totalDebt)}
              </span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Danh sách các hóa đơn còn nợ
            </Typography>
            {supplierDebt?.importOrders?.length ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="center">Mã hóa đơn</TableCell>
                    <TableCell align="center">Ngày tạo</TableCell>
                    <TableCell align="center">Tổng tiền</TableCell>
                    <TableCell align="center">Số tiền đã thanh toán</TableCell>
                    <TableCell align="center">Số tiền còn lại</TableCell>
                    <TableCell align="center">
                      Ngày đến hạn thanh toán
                    </TableCell>
                    <TableCell align="center">Trạng thái thanh toán</TableCell>
                    <TableCell align="center">Trạng thái hoá đơn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplierDebt?.importOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleDetail(order.id)}
                          >
                            {openDetails[order.id] ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          {order.import_order_code}
                        </TableCell>
                        <TableCell align="center">
                          {formattedDateTime(order.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell align="center">
                          {formatCurrency(order.amount_paid)}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            color:
                              order.amount_due > 0 ? "error.main" : "inherit",
                          }}
                        >
                          {formatCurrency(order.amount_due)}
                        </TableCell>
                        <TableCell align="center">
                          {formattedDateTime(order.payment_due_date)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={PAYMENT_STATUS[order.payment_status]}
                            color={
                              order.payment_status === "PAID"
                                ? "success"
                                : order.payment_status === "PARTIALLY_PAID"
                                ? "warning"
                                : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={ORDER_STATUS[order.order_status]}
                            color={
                              order.order_status === "COMPLETED"
                                ? "success"
                                : order.order_status === "PROCESSING"
                                ? "warning"
                                : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={8}
                        >
                          <Collapse
                            in={openDetails[order.id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                width: "100%",
                                padding: 2,
                                pl: { xs: 2, sm: 6 },
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                Danh sách sản phẩm
                              </Typography>
                              {order.import_order_details?.length ? (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">
                                        Mã sản phẩm
                                      </TableCell>
                                      <TableCell align="center">
                                        Tên sản phẩm
                                      </TableCell>
                                      <TableCell align="center">
                                        Số lượng
                                      </TableCell>
                                      <TableCell align="center">
                                        Đơn giá
                                      </TableCell>
                                      <TableCell align="center">
                                        Thành tiền
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.import_order_details.map(
                                      (product, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">
                                            {product?.product?.product_code}
                                          </TableCell>
                                          <TableCell align="center">
                                            {product?.product?.name}
                                          </TableCell>
                                          <TableCell align="center">
                                            {product.quantity}
                                          </TableCell>
                                          <TableCell align="center">
                                            {formatCurrency(
                                              product.purchase_price
                                            )}
                                          </TableCell>
                                          <TableCell align="center">
                                            {formatCurrency(
                                              product.purchase_price *
                                                product.quantity
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}

                                    <TableRow sx={{ fontWeight: "bold" }}>
                                      <TableCell colSpan={2} align="center">
                                        <strong>Tổng cộng</strong>
                                      </TableCell>

                                      <TableCell align="center">
                                        <strong>
                                          {order.import_order_details.reduce(
                                            (sum, p) =>
                                              sum + Number(p.quantity),
                                            0
                                          )}
                                        </strong>
                                      </TableCell>
                                      <TableCell />
                                      <TableCell align="center">
                                        <strong>
                                          {formatCurrency(
                                            order.import_order_details.reduce(
                                              (sum, p) =>
                                                sum +
                                                p.quantity * p.purchase_price,
                                              0
                                            )
                                          )}
                                        </strong>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Không có sản phẩm nào.
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>Nhà cung cấp chưa có giao dịch nào.</Typography>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSupplierDebt;
