import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  EMAIL_REGEX,
  FULLNAME_REGEX,
  USERNAME_REGEX,
} from "../../../constant/regex";
import { updateUser } from "../../../apis/userService";
import { ToastContext } from "../../../contexts/toastProvider";
import { useEffect } from "react";

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

export default function ModalUpdateUser({
  open,
  setOpen,
  setPage,
  fetchData,
  user,
}) {
  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
  const { toast } = React.useContext(ToastContext);

  // đóng modal thêm mới user và reset input
  const handleCloseConfirmed = () => {
    setOpen(false);
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: { role: "" } });
  const handleOnSubmit = async (dataSubmit) => {
    console.log(dataSubmit);
    try {
      const res = await updateUser(user.id, dataSubmit);
      toast.success(res.data?.message);
      setOpen(false);
      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role?.name?.toLowerCase(),
      });
    }
  }, [user]);

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center" }}
          id="customized-dialog-title"
        >
          {"Cập nhật người dùng"}
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
            id="user-form"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Tên đăng nhập"
                fullWidth
                variant="outlined"
                error={!!errors.username}
                {...register("username", {
                  required: "Tên đăng nhập là bắt buộc",
                  pattern: {
                    value: USERNAME_REGEX,
                    message:
                      "Tên đăng nhập cho phép số và chữ cái viết liền không dấu, không chứa khoảng trắng, không chứa ký tự đặc biệt",
                  },
                  minLength: {
                    value: 5,
                    message: "Tên đăng nhập tối thiểu 5 ký tự",
                  },
                  maxLength: {
                    value: 20,
                    message: "Tên đăng nhập tối đa 20 ký tự",
                  },
                })}
                sx={{ mb: "10px" }}
              />
              {errors.username && (
                <Typography variant="p" sx={{ color: "red" }}>
                  {errors.username.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                sx={{ mb: "10px" }}
                label="Họ và tên"
                fullWidth
                error={!!errors.fullname}
                variant="outlined"
                {...register("fullname", {
                  required: "Họ và tên là bắt buộc",
                  pattern: {
                    value: FULLNAME_REGEX,
                    message:
                      "Họ tên chỉ được chứa chữ cái và khoảng trắng, không có số hoặc ký tự đặc biệt, không có khoảng trắng đầu hoặc cuối và không có khoảng trắng liên tiếp",
                  },
                  minLength: {
                    value: 5,
                    message: "Họ và tên tối thiểu 5 ký tự",
                  },
                  maxLength: {
                    value: 20,
                    message: "Họ và tên tối đa 20 ký tự",
                  },
                })}
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
            <FormControl sx={{ width: "50%" }} error={!!errors.role}>
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Controller
                name="role"
                control={control}
                // rules={{ required: "Bạn chưa chọn vai trò của người dùng" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="role-label"
                    id="role-select"
                    label="Vai trò"
                  >
                    <MenuItem value={"admin"}>Quản lý</MenuItem>
                    <MenuItem value={"warehouse_manager"}>Thủ kho</MenuItem>
                    <MenuItem value={"accountant"}>Kế toán</MenuItem>
                  </Select>
                )}
              />
              {errors.role && (
                <Typography variant="body2" sx={{ color: "red", mt: 0.5 }}>
                  {errors.role.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="user-form" autoFocus>
            Cập nhật
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
