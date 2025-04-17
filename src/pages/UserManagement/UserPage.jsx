import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TableUsers from "./components/TableUser";
import { getUsers } from "../../apis/userService";
import ModalCreateUser from "./components/ModalCreateUser";

const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers({ page, limit, search });
      setData(res.data.data.users);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      {/* title and button add */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px", mx: "30px" }}
          onClick={handleOpenModal}
        >
          <AddIcon />
          <Typography variant="span">Thêm người dùng</Typography>
        </Button>
      </Box>

      {/* search */}
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
        component={"form"}
        onSubmit={handleSubmitSearch}
      >
        <Box sx={{ flex: 9 }}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Button type="submit" variant="outlined">
            Tìm kiếm
          </Button>
        </Box>
      </Box>

      {/* list users */}
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
        ) : data.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
            Không tìm thấy người dùng.
          </Typography>
        ) : (
          <TableUsers data={data} setPage={setPage} fetchData={fetchData} />
        )}
        {data.length > 0 && (
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
      <ModalCreateUser
        open={open}
        setOpen={setOpen}
        setPage={setPage}
        fetchData={fetchData}
      />
    </Box>
  );
};

export default UserPage;
