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
import { Controller, useForm } from "react-hook-form";
import { createProduct } from "../../../apis/productService";
import { ToastContext } from "../../../contexts/toastProvider";

import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../schema";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ModalCreateProduct = ({ open, setOpen, fetData, categories, units }) => {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      purchase_price: "",
      sell_price: "",
      category: null,
      unit: null,
      description: "",
      image: null,
    },
    resolver: yupResolver(schema),
  });

  const { toast } = useContext(ToastContext);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [preview, setPreview] = useState(null);
  const [errorFile, setErrorFile] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorFile(""); // Reset lỗi
    setPreview(null);

    if (!file) {
      setValue("image", null, { shouldValidate: true });
      return;
    }

    setValue("image", file, { shouldValidate: true });

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  };

  const handleCloseConfirmed = () => {
    setOpen(false);
    reset();
    setPreview(null);
    setErrorFile("");
  };

  const handleOnSubmit = async (dataSubmit) => {
    const formData = new FormData();
    formData.append("name", dataSubmit.name);
    formData.append("purchase_price", dataSubmit.purchase_price);
    formData.append("sell_price", dataSubmit.sell_price);
    formData.append("categoryId", dataSubmit.category);
    formData.append("unitId", dataSubmit.unit);
    if (dataSubmit.description) {
      formData.append("description", dataSubmit.description);
    }
    if (dataSubmit.image) {
      formData.append("file", dataSubmit.image);
    }

    setIsLoading(true);
    try {
      const res = await createProduct(formData);
      toast.success(res.data?.message || "Tạo sản phẩm thành công");
      setOpen(false);
      setPreview(null);
      setErrorFile("");
      fetData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tạo sản phẩm";
      console.error("Error creating product:", errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box>
      <BootstrapDialog
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: {
            width: "1000px",
            minHeight: "600px",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thêm sản phẩm mới
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
            component={"form"}
            id="product-form"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Tên sản phẩm"
                fullWidth
                size="small"
                variant="outlined"
                error={!!errors.name}
                {...register("name")}
                sx={{ mb: "10px" }}
              />
              {errors.name && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.name.message}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "20px",
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
                  {...register("purchase_price")}
                  sx={{ mb: "10px" }}
                />
                {errors.purchase_price && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.purchase_price.message}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", width: "50%" }}
              >
                <TextField
                  label="Giá bán"
                  fullWidth
                  type="number"
                  size="small"
                  variant="outlined"
                  error={!!errors.sell_price}
                  {...register("sell_price")}
                  sx={{ mb: "10px" }}
                />
                {errors.sell_price && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.sell_price.message}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "20px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      {...field}
                      options={units}
                      sx={{ mb: "10px" }}
                      size="small"
                      getOptionLabel={(option) => option.label || ""}
                      value={
                        units.find((option) => option.id === field.value) ||
                        null
                      }
                      onChange={(e, value) => {
                        field.onChange(value ? value.id : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Đơn vị tính"
                          error={!!fieldState.error}
                        />
                      )}
                    />
                  )}
                />
                {errors.unit && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.unit.message}
                  </Typography>
                )}
              </Box>

              <Box sx={{ width: "50%" }}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      {...field}
                      options={categories}
                      sx={{ mb: "10px" }}
                      value={
                        categories.find(
                          (option) => option.id === field.value
                        ) || null
                      }
                      size="small"
                      getOptionLabel={(option) => option.label || ""}
                      onChange={(e, value) =>
                        field.onChange(value ? value.id : null)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Danh mục"
                          error={!!fieldState.error}
                        />
                      )}
                    />
                  )}
                />
                {errors.category && (
                  <Typography variant="p" sx={{ color: "red" }}>
                    {errors.category.message}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                label="Mô tả sản phẩm"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={{ mb: 1 }}>Tải ảnh sản phẩm</Typography>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <Button variant="outlined" size="small">
                  Chọn file
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {errors.image && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {errors.image.message}
                  </Typography>
                )}
              </Box>
              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Xem trước ảnh:</Typography>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <CircularProgress size={"24px"} />
          ) : (
            <Button autoFocus type="submit" form="product-form">
              Lưu
            </Button>
          )}
        </DialogActions>

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
      </BootstrapDialog>
    </Box>
  );
};

export default ModalCreateProduct;
