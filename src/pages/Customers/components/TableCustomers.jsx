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
import { formattedDateTime } from "../../../utils/handleDateTime";
import ModalCreateCustomer from "./ModalCreateCustomer";
import ModalUpdateCustomer from "./ModalUpdateCustomer";
import { deleteCustomer, getOneCustomer } from "../../../apis/customerService";
import ModalCustomerDetail from "./ModalCustomerDetail";

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

export default function TableCustomers({ data, fetchData, setPage }) {
  const { toast } = React.useContext(ToastContext);
  const [openModalUpdate, setOpenModalUpdate] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [openCustomerDetail, setOpenCustomerDetail] = React.useState(false);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] =
    React.useState(false);

  const handleOnClickUpdate = (customer) => {
    setSelectedCustomer(customer);
    setOpenModalUpdate(true);
  };
  const handleClickDetailCustomer = (customer) => {
    fetchDataGetOneCustomer(customer?.id);
    setOpenCustomerDetail(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteCustomer(id);
      toast.success(res.data?.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setOpenConfirmModalDelete(false);
    }
  };
  const handleClickDelete = (customer) => {
    setSelectedCustomer(customer);
    setOpenConfirmModalDelete(true);
  };

  const fetchDataGetOneCustomer = async (customerId) => {
    try {
      const res = await getOneCustomer(customerId);
      setSelectedCustomer(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tên khách hàng</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Số điện thoại</StyledTableCell>
            <StyledTableCell>Địa chỉ</StyledTableCell>
            <StyledTableCell>Ngày tạo</StyledTableCell>
            <StyledTableCell>Công nợ</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.fullname}
              </StyledTableCell>
              <StyledTableCell>{row.email}</StyledTableCell>
              <StyledTableCell>{row.phone}</StyledTableCell>
              <StyledTableCell>{row.address}</StyledTableCell>
              <StyledTableCell>
                {formattedDateTime(row.createdAt)}
              </StyledTableCell>
              <StyledTableCell>{row.hasDebt ? "Có" : "Không"}</StyledTableCell>
              <StyledTableCell
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: "10px",
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
                    onClick={() => handleClickDetailCustomer(row)}
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

      {/* modal update customer */}
      <ModalUpdateCustomer
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        fetchData={fetchData}
        customer={selectedCustomer}
        setPage={setPage}
      />

      {/* modal view detail customer */}
      <ModalCustomerDetail
        open={openCustomerDetail}
        setOpen={setOpenCustomerDetail}
        customer={selectedCustomer}
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
          {`Bạn có chắc muốn xóa khách hàng: ${selectedCustomer?.fullname}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn sẽ không thể khôi phục dữ liệu sau khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModalDelete(false)}>Hủy</Button>
          <Button
            onClick={() => handleConfirmDelete(selectedCustomer?.id)}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
