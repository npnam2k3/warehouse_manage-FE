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
import React, { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../../contexts/toastProvider";
import { Controller, useForm } from "react-hook-form";
import { getAllProductsHaveQuantityInWarehouse } from "../../../apis/productService";

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
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [quantityInWarehouse, setQuantityInWarehouse] = useState(0);

  const { toast } = useContext(ToastContext);

  const selectedProduct = watch("product");
  const selectedWarehouse = watch("warehouse");

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

  const fetchDataProductsHaveQuantityInWarehouse = async () => {
    try {
      const res = await getAllProductsHaveQuantityInWarehouse();
      setProducts(formattedProducts(res.data?.data));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  const formattedProducts = (products) => {
    return products.map((p) => {
      return {
        label: p.name,
        id: p.id,
        inventories: p.inventories,
        sell_price: p.sell_price,
        product_code: p.product_code,
      };
    });
  };

  useEffect(() => {
    fetchDataProductsHaveQuantityInWarehouse();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const warehouseList = selectedProduct?.inventories.map((p) => {
        return {
          label: p.warehouse?.name,
          id: p.warehouse?.id,
          quantity: p.quantity,
        };
      });
      setWarehouses(warehouseList);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedWarehouse) {
      setQuantityInWarehouse(selectedWarehouse?.quantity);
    }
  }, [selectedWarehouse, selectedProduct]);

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
                    // Reset các trường liên quan
                    setValue("warehouse", null);
                    setValue("quantity", "");
                    setQuantityInWarehouse(0);
                    if (value) {
                      setValue("sell_price", value?.sell_price || 0);
                    } else {
                      setValue("sell_price", "");
                    }
                  }}
                  options={products}
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
          {selectedProduct && (
            <Box>
              {selectedWarehouse && (
                <Typography sx={{ mb: "10px", fontWeight: "bold" }}>
                  Số lượng hiện tại trong {selectedWarehouse?.label} là{" "}
                  {quantityInWarehouse}
                </Typography>
              )}
              <Controller
                name="warehouse"
                control={control}
                defaultValue={null}
                rules={{ required: "Vui lòng chọn kho xuất hàng" }}
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
                        label="Kho xuất"
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
          )}
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
                  label="Giá bán"
                  fullWidth
                  type="number"
                  size="small"
                  variant="outlined"
                  error={!!errors.sell_price}
                  {...register("sell_price", {
                    required: "Vui lòng bán giá",
                    min: {
                      value: 0,
                      message: "Giá bán hợp lệ phải lớn hơn 0",
                    },
                    max: {
                      value: 100000000,
                      message:
                        "Giá bán của sản phẩm này quá lớn. Hãy kiểm tra lại",
                    },
                  })}
                  sx={{ mb: "10px" }}
                />
                {errors.sell_price && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.sell_price.message}
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
                      value: 1,
                      message: "Số lượng hợp lệ phải lớn hơn 1",
                    },
                    validate: (value) => {
                      if (!selectedWarehouse) return true; // Chưa chọn kho thì bỏ qua
                      if (parseInt(value) > selectedWarehouse.quantity) {
                        return `Số lượng vượt quá tồn kho hiện tại (${selectedWarehouse.quantity})`;
                      }
                      return true;
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
