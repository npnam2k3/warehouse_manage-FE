import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { getAll } from "../../apis/categoryService";
import TableCategories from "./components/TableCategories";
import ModalCreateCategory from "./components/ModalCreateCategory";

const CategoriesPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAll();
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      {/* title and button add */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý danh mục
        </Typography>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px", mx: "30px" }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
          <Typography variant="span">Thêm danh mục</Typography>
        </Button>
      </Box>

      {/* list category */}
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
            Không tìm thấy danh mục.
          </Typography>
        ) : (
          <TableCategories data={data} fetchData={fetchData} />
        )}
      </Box>

      <ModalCreateCategory
        open={open}
        setOpen={setOpen}
        fetchData={fetchData}
      />
    </Box>
  );
};

export default CategoriesPage;
