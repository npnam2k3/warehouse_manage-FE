import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useState } from "react";
import { ToastContext } from "../../../contexts/toastProvider";
import { Controller, useForm } from "react-hook-form";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialog-paper": {
    width: "80%",
    maxWidth: "800px",
    height: "80%",
    borderRadius: 12,
  },
}));

const ModalSelectProductToAdd = ({
  open,
  setOpen,
  products,
  warehouses,
  setListProductsToAdd,
  listProductsToAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
  } = useForm({ mode: "onChange" });
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useContext(ToastContext);

  const selectedProduct = watch("product");

  const handleCloseConfirmed = () => {
    setOpen(false);
  };

  const handleOnSubmit = (dataSubmit) => {
    const checkDuplicate = listProductsToAdd.some(
      (pro) =>
        pro.product?.id === dataSubmit.product?.id &&
        pro.warehouse?.id === dataSubmit.warehouse?.id
    );
    if (checkDuplicate) {
      toast.error(
        `Sản phẩm ${dataSubmit.product?.label} trong ${dataSubmit.warehouse?.label} đã được chọn trước đó.`
      );
      reset({
        selectedProduct: null,
        warehouse: null,
      });
      return;
    }
    setListProductsToAdd((prev) => [...prev, dataSubmit]);
    setOpen(false);
  };

  return (
    <BootstrapDialog
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center" }}
        id="customized-dialog-title"
      >
        {"Chọn sản phẩm cho phiếu nhập"}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => setOpenModalConfirm(true)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Box
          sx={{}}
          component={"form"}
          id="add-product-form"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <Box sx={{ mb: "36px" }}>
            <Controller
              name="product"
              control={control}
              defaultValue={null}
              rules={{ required: "Vui lòng chọn sản phẩm" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{ mb: "10px" }}
                  size="small"
                  onChange={(_, value) => {
                    field.onChange(value);
                    if (value) {
                      setValue("purchase_price", value?.purchase_price || 0);
                    } else {
                      setValue("purchase_price", "");
                    }
                  }}
                  options={products}
                  noOptionsText="Nhà cung cấp này chưa có sản phẩm nào được thiết lập trước đó"
                  value={field.value || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sản phẩm"
                      error={!!errors.product}
                    />
                  )}
                />
              )}
            />
            {errors.product && (
              <Typography variant="p" sx={{ color: "red" }}>
                {errors.product.message}
              </Typography>
            )}
          </Box>
          <Box>
            <Controller
              name="warehouse"
              control={control}
              defaultValue={null}
              rules={{ required: "Vui lòng chọn kho nhập hàng" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{ mb: "10px" }}
                  size="small"
                  onChange={(_, value) => field.onChange(value)}
                  value={field.value || null}
                  options={warehouses}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kho nhập"
                      error={!!errors.warehouse}
                    />
                  )}
                />
              )}
            />
            {errors.warehouse && (
              <Typography variant="p" sx={{ color: "red" }}>
                {errors.warehouse.message}
              </Typography>
            )}
          </Box>
          {selectedProduct && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                mt: "36px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <TextField
                  label="Giá nhập"
                  fullWidth
                  type="number"
                  size="small"
                  variant="outlined"
                  error={!!errors.purchase_price}
                  {...register("purchase_price", {
                    required: "Vui lòng nhập giá",
                    min: {
                      value: 0,
                      message: "Giá nhập hợp lệ phải lớn hơn 0",
                    },
                    max: {
                      value: 100000000,
                      message:
                        "Giá nhập của sản phẩm này quá lớn. Hãy kiểm tra lại",
                    },
                  })}
                  sx={{ mb: "10px" }}
                />
                {errors.purchase_price && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.purchase_price.message}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <TextField
                  label="Số lượng"
                  fullWidth
                  type="number"
                  size="small"
                  variant="outlined"
                  error={!!errors.quantity}
                  {...register("quantity", {
                    required: "Vui lòng nhập số lượng",
                    min: {
                      value: 0,
                      message: "Số lượng hợp lệ phải lớn hơn 0",
                    },
                    max: {
                      value: 100000,
                      message:
                        "Số lượng của sản phẩm này quá lớn. Hãy kiểm tra lại",
                    },
                  })}
                  sx={{ mb: "10px" }}
                />
                {errors.quantity && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.quantity.message}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <CircularProgress size={"24px"} />
        ) : (
          <Button autoFocus type="submit" form="add-product-form">
            Lưu
          </Button>
        )}
      </DialogActions>

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
    </BootstrapDialog>
  );
};

export default ModalSelectProductToAdd;
