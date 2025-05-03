import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Grid,
} from "@mui/material";
import React, { forwardRef } from "react";
import { formatCurrency } from "../../../utils/formatMoney";
import { formatVietnameseDate } from "../../../utils/handleDateTime";
import { convertCurrencyToWords } from "../../../utils/numberToText";

const ModalContentPrint = forwardRef(({ order }, ref) => {
  if (
    !order ||
    !order.export_order_details ||
    !Array.isArray(order.export_order_details)
  ) {
    return (
      <Box ref={ref} sx={{ padding: 4 }}>
        <Typography>Không có dữ liệu để in</Typography>
      </Box>
    );
  }

  const totalQuantity = order.export_order_details?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = order.export_order_details?.reduce(
    (sum, item) => sum + item.quantity * item.sell_price,
    0
  );

  return (
    <Box
      ref={ref}
      sx={{
        padding: 4,
        fontFamily: "Arial",
        color: "#000",
        fontSize: 14,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          CÔNG TY TNHH TM TỔNG HỢP QUANG MINH
        </Typography>
        <Typography>
          Địa chỉ: Số 40, Vũ Xuân Thiều, P.Sài Đồng, Long Biên
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          PHIẾU XUẤT KHO BÁN HÀNG
        </Typography>
        <Typography>{formatVietnameseDate(order.createdAt)}</Typography>
        <Typography>Số phiếu xuất: {order?.export_order_code}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography>
          <strong>Tên khách hàng: </strong> {order?.customer?.fullname}
        </Typography>
        <Typography>
          <strong>Địa chỉ: </strong> {order?.customer?.address}
        </Typography>
        <Typography>
          <strong>Số điện thoại: </strong> {order?.customer?.phone}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Product Table */}
      <Table size="small" sx={{ border: "1px solid #000" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell align="center">STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell align="right">Số lượng</TableCell>
            <TableCell align="right">Đơn giá</TableCell>
            <TableCell align="right">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.export_order_details.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{item.product?.product_code}</TableCell>
              <TableCell>{item.product?.name}</TableCell>
              <TableCell>{item.product?.unit?.name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">
                {formatCurrency(item.sell_price)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(item.quantity * item.sell_price)}
              </TableCell>
            </TableRow>
          ))}
          {/* Total row */}
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ fontWeight: "bold" }}>
              Tổng
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {totalQuantity}
            </TableCell>
            <TableCell />
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {formatCurrency(totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Tổng tiền bằng chữ */}
      <Box sx={{ mt: 2 }}>
        <Typography>
          <strong>Tổng tiền bằng chữ:</strong>{" "}
          {convertCurrencyToWords(totalAmount)}
        </Typography>
      </Box>

      {/* Chữ ký */}
      <Grid container spacing={2} sx={{ mt: 6, textAlign: "center" }}>
        <Grid item xs={4}>
          <Typography>
            <strong>Người mua hàng</strong>
          </Typography>
          <Typography>(Ký, ghi rõ họ tên)</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <strong>Thủ kho</strong>
          </Typography>
          <Typography>(Ký, ghi rõ họ tên)</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <strong>Người lập phiếu</strong>
          </Typography>
          <Typography>(Ký, ghi rõ họ tên)</Typography>
        </Grid>
      </Grid>
    </Box>
  );
});

export default ModalContentPrint;
