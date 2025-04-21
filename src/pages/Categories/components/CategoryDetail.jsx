import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CategoryDetail = ({ open, onClose, category, products }) => {
  const columns = [
    {
      field: "code",
      headerName: "Mã SP",
      width: 150,
      resizable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      width: 200,
      resizable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "purchase_price",
      headerName: "Giá nhập",
      width: 130,
      resizable: false,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => `${params.toLocaleString?.() ?? ""} ₫`,
    },
    {
      field: "sell_price",
      headerName: "Giá bán",
      width: 130,
      resizable: false,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => `${params.toLocaleString?.() ?? ""} ₫`,
    },
    {
      field: "actions",
      headerName: "Chi tiết",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Xem chi tiết">
          <IconButton
            // onClick={() => handleViewDetail(params.row)}
            sx={{ color: "#7AE2CF" }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết danh mục: {category?.name}</DialogTitle>
      <DialogContent>
        {products?.length ? (
          <DataGrid
            autoHeight
            rows={products}
            columns={columns}
            disableSelectionOnClick
            hideFooter
            disableColumnMenu
            disableColumnFilter
            disableColumnSorting
          />
        ) : (
          <Typography>Không có sản phẩm nào thuộc danh mục này.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetail;
