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
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import { formattedDateTime } from "../../../../utils/handleDateTime";
import { ToastContext } from "../../../../contexts/toastProvider";
import { deleteUnit, getAll } from "../../../../apis/unitService";
import ModalCreateUnit from "./ModalCreateUnit";

const Unit = () => {
  const [data, setData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] = useState(false);

  const { toast } = useContext(ToastContext);
  const handleClickOpenModalCreate = () => {
    setOpenModalCreate(true);
  };
  const handleClickDelete = (unit) => {
    setSelectedUnit(unit);
    setOpenConfirmModalDelete(true);
  };
  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteUnit(id);
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
        Thêm đơn vị tính
      </Button>

      <Table sx={{ bgcolor: "#fff", mt: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Đơn vị tính</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <Typography variant="h5">
              Chưa có đơn vị tính nào được tạo
            </Typography>
          ) : (
            data.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{formattedDateTime(unit.createdAt)}</TableCell>
                <TableCell sx={{ display: "flex", gap: "20px" }}>
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
                      onClick={() => handleClickDelete(unit)}
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

      <ModalCreateUnit
        open={openModalCreate}
        setOpen={setOpenModalCreate}
        fetchData={fetchData}
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
          {`Bạn có chắc muốn xóa đơn vị tính: ${selectedUnit?.name}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedUnit.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Unit;
