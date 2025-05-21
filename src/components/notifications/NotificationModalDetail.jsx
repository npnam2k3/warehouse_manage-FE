import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory2";
import { formattedDateTime } from "../../utils/handleDateTime";

export default function ModalNotificationDetail({ open, setOpen, data }) {
  if (!data) return null;

  const { notificationId, shortMessage, fullMessage, seen, seenAt, createdAt } =
    data;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InventoryIcon color="primary" />
        <Typography variant="h6">Thông báo tồn kho</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          {shortMessage}
        </Typography>

        <Box mt={2}>
          {fullMessage.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 1.5,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography>
                <strong>Sản phẩm:</strong> {item.productName}
              </Typography>
              <Typography>
                <strong>Kho:</strong> {item.warehouse}
              </Typography>
              <Typography>
                <strong>Số lượng:</strong> {item.quantity}
              </Typography>

              <Chip
                label="Số lượng thấp, cần nhập thêm"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
        </Box>

        <Divider sx={{ mt: 3, mb: 1 }} />

        <Typography variant="caption" color="text.secondary">
          Ngày: {formattedDateTime(createdAt)}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
