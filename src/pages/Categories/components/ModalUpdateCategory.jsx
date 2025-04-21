import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { ToastContext } from "../../../contexts/toastProvider";
import { update } from "../../../apis/categoryService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialog-paper": {
    width: "600px",
    borderRadius: 12,
  },
}));
const ModalUpdateCategory = ({ open, setOpen, fetchData, category }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const { toast } = useContext(ToastContext);
  // đóng modal thêm mới category và reset input
  const handleCloseConfirmed = () => {
    setOpen(false);
    reset();
  };
  const handleOnSubmit = async (dataSubmit) => {
    try {
      const res = await update(category.id, dataSubmit);
      toast.success(res.data?.message);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);
  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center" }}
          id="customized-dialog-title"
        >
          {"Cập nhật danh mục"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
          onClick={() => setOpenModalConfirm(true)}
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
            id="category-form"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Tên danh mục"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                {...register("name", {
                  required: "Tên danh mục là bắt buộc",
                })}
                sx={{ mb: "10px" }}
              />
              {errors.name && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.name.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                label="Mô tả của danh mục"
                fullWidth
                variant="outlined"
                error={!!errors.description}
                {...register("description", {})}
                sx={{ mb: "10px" }}
              />
              {errors.description && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.description.message}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="category-form" autoFocus>
            Lưu
          </Button>
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
    </>
  );
};

export default ModalUpdateCategory;
