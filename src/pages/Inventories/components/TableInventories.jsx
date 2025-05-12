import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import { ToastContext } from "../../../contexts/toastProvider";
import { formatCurrency } from "../../../utils/formatMoney";
import ModalUpdateProduct from "./ModalUpdateProduct";
import { getAll } from "../../../apis/categoryService";
import { getAllUnit } from "../../../apis/unitService";
import ModalDetailProduct from "./ModalDetailProduct";
import { deleteProduct, getOneProduct } from "../../../apis/productService";
import { AuthContext } from "../../../contexts/AuthProvider";
import { Role } from "../../../constant/role";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#A1E3F9",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableInventories({ data, fetchData }) {
  const { toast } = React.useContext(ToastContext);
  const { profile } = React.useContext(AuthContext);
  const isWarehouseManager = profile?.role?.name === Role.WAREHOUSE_MANAGER;

  const [openModalUpdate, setOpenModalUpdate] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [openProductDetail, setOpenProductDetail] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [units, setUnits] = React.useState([]);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] =
    React.useState(false);

  const handleOnClickUpdate = (product) => {
    if (isWarehouseManager) {
      toast.error("Bạn không có quyền sửa sản phẩm");
      return;
    }
    setSelectedProduct(product);
    setOpenModalUpdate(true);
  };
  const handleClickDetailProduct = (product) => {
    fetchDateGetOneProduct(product.id);
    setOpenProductDetail(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteProduct(id);
      toast.success(res.data?.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalDelete(false);
    }
  };
  const handleClickDelete = (category) => {
    if (isWarehouseManager) {
      toast.error("Bạn không có quyền xóa sản phẩm");
      return;
    }
    setSelectedProduct(category);
    setOpenConfirmModalDelete(true);
  };
  const fetchDataCategories = async () => {
    try {
      const res = await getAll();
      setCategories(formattedCategories(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataUnits = async () => {
    try {
      const res = await getAllUnit();
      setUnits(formattedUnits(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDateGetOneProduct = async (productId) => {
    try {
      const res = await getOneProduct(productId);
      setSelectedProduct(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchDataCategories();
    fetchDataUnits();
  }, []);

  const formattedCategories = (listCate) => {
    return listCate.map((category) => ({
      label: category.name,
      id: category.id,
    }));
  };

  const formattedUnits = (listUnit) => {
    return listUnit.map((unit) => ({
      label: unit.name,
      id: unit.id,
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Mã sản phẩm</StyledTableCell>
            <StyledTableCell>Tên sản phẩm</StyledTableCell>
            <StyledTableCell>Danh mục</StyledTableCell>
            <StyledTableCell>Giá nhập</StyledTableCell>
            <StyledTableCell>Giá bán</StyledTableCell>
            <StyledTableCell>Đơn vị tính</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.product_code}
              </StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.category?.name}</StyledTableCell>
              <StyledTableCell>
                {formatCurrency(row.purchase_price)}
              </StyledTableCell>
              <StyledTableCell>
                {formatCurrency(row.sell_price)}
              </StyledTableCell>
              <StyledTableCell>{row.unit?.name}</StyledTableCell>
              <StyledTableCell
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Sửa" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#DDE2FC",
                      color: "#3D90D7",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOnClickUpdate(row)}
                  >
                    <CreateIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>
                <Tooltip title="Chi tiết" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#EEF1DA",
                      color: "#FFA725",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickDetailProduct(row)}
                  >
                    <VisibilityIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>
                <Tooltip title="Xóa" placement="top-start">
                  <Box
                    component={"span"}
                    sx={{
                      bgcolor: "#F7BAAD",
                      color: "#FF5634",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickDelete(row)}
                  >
                    <DeleteIcon sx={{ fontSize: "20px" }} />
                  </Box>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

      {/* modal update product */}
      <ModalUpdateProduct
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        fetchData={fetchData}
        categories={categories}
        units={units}
        product={selectedProduct}
      />

      {/* modal view detail product */}
      <ModalDetailProduct
        open={openProductDetail}
        setOpen={setOpenProductDetail}
        product={selectedProduct}
      />

      {/* confirm modal delete */}
      <Dialog
        open={openConfirmModalDelete}
        onClose={(event, reason) => {
          // chặn đóng khi click ra ngoài hoặc nhấn ESC
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          setOpenConfirmModalDelete(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Bạn có chắc muốn xóa sản phẩm: ${selectedProduct?.name}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedProduct.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
