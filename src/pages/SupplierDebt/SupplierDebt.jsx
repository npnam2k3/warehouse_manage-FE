import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSuppliersHaveDebt } from "../../apis/supplierService";
import TableSupplierDebt from "./components/TableSupplierDebt";

const SupplierDebt = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suppliersHaveDebt, setSuppliersHaveDebt] = useState([]);
  const handleClickFilter = () => {
    fetchDataSuppliersHaveDebt();
  };

  const fetchDataSuppliersHaveDebt = async () => {
    setIsLoading(true);
    try {
      const res = await getSuppliersHaveDebt(search);
      setSuppliersHaveDebt(res.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSuppliersHaveDebt();
  }, []);
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý công nợ với nhà cung cấp
        </Typography>
      </Box>

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
            label="Tìm kiếm theo tên nhà cung cấp"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Button variant="outlined" onClick={handleClickFilter}>
            Lọc
          </Button>
        </Box>
      </Box>

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
        ) : suppliersHaveDebt.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
            Chưa có công nợ với nhà cung cấp.
          </Typography>
        ) : (
          <TableSupplierDebt
            suppliersHaveDebt={suppliersHaveDebt}
            fetchData={fetchDataSuppliersHaveDebt}
          />
        )}
      </Box>
    </Box>
  );
};

export default SupplierDebt;
