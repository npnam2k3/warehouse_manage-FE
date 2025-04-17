import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          maxWidth: 600,
          textAlign: "center",
          boxShadow: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          403 - Forbidden
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ với quản trị
          viên để cấp quyền hoặc di chuyển đến trang khác.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            marginTop: 2,
            textDecoration: "none",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          Quay lại trang chủ
        </Button>
      </Paper>
    </Box>
  );
};

export default ForbiddenPage;
