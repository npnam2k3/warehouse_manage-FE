import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  DialogActions,
  Button,
} from "@mui/material";
import { formattedDateTime } from "../../utils/handleDateTime";
import { useContext, useState } from "react";
import ModalNotificationDetail from "./NotificationModalDetail";
import { SocketContext } from "../../contexts/SocketContext";

const AllNotificationsModal = ({
  open,
  setOpen,
  notifications,
  handleOpenAllNotificationModal,
}) => {
  const [openNotificationModalDetail, setOpenNotificationModalDetail] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { fetDataNotificationDetail, handleMarkSeenNotification } =
    useContext(SocketContext);

  const handleOpenNotificationModalDetail = async (id) => {
    const notification = await fetDataNotificationDetail(id);

    // call api đánh dấu thông báo đã xem
    await handleMarkSeenNotification(id);
    setSelectedNotification(formatData(notification));
    setOpenNotificationModalDetail(true);

    // call lại api lấy tất cả thông báo
    handleOpenAllNotificationModal();
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
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Tất cả thông báo</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: 400, // Giới hạn chiều cao để bật cuộn
          overflowY: "auto",
        }}
      >
        {notifications.length === 0 ? (
          <Typography
            sx={{
              fontStyle: "italic",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Không có thông báo nào
          </Typography>
        ) : (
          <List>
            {notifications.map((item) => {
              const isUnseen = !item.seen;
              return (
                <ListItem
                  onClick={() =>
                    handleOpenNotificationModalDetail(item.notification.id)
                  }
                  key={item.id}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: isUnseen
                      ? "rgba(25, 118, 210, 0.1)"
                      : "transparent",
                    border: isUnseen
                      ? "1px solid #1976d2"
                      : "1px solid transparent",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: isUnseen
                        ? "rgba(25, 118, 210, 0.2)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: isUnseen ? "700" : "400",
                          color: isUnseen ? "primary.main" : "text.primary",
                        }}
                      >
                        {item.notification.short_message}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        {item.notification.full_message.map((detail, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {`${detail.productName} - ${detail.warehouse} - Số lượng: ${detail.quantity}`}
                          </Typography>
                        ))}
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: "block" }}
                        >
                          {formattedDateTime(item.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          color="primary"
        >
          Đóng
        </Button>
      </DialogActions>
      {openNotificationModalDetail && (
        <ModalNotificationDetail
          data={selectedNotification}
          open={openNotificationModalDetail}
          setOpen={setOpenNotificationModalDetail}
        />
      )}
    </Dialog>
  );
};

export default AllNotificationsModal;
