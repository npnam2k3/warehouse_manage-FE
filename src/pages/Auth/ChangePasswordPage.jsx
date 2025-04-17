import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { PASSWORD_REGEX } from "../../constant/regex";
import { changePassword, logout } from "../../apis/authService";
import { ConfirmModal } from "./components/ConfirmModal";
import { ToastContext } from "../../contexts/toastProvider";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleToggleOldPassword = () => setShowOldPassword((prev) => !prev);
  const handleToggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const newPass = watch("newPassword");
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleOnSubmit = async (dataSubmit) => {
    const body = {
      currentPassword: dataSubmit.oldPassword,
      newPassword: dataSubmit.newPassword,
      confirmPassword: dataSubmit.confirmPassword,
    };
    setIsLoading(true);
    try {
      const res = await changePassword(body);
      setMessage(res.data?.message);
      setOpenConfirmModal(true);
    } catch (e) {
      toast.error(e.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
      }}
      component={"form"}
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 360,
          minHeight: "380px",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Đổi mật khẩu
        </Typography>

        <TextField
          fullWidth
          label="Mật khẩu cũ"
          margin="normal"
          variant="outlined"
          type={showOldPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleOldPassword} edge="end">
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("oldPassword", {
            required: "Mật khẩu cũ là bắt buộc",
            minLength: { value: 6, message: "Mật khẩu cũ tối thiểu 6 ký tự" },
            maxLength: { value: 30, message: "Mật khẩu cũ tối đa 30 ký tự" },
          })}
        />
        {errors.oldPassword && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.oldPassword.message}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Mật khẩu mới"
          type={showNewPassword ? "text" : "password"}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleNewPassword} edge="end">
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("newPassword", {
            required: "Mật khẩu mới là bắt buộc",
            pattern: {
              value: PASSWORD_REGEX,
              message:
                "Mật khẩu mới phải có ít nhất 1 chữ hoa, 3 chữ thường, 1 số, 1 ký tự đặc biệt và không chứa khoảng trắng và không dấu",
            },
            minLength: { value: 6, message: "Mật khẩu mới tối thiểu 6 ký tự" },
            maxLength: { value: 30, message: "Mật khẩu mới tối đa 30 ký tự" },
          })}
        />
        {errors.newPassword && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.newPassword.message}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Xác nhận mật khẩu mới"
          type={showConfirmPassword ? "text" : "password"}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("confirmPassword", {
            required: "Mật khẩu xác nhận là bắt buộc",
            validate: (value) =>
              value === newPass || "Mật khẩu xác nhận không khớp",
          })}
        />
        {errors.confirmPassword && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.confirmPassword.message}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, borderRadius: 2, p: "10px" }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={"24px"} /> : "Đổi mật khẩu"}
        </Button>
      </Paper>

      <ConfirmModal
        message={message}
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        handleLogout={handleLogout}
      />
    </Box>
  );
};

export default ChangePasswordPage;
