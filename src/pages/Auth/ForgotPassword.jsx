import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { EMAIL_REGEX } from "../../constant/regex";
import { forgotPassword } from "../../apis/authService";
import { ToastContext } from "../../contexts/toastProvider";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useContext(ToastContext);
  const handleOnSubmit = async (dataSubmit) => {
    setIsLoading(true);
    try {
      const res = await forgotPassword(dataSubmit);
      toast.success(res.data?.message);
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
          Nhập email lấy lại mật khẩu
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          {...register("email", {
            required: "Email là bắt buộc",
            minLength: { value: 5, message: "Email tối thiểu 5 ký tự" },
            maxLength: { value: 30, message: "Email tối đa 30 ký tự" },
            pattern: { value: EMAIL_REGEX, message: "Email không hợp lệ." },
          })}
        />
        {errors.email && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.email.message}
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
    </Box>
  );
};

export default ForgotPassword;
