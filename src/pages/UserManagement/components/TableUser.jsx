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
import LockIcon from "@mui/icons-material/Lock";
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
import { ROLE } from "../../../constant/role";
import { deleteUser, lockUser, unlockUser } from "../../../apis/userService";
import { ToastContext } from "../../../contexts/toastProvider";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ModalUpdateUser from "./ModalUpdateUser";

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

export default function TableUsers({ data, setPage, fetchData }) {
  const { toast } = React.useContext(ToastContext);
  const [openModalUpdate, setOpenModalUpdate] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] =
    React.useState(false);
  const [openConfirmModalLock, setOpenConfirmModalLock] = React.useState(false);

  const handleOnClickUpdate = (user) => {
    setSelectedUser(user);
    setOpenModalUpdate(true);
  };
  const handleConfirmLock = async (id) => {
    try {
      const res = await lockUser(id);
      toast.success(res.data?.message);
      setPage(1);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalLock(false);
    }
  };
  const handleClickUnLock = async (id) => {
    try {
      const res = await unlockUser(id);
      toast.success(res.data?.message);
      setPage(1);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      setOpenConfirmModalDelete(false);
      toast.success(res.data?.message);
      setPage(1);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalDelete(false);
    }
  };

  const handleClickDelete = (user) => {
    setSelectedUser(user);
    setOpenConfirmModalDelete(true);
  };

  const handleClickLock = (user) => {
    setSelectedUser(user);
    setOpenConfirmModalLock(true);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Họ tên</StyledTableCell>
            <StyledTableCell>Tên đăng nhập</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Vai trò</StyledTableCell>
            <StyledTableCell>Trạng thái</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.fullname}
              </StyledTableCell>
              <StyledTableCell>{row.username}</StyledTableCell>
              <StyledTableCell>{row.email}</StyledTableCell>
              <StyledTableCell>{ROLE[row.role?.name]}</StyledTableCell>
              <StyledTableCell>
                {row.isBlock ? "Tạm khóa" : "Hoạt động"}
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
                {row.isBlock
                  ? row.role?.name !== "ADMIN" && (
                      <Tooltip title="Mở khóa" placement="top-start">
                        <Box
                          component={"span"}
                          sx={{
                            bgcolor: "#FFE59D",
                            color: "#FEBB05",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleClickUnLock(row.id)}
                        >
                          <LockOpenIcon sx={{ fontSize: "20px" }} />
                        </Box>
                      </Tooltip>
                    )
                  : row.role?.name !== "ADMIN" && (
                      <Tooltip title="Khóa" placement="top-start">
                        <Box
                          component={"span"}
                          sx={{
                            bgcolor: "#FFE59D",
                            color: "#FEBB05",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleClickLock(row)}
                        >
                          <LockIcon sx={{ fontSize: "20px" }} />
                        </Box>
                      </Tooltip>
                    )}
                {row.role?.name !== "ADMIN" && (
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
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <ModalUpdateUser
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        setPage={setPage}
        fetchData={fetchData}
        user={selectedUser}
      />

      {/* confirm delete modal */}
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
          {`Bạn có chắc muốn xóa người dùng có username: ${selectedUser?.username}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedUser.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirm lock modal */}
      <Dialog
        open={openConfirmModalLock}
        onClose={(event, reason) => {
          // chặn đóng khi click ra ngoài hoặc nhấn ESC
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          setOpenConfirmModalLock(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Bạn có chắc muốn khóa người dùng có username: ${selectedUser?.username}?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalLock(false)}>Hủy</Button>
          <Button onClick={() => handleConfirmLock(selectedUser.id)} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
