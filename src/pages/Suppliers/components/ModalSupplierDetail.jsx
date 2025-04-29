import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { formatCurrency } from "../../../utils/formatMoney";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { formattedDateTime } from "../../../utils/handleDateTime";
import TableProductOfSupplier from "./TableProductOfSupplier";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../../constant/order";

const ModalSupplierDetail = ({ supplier, open, setOpen, fetchData }) => {
  const [openDetails, setOpenDetails] = useState({}); // lưu trạng thái đóng mở của mỗi colapse ứng với từng hóa đơn. VD: {'1': true, '2': false}

  const toggleDetail = (orderId) => {
    setOpenDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };
  // console.log(openDetails);

  if (!supplier) return null;

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpenDetails({});
        setOpen(false);
      }}
      maxWidth="md"
      fullScreen
    >
      <DialogTitle>Thông tin chi tiết nhà cung cấp</DialogTitle>
      <DialogContent dividers>
        {/* Thông tin cơ bản */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin nhà cung cấp
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography>Tên nhà cung cấp: {supplier.name_company}</Typography>
              <Typography>Email: {supplier.email}</Typography>
              <Typography>Số điện thoại: {supplier.phone}</Typography>
              <Typography>Địa chỉ: {supplier.address}</Typography>
              <Typography
                sx={{
                  color:
                    supplier.total_debt > 0 ? "error.main" : "text.primary",
                }}
              >
                Công nợ hiện tại: {formatCurrency(supplier.total_debt)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <TableProductOfSupplier
          listProducts={supplier.listProducts}
          supplier={supplier}
          fetchData={fetchData}
        />

        {/* Lịch sử giao dịch */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Lịch sử giao dịch
            </Typography>
            {supplier.listOrders?.length ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="center">Mã hóa đơn</TableCell>
                    <TableCell align="center">Ngày tạo</TableCell>
                    <TableCell align="center">Tổng tiền</TableCell>
                    <TableCell align="center">Số tiền đã thanh toán</TableCell>
                    <TableCell align="center">Số tiền còn lại</TableCell>
                    <TableCell align="center">Trạng thái thanh toán</TableCell>
                    <TableCell align="center">Trạng thái hoá đơn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplier.listOrders.map((order) => (
                    <React.Fragment key={order.idOrder}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleDetail(order.idOrder)}
                          >
                            {openDetails[order.idOrder] ? (
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

                      {/* Chi tiết hóa đơn */}
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={5}
                        >
                          <Collapse
                            in={openDetails[order.idOrder]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              margin={2}
                              sx={{
                                width: "100%",
                                maxWidth: "800px",
                                margin: "0 auto",
                                padding: 2,
                                paddingLeft: { xs: 2, sm: 6 },
                              }}
                            >
                              {/* Danh sách sản phẩm */}
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
                              {order.list_product_in_order?.length ? (
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
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.list_product_in_order.map(
                                      (product, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">
                                            {product.product_code}
                                          </TableCell>
                                          <TableCell align="center">
                                            {product.name}
                                          </TableCell>
                                          <TableCell align="center">
                                            {product.quantity}
                                          </TableCell>
                                          <TableCell align="center">
                                            {formatCurrency(
                                              product.purchase_price
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
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

                              {/* Danh sách thanh toán */}
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{
                                  mt: "30px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                Danh sách các lần thanh toán
                              </Typography>
                              {order.list_payments?.length ? (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">
                                        Ngày thanh toán
                                      </TableCell>
                                      <TableCell align="center">
                                        Phương thức thanh toán
                                      </TableCell>
                                      <TableCell align="center">
                                        Số tiền
                                      </TableCell>
                                      <TableCell align="center">
                                        Nhân viên thực hiện thanh toán
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.list_payments.map(
                                      (payment, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">
                                            {formattedDateTime(
                                              payment.payment_date
                                            )}
                                          </TableCell>
                                          <TableCell align="center">
                                            {
                                              PAYMENT_METHOD[
                                                payment.payment_method
                                              ]
                                            }
                                          </TableCell>
                                          <TableCell align="center">
                                            {formatCurrency(payment.amount)}
                                          </TableCell>
                                          <TableCell align="center">
                                            {payment?.userCreated?.fullname}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Chưa có thanh toán nào.
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
      <DialogActions>
        <Button
          onClick={() => {
            setOpenDetails({});
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

export default ModalSupplierDetail;
