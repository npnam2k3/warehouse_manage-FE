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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PASSWORD_REGEX } from "../../constant/regex";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../apis/authService";
import { ConfirmModalResetPass } from "./components/ConfirmModalResetPass";

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const newPass = watch("newPassword");
  const { token } = useParams();
  const handleOnSubmit = async (dataSubmit) => {
    const body = {
      newPassword: dataSubmit.newPassword,
      confirmPassword: dataSubmit.confirmPassword,
    };
    setIsLoading(true);
    try {
      const res = await resetPassword(body, token);
      localStorage.removeItem("accessToken");
      setMessage(res.data?.message);
      setOpenConfirmModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        background: "linear-gradient(to right, #74ebd5, #acb6e5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 360,
          minHeight: "280px",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Đặt lại mật khẩu mới
        </Typography>

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
          {isLoading ? <CircularProgress size={"24px"} /> : "Gửi email"}
        </Button>
      </Paper>
      <ConfirmModalResetPass
        message={message}
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
      />
    </Box>
  );
};

export default ResetPasswordPage;
