import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { profile } = useContext(AuthContext);
  const user = {
    fullName: profile.fullname,
    email: profile.email,
    username: profile.username,
    role: profile.role.name,
  };
  return (
    <Grid2 container justifyContent="center" sx={{ mt: 5 }}>
      <Grid2 item xs={12} md={8}>
        <Card
          sx={{
            maxWidth: 700,
            mx: "auto",
            p: 3,
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          <CardHeader
            title="THÔNG TIN CÁ NHÂN"
            sx={{ textAlign: "center", mb: 2 }}
            titleTypographyProps={{ fontWeight: "bold", fontSize: "1.6rem" }}
          />
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {user.fullName}
            </Typography>
          </Stack>

          <CardContent>
            <Grid2 container spacing={4}>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  📧 Email
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize="1rem"
                  sx={{ textAlign: "center" }}
                >
                  {user.email}
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  🧑 Tên đăng nhập
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize="1rem"
                  sx={{ textAlign: "center" }}
                >
                  {user.username}
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  🎓 Vai trò
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize="1rem"
                  sx={{ textAlign: "center" }}
                >
                  {user.role}
                </Typography>
              </Grid2>
            </Grid2>
          </CardContent>

          <Divider sx={{ mt: 3 }} />
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={"/changePassword"}
            >
              Đổi mật khẩu
            </Button>
          </Stack>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default ProfilePage;
