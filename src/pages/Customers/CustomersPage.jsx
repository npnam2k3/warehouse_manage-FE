import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useContext, useEffect, useState } from "react";
import { getAllCustomer } from "../../apis/customerService";
import { ToastContext } from "../../contexts/toastProvider";
import TableCustomers from "./components/TableCustomers";
import ModalCreateCustomer from "./components/ModalCreateCustomer";

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [isDebt, setIsDebt] = useState("");

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useContext(ToastContext);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const handleClickFilter = () => {
    setPage(1);
    fetchDataCustomer();
  };
  const fetchDataCustomer = async () => {
    setIsLoading(true);
    try {
      const res = await getAllCustomer({ limit, page, search, isDebt });
      setCustomers(res.data?.data?.customers);
      setTotalPages(res.data?.data?.totalPages);
    } catch (error) {
      toast.error(error.response?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCustomer();
  }, [page]);
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      {/* title and button add */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý khách hàng
        </Typography>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px", mx: "30px" }}
          onClick={() => setOpenModalCreate(true)}
        >
          <AddIcon />
          <Typography variant="span">Thêm khách hàng</Typography>
        </Button>
      </Box>

      {/* search and filter */}
      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          mt: "30px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 9, display: "flex", gap: "20px" }}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên khách hàng"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Công nợ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isDebt}
              label="Công nợ"
              onChange={(e) => setIsDebt(e.target.value)}
            >
              <MenuItem value={"yes"}>Có công nợ</MenuItem>
              <MenuItem value={"no"}>Không có công nợ</MenuItem>
              <MenuItem value={"all"}>Tất cả</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Button variant="outlined" onClick={handleClickFilter}>
            Lọc
          </Button>
        </Box>
      </Box>

      {/* list customers */}
      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          mt: "30px",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ size: "24px" }} />
          </Box>
        ) : customers.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
            Không tìm thấy khách hàng.
          </Typography>
        ) : (
          <TableCustomers
            data={customers}
            fetchData={fetchDataCustomer}
            setPage={setPage}
          />
        )}
        {customers.length > 0 && (
          <Box sx={{ mt: "24px", display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        )}
      </Box>

      {/* modal create customer */}
      <ModalCreateCustomer
        open={openModalCreate}
        setOpen={setOpenModalCreate}
        setPage={setPage}
        fetchData={fetchDataCustomer}
      />
    </Box>
  );
};

export default CustomersPage;
