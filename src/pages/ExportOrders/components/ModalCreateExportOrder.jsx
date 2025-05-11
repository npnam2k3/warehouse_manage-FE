import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Slide,
  TextField,
  Typography,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { formatCurrency } from "../../../utils/formatMoney";
import { Controller, useForm } from "react-hook-form";
import { ToastContext } from "../../../contexts/toastProvider";
import { PaymentStatus } from "../../../constant/order";
import { createExportOrder } from "../../../apis/exportOrderService";
import { getAllCustomersNoPagination } from "../../../apis/customerService";
import ModalSelectProductToAdd from "./ModalSelectProductToAdd";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ModalCreateExportOrder = ({ open, setOpen, setPage, fetchData }) => {
  const {
    register,
    control,
    formState: { errors },
    setError,
    handleSubmit,
    clearErrors,
  } = useForm({ mode: "onChange" });
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [listProductsToAdd, setListProductsToAdd] = useState([]);
  const [openModalSelectProductToAdd, setOpenModalSelectProductToAdd] =
    useState(false);
  const [customers, setCustomers] = useState([]);

  const { toast } = useContext(ToastContext);

  const handleCloseConfirmed = () => {
    setOpen(false);
  };
  const handleOnSubmit = async (dataSubmit) => {
    const listProducts = listProductsToAdd.map((pro) => {
      return {
        productId: pro.product?.id,
        warehouseId: pro.warehouse?.id,
        sell_price: pro.sell_price,
        quantity: +pro.quantity,
      };
    });
    const payload = {
      payment_status: PaymentStatus.UNPAID,
      customerId: dataSubmit.customer?.id,
      payment_due_date: dataSubmit.payment_due_date,
      note: dataSubmit.note,
      listProducts,
    };

    try {
      const res = await createExportOrder(payload);
      toast.success(res.data?.message);
      setOpen(false);
      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail[0]?.message);
    }
  };

  const handleClickSelectProductBtn = async () => {
    setOpenModalSelectProductToAdd(true);
  };

  const handleClickDeleteSelectedProduct = (item) => {
    setListProductsToAdd(
      listProductsToAdd.filter(
        (pro) =>
          `${pro.product?.id}-${pro.warehouse?.id}` !==
          `${item.product?.id}-${item.warehouse?.id}`
      )
    );
  };

  const fetchDataCustomers = async () => {
    try {
      const res = await getAllCustomersNoPagination();
      setCustomers(formatDataCustomers(res.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const formatDataCustomers = (customers) => {
    return customers.map((customer) => {
      return {
        label: customer?.fullname,
        id: customer?.id,
      };
    });
  };

  const calcTotalQuantity = () =>
    listProductsToAdd.reduce((acc, curr) => acc + +curr.quantity, 0);

  const calcTotalPrice = () =>
    listProductsToAdd.reduce(
      (acc, curr) => acc + +curr.quantity * curr.sell_price,
      0
    );

  useEffect(() => {
    fetchDataCustomers();
  }, []);

  useEffect(() => {
    if (listProductsToAdd.length === 0) {
      setError("productsEmpty", {
        type: "manual",
        message: "Chưa chọn sản phẩm nào để tạo phiếu xuất",
      });
    } else {
      clearErrors("productsEmpty");
    }
  }, [listProductsToAdd]);

  useEffect(() => {
    calcTotalQuantity();
    calcTotalPrice();
  }, [listProductsToAdd]);
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      TransitionComponent={Transition}
    >
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          padding: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Tạo phiếu xuất hàng
        </Typography>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          component={"form"}
          id="order-form"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          {/* Thông tin cơ bản */}
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ mb: "20px" }}
            >
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: "16px" }}
                  fontWeight="bold"
                  gutterBottom
                >
                  Khách hàng (*)
                </Typography>
                <Controller
                  name="customer"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Vui lòng chọn khách hàng" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      size="small"
                      sx={{ mb: "10px" }}
                      onChange={(_, value) => field.onChange(value)}
                      value={field.value || null}
                      options={customers}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Khách hàng"
                          error={!!errors.customer}
                        />
                      )}
                    />
                  )}
                />
                {errors.customer && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.customer.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: "16px" }}
                  fontWeight="bold"
                  gutterBottom
                >
                  Ngày gia hạn thanh toán (*)
                </Typography>
                <TextField
                  type="date"
                  sx={{ mb: "10px" }}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ placeholder: "" }}
                  error={!!errors.payment_due_date}
                  {...register("payment_due_date", {
                    required: "Ngày gia hạn thanh toán là bắt buộc",
                  })}
                />
                {errors.payment_due_date && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.payment_due_date.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ mb: "16px" }}
                  fontWeight="bold"
                  gutterBottom
                >
                  Ghi chú
                </Typography>
                <TextField
                  label="Ghi chú"
                  {...register("note", {})}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Danh sách sản phẩm */}
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "16px",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Danh sách sản phẩm
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={handleClickSelectProductBtn}
              >
                <Add sx={{ size: "10px" }} />
                <Typography variant="span">Chọn sản phẩm</Typography>
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá bán</TableCell>
                  <TableCell>Kho lưu trữ</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {listProductsToAdd.length > 0 ? (
                  listProductsToAdd.map((pro) => (
                    <TableRow key={`${pro.product?.id}-${pro.warehouse?.id}`}>
                      <TableCell>{pro.product?.product_code}</TableCell>
                      <TableCell>{pro.product?.label}</TableCell>
                      <TableCell>{pro.quantity}</TableCell>
                      <TableCell>{formatCurrency(pro.sell_price)}</TableCell>
                      <TableCell>{pro.warehouse?.label}</TableCell>
                      <TableCell>
                        {formatCurrency(+pro.quantity * pro.sell_price)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleClickDeleteSelectedProduct(pro)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Chưa có sản phẩm
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {errors.productsEmpty && (
              <Typography
                component="div"
                sx={{ color: "red", textAlign: "center", mt: "10px" }}
              >
                {errors.productsEmpty.message}
              </Typography>
            )}
          </Paper>

          {/* Tổng kết */}
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tổng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  Tổng số lượng sản phẩm: <strong>{calcTotalQuantity()}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  Tổng tiền hóa đơn:{" "}
                  <strong>{formatCurrency(calcTotalPrice())}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Nút hành động */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenModalConfirm(true)}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="order-form"
            >
              Lưu phiếu nhập
            </Button>
          </Box>
        </Box>

        {/* modal select product to add */}
        {openModalSelectProductToAdd && (
          <ModalSelectProductToAdd
            open={openModalSelectProductToAdd}
            setOpen={setOpenModalSelectProductToAdd}
            setListProductsToAdd={setListProductsToAdd}
            listProductsToAdd={listProductsToAdd}
          />
        )}
        {/* modal confirm close */}
        <Dialog
          open={openModalConfirm}
          onClose={(event, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              return;
            }
            setOpenModalConfirm(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có chắc muốn đóng biểu mẫu?"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bạn sẽ mất toàn bộ dữ liệu đang nhập nếu tiếp tục.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalConfirm(false)}>Hủy</Button>
            <Button
              onClick={() => {
                setOpenModalConfirm(false);
                handleCloseConfirmed();
              }}
              autoFocus
            >
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Dialog>
  );
};

export default ModalCreateExportOrder;
