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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../../contexts/toastProvider";
import { getAllProductsNoPagination } from "../../../apis/productService";
import { addProductToSupplier } from "../../../apis/supplierService";

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

const ModalAddProductToSupplier = ({ open, setOpen, supplier, fetchData }) => {
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [listProductToAdd, setListProductToAdd] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useContext(ToastContext);

  const handleCloseConfirmed = () => {
    setOpen(false);
    setListProductToAdd([]);
  };

  const handleChangeProduct = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  const handleClickAdd = (selectedProduct) => {
    const checkDuplicate = listProductToAdd.some(
      (pro) => pro.id === selectedProduct?.id
    );
    if (checkDuplicate) {
      toast.error(`Sản phẩm ${selectedProduct.label} đã được chọn`);
      setSelectedProduct(null);
      return;
    }
    setListProductToAdd((prev) => [...prev, selectedProduct]);
    setSelectedProduct(null);
  };

  const handleClickDelete = (productId) => {
    setListProductToAdd(listProductToAdd.filter((pro) => pro.id !== productId));
  };

  const fetchDataProducts = async () => {
    try {
      const res = await getAllProductsNoPagination();
      setProducts(formatDataProducts(res.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
  const formatDataProducts = (listProducts) => {
    return listProducts.map((pro) => {
      return {
        label: pro.name,
        id: pro.id,
        product_code: pro.product_code,
      };
    });
  };

  const handleClickSave = async () => {
    const payload = {
      supplierId: supplier?.id,
      listIdProducts: listProductToAdd.map((pro) => pro.id),
    };
    if (listProductToAdd.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thêm");
      return;
    }
    setIsLoading(true);
    try {
      const res = await addProductToSupplier(payload);
      toast.success(res.data?.message);
      setOpen(false);
      setListProductToAdd([]);
      setSelectedProduct(null);
      fetchData(supplier?.id); // call api get one supplier
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataProducts();
  }, []);

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
        {"Thêm sản phẩm của nhà cung cấp"}
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
            sx={{ width: "90%" }}
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
          <Button
            variant="contained"
            autoFocus
            onClick={() => handleClickAdd(selectedProduct)}
          >
            Thêm
          </Button>
        </Box>

        {listProductToAdd.length <= 0 ? (
          <Typography
            variant="p"
            sx={{
              textAlign: "center",
              display: "block",
              fontStyle: "italic",
              fontSize: "20px",
            }}
          >
            Vui lòng chọn sản phẩm để thêm
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã sản phẩm</TableCell>
                <TableCell align="center">Tên sản phẩm</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listProductToAdd.map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{product.product_code}</TableCell>
                  <TableCell align="center">{product.label}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa" placement="top-start">
                      <Box
                        component={"span"}
                        sx={{
                          bgcolor: "#F7BAAD",
                          color: "#FF5634",
                          borderRadius: "5px",
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          p: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClickDelete(product.id)}
                      >
                        <DeleteIcon sx={{ fontSize: "20px" }} />
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default ModalAddProductToSupplier;
