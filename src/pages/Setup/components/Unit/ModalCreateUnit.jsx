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
import React, { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { ToastContext } from "../../../../contexts/toastProvider";
import { createUnit } from "../../../../apis/unitService";

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
const ModalCreateUnit = ({ open, setOpen, fetchData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const { toast } = useContext(ToastContext);
  // đóng modal thêm mới unit và reset input
  const handleCloseConfirmed = () => {
    setOpen(false);
    reset();
  };
  const handleOnSubmit = async (dataSubmit) => {
    try {
      const res = await createUnit(dataSubmit);
      toast.success(res.data?.message);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
    reset();
  };
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
          {"Thêm mới đơn vị tính"}
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
            id="unit-form"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Tên đơn vị tính"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                {...register("name", {
                  required: "Tên đơn vị tính là bắt buộc",
                })}
                sx={{ mb: "10px" }}
              />
              {errors.name && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.name.message}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="unit-form" autoFocus>
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

export default ModalCreateUnit;
