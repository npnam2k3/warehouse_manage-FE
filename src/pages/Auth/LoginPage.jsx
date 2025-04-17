import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { getProfile, login } from "../../apis/authService";
import { ToastContext } from "../../contexts/toastProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useContext(ToastContext);
  const { setProfile } = useContext(AuthContext);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleOnSubmit = async (dataSubmit) => {
    setIsLoading(true);
    try {
      const res = await login(dataSubmit);
      const { data } = res.data;
      localStorage.setItem("accessToken", data.accessToken);

      const profileRes = await getProfile();
      setProfile(profileRes.data.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message);
      reset();
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
          minHeight: "380px",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập
        </Typography>

        <TextField
          fullWidth
          label="Tên đăng nhập"
          margin="normal"
          variant="outlined"
          {...register("username", {
            required: "Tên đăng nhập là bắt buộc",
            minLength: { value: 5, message: "Tên đăng nhập tối thiểu 5 ký tự" },
            maxLength: { value: 20, message: "Tên đăng nhập tối đa 20 ký tự" },
          })}
        />
        {errors.username && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.username.message}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("password", {
            required: "Mật khẩu là bắt buộc",
            minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            maxLength: { value: 30, message: "Mật khẩu tối đa 30 ký tự" },
          })}
        />
        {errors.password && (
          <Typography variant="p" sx={{ color: "red" }}>
            {errors.password.message}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, borderRadius: 2, p: "10px" }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={"24px"} /> : "Đăng nhập"}
        </Button>

        {/* Quên mật khẩu */}
        <Box textAlign="right" sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "primary.dark",
                textDecoration: "underline",
              },
            }}
            component={Link}
            to={"/forgotPassword"}
          >
            Quên mật khẩu?
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
