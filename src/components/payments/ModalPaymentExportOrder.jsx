import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  PaymentMethod,
  PaymentStatus,
  TypePayment,
} from "../../constant/order";
import { createPayment } from "../../apis/paymentService";
import { ToastContext } from "../../contexts/toastProvider";

const ModalPaymentExportOrder = ({
  open,
  setOpen,
  export_order,
  fetchData,
  setPage,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    register,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      amount: "",
      payment_method: "",
      payment_type: "",
      payment_due_date: "",
    },
    mode: "onChange",
  });

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const paymentType = watch("payment_type");

  const { toast } = useContext(ToastContext);

  const handleCloseConfirmed = () => {
    setOpen(false);
  };
  const handleOnSubmit = async (dataSubmit) => {
    if (
      dataSubmit.payment_type === PaymentStatus.PAID &&
      dataSubmit.amount < export_order?.amount_due
    ) {
      setError("amount_invalid", {
        type: "manual",
        message: `Số tiền phải thanh toán toàn bộ là ${export_order?.amount_due}`,
      });
      return;
    }
    const payload = {
      type: TypePayment.EXPORT,
      list_orders: [
        {
          order_id: export_order?.id,
          amount: dataSubmit.amount,
          payment_status: dataSubmit.payment_type,
          payment_due_date:
            dataSubmit.payment_type === PaymentStatus.PARTIALLY_PAID
              ? dataSubmit.payment_due_date
              : "",
        },
      ],
      payment_method: dataSubmit.payment_method,
    };

    try {
      const res = await createPayment(payload);
      toast.success(res.data?.message);

      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (
      watch("amount") >= export_order?.amount_due &&
      watch("payment_type") === PaymentStatus.PAID
    ) {
      clearErrors("amount_invalid");
    }
  }, [watch("amount"), watch("payment_type")]);
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // chặn đóng khi click ra ngoài hoặc nhấn ESC
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        setOpen(false);
      }}
      PaperProps={{
        sx: { width: "600px", maxWidth: "90%", p: "10px" },
      }}
    >
      <DialogTitle>
        Thanh toán hóa đơn có mã:{" "}
        <strong>{export_order?.export_order_code}</strong>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Đã trả: <strong>{export_order?.amount_paid}</strong>
        </Typography>
        <Typography>
          Còn lại: <strong>{export_order?.amount_due}</strong>
        </Typography>

        <Box
          component={"form"}
          id="payment-form"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <Box sx={{ mb: "24px" }}>
            <TextField
              label="Số tiền thanh toán"
              type="number"
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.amount}
              {...register("amount", {
                required: "Số tiền thanh toán là bắt buộc",
                min: {
                  value: 1,
                  message: "Số tiền thanh toán phải lớn hơn hoặc bằng 1",
                },
                max: {
                  value: export_order?.amount_due || 0,
                  message: `Số tiền thanh toán không được vượt quá số tiền đang nợ: ${export_order?.amount_due}`,
                },
              })}
            />
            {errors.amount_invalid && (
              <Typography variant="p" sx={{ color: "red", display: "block" }}>
                {errors.amount_invalid.message}
              </Typography>
            )}
            {errors.amount && (
              <Typography variant="p" sx={{ color: "red" }}>
                {errors.amount.message}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Controller
                name="payment_method"
                control={control}
                rules={{ required: "Chọn phương thức thanh toán" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Phương thức thanh toán"
                    fullWidth
                    size="small"
                    error={!!errors.payment_method}
                    sx={{ mb: "8px" }}
                  >
                    <MenuItem value={PaymentMethod.CASH}>Tiền mặt</MenuItem>
                    <MenuItem value={PaymentMethod.BANK_TRANSFER}>
                      Chuyển khoản
                    </MenuItem>
                  </TextField>
                )}
              />
              {errors.payment_method && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.payment_method.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <Controller
                name="payment_type"
                control={control}
                rules={{ required: "Chọn hình thức thanh toán" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Hình thức thanh toán"
                    fullWidth
                    size="small"
                    error={!!errors.payment_type}
                    sx={{ mb: "8px" }}
                  >
                    <MenuItem value={PaymentStatus.PAID}>
                      Thanh toán toàn bộ
                    </MenuItem>
                    <MenuItem value={PaymentStatus.PARTIALLY_PAID}>
                      Thanh toán một phần
                    </MenuItem>
                  </TextField>
                )}
              />
              {errors.payment_type && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.payment_type.message}
                </Typography>
              )}
            </Box>
          </Box>

          {paymentType === PaymentStatus.PARTIALLY_PAID && (
            <Box sx={{ mt: "12px" }}>
              <TextField
                size="small"
                label="Ngày gia hạn"
                type="date"
                fullWidth
                margin="normal"
                error={!!errors.payment_due_date}
                sx={{ mb: "8px" }}
                InputLabelProps={{ shrink: true }}
                {...register("payment_due_date", {
                  required: "Ngày gia hạn bắt buộc",
                })}
              />
              {errors.payment_due_date && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.payment_due_date.message}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ mt: "40px" }}>
        <Button onClick={() => setOpenModalConfirm(true)}>Hủy</Button>
        <Button variant="contained" type="submit" form="payment-form">
          Xác nhận
        </Button>
      </DialogActions>

      {/* modal confirm */}
      <Dialog
        open={openModalConfirm}
        onClose={(event, reason) => {
          // chặn đóng khi click ra ngoài hoặc nhấn ESC
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
              handleCloseConfirmed(); // gọi hàm thực sự để đóng modal + reset
            }}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ModalPaymentExportOrder;
