import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import { deleteWarehouse, getAll } from "../../../../apis/warehouseService";
import ModalCreateWarehouse from "./ModalCreateWarehouse";
import { formattedDateTime } from "../../../../utils/handleDateTime";
import ModalUpdateWarehouse from "./ModalUpdateWarehouse";
import { ToastContext } from "../../../../contexts/toastProvider";

const Warehouse = () => {
  const [data, setData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] = useState(false);

  const { toast } = useContext(ToastContext);
  const handleClickOpenModalCreate = () => {
    setOpenModalCreate(true);
  };
  const handleClickOpenModalUpdate = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setOpenModalUpdate(true);
  };
  const handleClickDelete = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setOpenConfirmModalDelete(true);
  };
  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteWarehouse(id);
      setOpenConfirmModalDelete(false);
      toast.success(res.data?.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalDelete(false);
    }
  };
  const fetchData = async () => {
    try {
      const res = await getAll();
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleClickOpenModalCreate()}
      >
        Thêm kho
      </Button>

      <Table sx={{ bgcolor: "#fff", mt: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Tên kho</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <Typography variant="h5">Chưa có kho nào được tạo</Typography>
          ) : (
            data.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.address || "Chưa có"}</TableCell>
                <TableCell>{formattedDateTime(warehouse.createdAt)}</TableCell>
                <TableCell sx={{ display: "flex", gap: "20px" }}>
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
                      onClick={() => handleClickOpenModalUpdate(warehouse)}
                    >
                      <CreateIcon sx={{ fontSize: "20px" }} />
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
                      onClick={() => handleClickDelete(warehouse)}
                    >
                      <DeleteIcon sx={{ fontSize: "20px" }} />
                    </Box>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ModalCreateWarehouse
        open={openModalCreate}
        setOpen={setOpenModalCreate}
        fetchData={fetchData}
      />

      <ModalUpdateWarehouse
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        fetchData={fetchData}
        warehouse={selectedWarehouse}
      />

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
          {`Bạn có chắc muốn xóa ${selectedWarehouse?.name}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedWarehouse.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Warehouse;
