import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  EMAIL_REGEX,
  FULLNAME_REGEX,
  PHONE_REGEX,
} from "../../../constant/regex";
import { ToastContext } from "../../../contexts/toastProvider";
import { createCustomer } from "../../../apis/customerService";

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

export default function ModalCreateCustomer({
  open,
  setOpen,
  setPage,
  fetchData,
}) {
  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
  const { toast } = React.useContext(ToastContext);

  // đóng modal thêm mới customer và reset input
  const handleCloseConfirmed = () => {
    setOpen(false);
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: {} });
  const handleOnSubmit = async (dataSubmit) => {
    try {
      const res = await createCustomer(dataSubmit);
      toast.success(res.data?.message);
      setOpen(false);
      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
    reset();
  };

  return (
    <React.Fragment>
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
          {"Thêm mới khách hàng"}
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
            id="customer-form"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Tên khách hàng"
                fullWidth
                variant="outlined"
                error={!!errors.fullname}
                {...register("fullname", {
                  required: "Tên khách hàng là bắt buộc",
                  pattern: {
                    value: FULLNAME_REGEX,
                    message:
                      "Tên khách hàng chỉ được chứa chữ cái và khoảng trắng, không có số hoặc ký tự đặc biệt, không có khoảng trắng đầu hoặc cuối và không có khoảng trắng liên tiếp",
                  },
                  minLength: {
                    value: 2,
                    message: "Tên khách hàng tối thiểu 2 ký tự",
                  },
                  maxLength: {
                    value: 50,
                    message: "Tên khách hàng tối đa 50 ký tự",
                  },
                })}
                sx={{ mb: "10px" }}
              />
              {errors.fullname && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.fullname.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                sx={{ mb: "10px" }}
                label="Email"
                fullWidth
                error={!!errors.email}
                variant="outlined"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Email không hợp lệ",
                  },
                  minLength: {
                    value: 5,
                    message: "Email tối thiểu 5 ký tự",
                  },
                })}
              />
              {errors.email && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                sx={{ mb: "10px" }}
                label="Địa chỉ"
                fullWidth
                error={!!errors.address}
                variant="outlined"
                {...register("address", {
                  required: "Địa chỉ là bắt buộc",
                  minLength: {
                    value: 5,
                    message: "Địa chỉ tối thiểu 5 ký tự",
                  },
                  maxLength: {
                    value: 100,
                    message: "Địa chỉ tối đa 100 ký tự",
                  },
                })}
              />
              {errors.address && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.address.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                sx={{ mb: "10px" }}
                label="Số điện thoại"
                fullWidth
                error={!!errors.phone}
                variant="outlined"
                {...register("phone", {
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: PHONE_REGEX,
                    message: "Số điện thoại không hợp lệ",
                  },
                  //   maxLength: {
                  //     value: 10,
                  //     message: "Số điện thoại tối đa 10 ký tự",
                  //   },
                })}
              />
              {errors.phone && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.phone.message}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="customer-form" autoFocus>
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
    </React.Fragment>
  );
}
