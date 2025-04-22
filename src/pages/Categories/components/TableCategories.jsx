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
import ModalUpdateCategory from "./ModalUpdateCategory";
import { deleteCategory, getOne } from "../../../apis/categoryService";
import { formattedDateTime } from "../../../utils/handleDateTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryDetail from "./CategoryDetail";

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

export default function TableCategories({ data, fetchData }) {
  const { toast } = React.useContext(ToastContext);
  const [openModalUpdate, setOpenModalUpdate] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [openCategoryDetail, setOpenCategoryDetail] = React.useState(false);
  const [listProductOfCategory, setListProductOfCategory] = React.useState([]);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] =
    React.useState(false);

  const handleOnClickUpdate = (category) => {
    setSelectedCategory(category);
    setOpenModalUpdate(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteCategory(id);
      toast.success(res.data?.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalDelete(false);
    }
  };
  const handleClickDelete = (category) => {
    setSelectedCategory(category);
    setOpenConfirmModalDelete(true);
  };

  const handleCloseCategoryDetail = () => {
    setOpenCategoryDetail(false);
  };
  const handleOpenCategoryDetail = (category) => {
    setSelectedCategory(category);
    fetchDataProductOfCategory(category.id);
    setOpenCategoryDetail(true);
  };

  const fetchDataProductOfCategory = async (id) => {
    try {
      const res = await getOne(id);
      setListProductOfCategory(formatListProduct(res.data?.data?.products));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  const formatListProduct = (list) => {
    if (list.length === 0) return [];
    return list.map((product) => {
      return {
        id: product.id,
        code: product.product_code,
        name: product.name,
        purchase_price: product.purchase_price,
        sell_price: product.sell_price,
      };
    });
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Danh mục</StyledTableCell>
            <StyledTableCell>Mô tả</StyledTableCell>
            <StyledTableCell>Ngày tạo</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell>{row.description || "Chưa có"}</StyledTableCell>
              <StyledTableCell>
                {formattedDateTime(row.createdAt)}
              </StyledTableCell>
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
                    onClick={() => handleOpenCategoryDetail(row)}
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

      {/* modal update category */}
      <ModalUpdateCategory
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        fetchData={fetchData}
        category={selectedCategory}
      />

      {/* modal view detail category */}
      <CategoryDetail
        open={openCategoryDetail}
        onClose={handleCloseCategoryDetail}
        category={selectedCategory}
        products={listProductOfCategory}
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
          {`Bạn có chắc muốn xóa danh mục: ${selectedCategory?.name}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedCategory.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
