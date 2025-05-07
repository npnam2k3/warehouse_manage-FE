import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useState } from "react";
import { ToastContext } from "../../../contexts/toastProvider";
import { adjustInventory } from "../../../apis/adjustInventoryService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialog-paper": {
    width: "80%",
    maxWidth: "800px",
    height: "80%",
    borderRadius: 12,
  },
}));

const ModalAdjustInventory = ({
  open,
  setOpen,
  fetchData,
  products,
  setPage,
}) => {
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [reasonChange, setReasonChange] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useContext(ToastContext);

  const handleCloseConfirmed = () => {
    setOpen(false);
  };

  const handleChangeProduct = (event, value) => {
    setSelectedWarehouse(null);
    setNewQuantity(0);
    setReasonChange("");
    setSelectedProduct(value);
  };

  const handleChangeWarehouse = (event, value) => {
    setNewQuantity(0);
    setReasonChange("");
    setSelectedWarehouse(value);
  };

  const handleChangeNewQuantity = (newQuantity) => {
    if (Number(newQuantity) < 0) {
      toast.error("Số lượng mới không được nhỏ hơn 0");
      return;
    }
    setNewQuantity(newQuantity);
  };

  const handleClickSave = async () => {
    if (!selectedProduct) {
      toast.error("Bạn chưa chọn sản phẩm để điều chỉnh");
      return;
    }
    if (!reasonChange || reasonChange === "") {
      toast.error(
        "Vui lòng nhập lý do điều chỉnh để phục vụ cho báo cáo sau này."
      );
      return;
    }
    const payload = {
      productId: selectedProduct.id,
      warehouseId: selectedWarehouse.id,
      oldQuantity: selectedWarehouse.quantity,
      newQuantity: Number(newQuantity),
      reasonChange,
    };
    try {
      setIsLoading(true);
      const res = await adjustInventory(payload);
      toast.success(res.data?.message);
      setOpen(false);
      setPage(1);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center" }}
        id="customized-dialog-title"
      >
        {"Chọn sản phẩm để điều chỉnh số lượng"}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => setOpenModalConfirm(true)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            mb: "24px",
          }}
        >
          <Autocomplete
            disablePortal
            options={products}
            sx={{ width: "100%" }}
            value={selectedProduct}
            ListboxProps={{
              style: {
                maxHeight: "260px", // giới hạn dropdown tối đa 260px
              },
            }}
            size="small"
            onChange={handleChangeProduct}
            renderInput={(params) => (
              <TextField {...params} label="Chọn sản phẩm" />
            )}
          />
        </Box>

        {selectedProduct && (
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              mb: "24px",
            }}
          >
            <Autocomplete
              disablePortal
              options={selectedProduct?.inventories}
              sx={{ width: "50%" }}
              value={selectedWarehouse || ""}
              ListboxProps={{
                style: {
                  maxHeight: "260px", // giới hạn dropdown tối đa 260px
                },
              }}
              size="small"
              onChange={handleChangeWarehouse}
              renderInput={(params) => (
                <TextField {...params} label="Chọn kho" />
              )}
            />

            {selectedWarehouse && (
              <TextField
                label="Số lượng cũ"
                size="small"
                sx={{ width: "25%" }}
                type="number"
                InputProps={{ readOnly: true }}
                value={selectedWarehouse.quantity}
              />
            )}

            {selectedWarehouse && (
              <TextField
                label="Số lượng mới"
                size="small"
                sx={{ width: "25%" }}
                type="number"
                value={newQuantity}
                onChange={(e) => handleChangeNewQuantity(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            )}
          </Box>
        )}

        {selectedProduct && selectedWarehouse && (
          <Box sx={{ mt: "40px" }}>
            <Typography sx={{ mb: "10px" }}>Lý do điều chỉnh (*) </Typography>
            <TextField
              label="Lý do điều chỉnh"
              sx={{ width: "100%" }}
              rows={3}
              multiline
              value={reasonChange}
              onChange={(e) => setReasonChange(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <CircularProgress size={"24px"} />
        ) : (
          <Button autoFocus onClick={handleClickSave}>
            Lưu
          </Button>
        )}
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
              handleCloseConfirmed(); // gọi hàm thực sự để đóng modal + reset
            }}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </BootstrapDialog>
  );
};

export default ModalAdjustInventory;
