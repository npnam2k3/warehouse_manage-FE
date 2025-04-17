import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../apis/authService";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();
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
    <AppBar
      position="sticky"
      color="primary"
      elevation={1}
      sx={{ height: "64px" }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          HỆ THỐNG QUẢN LÝ KHO
        </Typography>
        {/* <Badge
          badgeContent={4}
          color="error"
          sx={{ cursor: "pointer", marginRight: "15px" }}
        >
          <NotificationsIcon />
        </Badge> */}
        <IconButton onClick={() => setIsOpen(true)}>
          <Avatar sx={{ bgcolor: "#fff", color: "#60B5FF" }}>
            {profile?.fullname?.substr(0, 2).toUpperCase()}
          </Avatar>
        </IconButton>
      </Toolbar>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          marginTop: "46px",
        }}
        PaperProps={{
          sx: {
            width: "200px",
          },
        }}
      >
        <MenuItem
          component={Link}
          to="profile"
          onClick={() => setIsOpen(false)}
        >
          Thông tin cá nhân
        </MenuItem>
        <MenuItem
          component={Link}
          to="changePassword"
          onClick={() => setIsOpen(false)}
        >
          Đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
