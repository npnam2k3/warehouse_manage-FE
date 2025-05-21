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
  ListItemText,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { AuthContext } from "../contexts/AuthProvider";
import { SocketContext } from "../contexts/SocketContext";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../apis/authService";
import NotificationModalDetail from "./notifications/NotificationModalDetail";
import AllNotificationsModal from "./notifications/AllNotificationModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [openNotificationModalDetail, setOpenNotificationModalDetail] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [allNotification, setAllNotification] = useState([]);
  const [openModalAllNotification, setOpenModalAllNotification] =
    useState(false);

  const { profile } = useContext(AuthContext);
  const {
    disconnectSocket,
    notificationsUnseen,
    fetDataNotificationDetail,
    handleMarkSeenNotification,
    fetchDataAllNotifications,
  } = useContext(SocketContext);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      disconnectSocket();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenNotificationModalDetail = async (id) => {
    const notification = await fetDataNotificationDetail(id);
    await handleMarkSeenNotification(id);
    setSelectedNotification(formatData(notification));
    setOpenNotificationModalDetail(true);
    setNotificationAnchorEl(null);
  };

  const handleOpenAllNotificationModal = async () => {
    const allNotificationRes = await fetchDataAllNotifications();
    setOpenModalAllNotification(true);
    setAllNotification(allNotificationRes);
    setNotificationAnchorEl(null);
  };

  const formatData = (dataRaw) => {
    return {
      notificationId: dataRaw.notification?.id,
      shortMessage: dataRaw.notification?.short_message,
      fullMessage: dataRaw.notification?.full_message,
      seen: dataRaw.seen,
      seenAt: dataRaw.seenAt,
      createdAt: dataRaw.notification?.createdAt,
    };
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
        <Badge
          badgeContent={notificationsUnseen.length}
          color="error"
          sx={{ cursor: "pointer", marginRight: "15px" }}
          onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
        >
          <NotificationsIcon />
        </Badge>
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

      {Boolean(notificationAnchorEl) && (
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={() => setNotificationAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: "300px",
              overflowY: "auto",
              marginTop: "14px",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              fontWeight: "bold",
              fontSize: "20px",
              color: "primary.main",
              cursor: "default",
              userSelect: "none",
            }}
          >
            Thông báo mới
          </Box>
          {notificationsUnseen.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 60,
              }}
            >
              <Typography
                component="p"
                sx={{ fontStyle: "italic", color: "#999" }}
              >
                Chưa có thông báo mới
              </Typography>
            </Box>
          ) : (
            notificationsUnseen.map((notification) => (
              <MenuItem
                onClick={() =>
                  handleOpenNotificationModalDetail(notification.notificationId)
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#bbdefb", // hover nhẹ
                  },
                }}
                key={notification.notificationId}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontWeight: "bold",
                  }}
                  primary={notification.shortMessage}
                />
              </MenuItem>
            ))
          )}

          <MenuItem
            sx={{
              justifyContent: "center",
              backgroundColor: "#f0f4ff",
              borderTop: "1px solid #c5cee0",
              mt: 1,
              "&:hover": {
                backgroundColor: "#d6e0ff",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#1976d2", // màu xanh primary
                fontWeight: "600",
                width: "100%",
                justifyContent: "center",
              }}
              onClick={handleOpenAllNotificationModal}
            >
              <Typography component="span" sx={{ userSelect: "none" }}>
                Xem tất cả thông báo
              </Typography>
              <ArrowRightAltIcon sx={{ fontSize: 20, color: "#1976d2" }} />
            </Box>
          </MenuItem>
        </Menu>
      )}

      {openNotificationModalDetail && (
        <NotificationModalDetail
          data={selectedNotification}
          open={openNotificationModalDetail}
          setOpen={setOpenNotificationModalDetail}
        />
      )}

      {openModalAllNotification && (
        <AllNotificationsModal
          notifications={allNotification}
          open={openModalAllNotification}
          setOpen={setOpenModalAllNotification}
          handleOpenAllNotificationModal={handleOpenAllNotificationModal}
        />
      )}
    </AppBar>
  );
};

export default Header;
