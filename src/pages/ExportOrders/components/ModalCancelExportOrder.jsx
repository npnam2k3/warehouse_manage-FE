import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContext } from "../../../contexts/toastProvider";

import { cancelExportOrder } from "../../../apis/exportOrderService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialog-paper": {
    width: "600px",
    borderRadius: 12,
  },
}));
const ModalCancelExportOrder = ({
  open,
  setOpen,
  fetchData,
  setPage,
  export_order,
}) => {
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const { toast } = useContext(ToastContext);
  // đóng modal
  const handleCloseConfirmed = () => {
    setOpen(false);
  };

  const handleClickSave = async () => {
    const payload = {
      export_order_id: export_order?.id,
      cancel_reason: reason,
    };
    try {
      const res = await cancelExportOrder(payload);
      toast.success(res.data?.message);

      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center" }}
          id="customized-dialog-title"
        >
          {`Hủy hóa đơn có mã: ${export_order?.export_order_code}`}
        </DialogTitle>
        <IconButton
          aria-label="close"
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
          onClick={() => {
            if (reason) setOpenModalConfirm(true);
            else {
              setOpen(false);
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography sx={{ mb: "12px" }}>
                Lý do hủy (Không bắt buộc)
              </Typography>
              <TextField
                label="Lý do hủy"
                fullWidth
                variant="outlined"
                sx={{ mb: "10px" }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClickSave}>
            Lưu
          </Button>
        </DialogActions>

        <Dialog
          open={openModalConfirm}
          onClose={(event, reason) => {
            // chặn đóng khi click ra ngoài hoặc nhấn ESC
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              return;
            }
            setOpenModalConfirm(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có chắc muốn đóng biểu mẫu?"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bạn sẽ mất toàn bộ dữ liệu đang nhập nếu tiếp tục.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalConfirm(false)}>Hủy</Button>
            <Button
              onClick={() => {
                setOpenModalConfirm(false);
                handleCloseConfirmed(); // gọi hàm thực sự để đóng modal
              }}
              autoFocus
            >
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </BootstrapDialog>
    </>
  );
};

export default ModalCancelExportOrder;
