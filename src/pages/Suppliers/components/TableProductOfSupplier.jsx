import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useState } from "react";
import { formatCurrency } from "../../../utils/formatMoney";
import ModalAddProductToSupplier from "./ModalAddProductToSupplier";
import { ToastContext } from "../../../contexts/toastProvider";
import { deleteProductFromSupplier } from "../../../apis/supplierService";

const TableProductOfSupplier = ({ listProducts, supplier, fetchData }) => {
  const [openModalAddProduct, setModalAddProduct] = useState(false);
  const { toast } = useContext(ToastContext);
  const handleClickDeleteProductFromSupplier = async (productId) => {
    const payload = {
      supplierId: supplier?.id,
      productId,
    };
    try {
      const res = await deleteProductFromSupplier(payload);
      toast.success(res.data?.message);
      fetchData(supplier?.id); // call api get one supplier
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Danh sách sản phẩm cung cấp
          </Typography>

          <Button
            variant="contained"
            sx={{ display: "flex", gap: "5px", mx: "30px" }}
            onClick={() => setModalAddProduct(true)}
          >
            <AddIcon />
            <Typography variant="span">Thêm sản phẩm cung cấp</Typography>
          </Button>
        </Box>
        {listProducts?.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã sản phẩm</TableCell>
                <TableCell align="center">Tên sản phẩm</TableCell>
                <TableCell align="center">Giá nhập</TableCell>
                <TableCell align="center">Giá bán</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{product.product_code}</TableCell>
                  <TableCell align="center">{product.name}</TableCell>
                  <TableCell align="center">
                    {formatCurrency(product.purchase_price)}
                  </TableCell>
                  <TableCell align="center">
                    {formatCurrency(product.sell_price)}
                  </TableCell>
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
                        onClick={() =>
                          handleClickDeleteProductFromSupplier(product?.id)
                        }
                      >
                        <DeleteIcon sx={{ fontSize: "20px" }} />
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Không có sản phẩm nào.
          </Typography>
        )}
      </CardContent>
      {openModalAddProduct && (
        <ModalAddProductToSupplier
          open={openModalAddProduct}
          setOpen={setModalAddProduct}
          supplier={supplier}
          fetchData={fetchData}
        />
      )}
    </Card>
  );
};

export default TableProductOfSupplier;
