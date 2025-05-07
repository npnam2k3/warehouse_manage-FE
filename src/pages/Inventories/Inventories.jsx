import {
  Autocomplete,
  Box,
  Button,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";

import { getAll } from "../../apis/categoryService";
import TableInventories from "./components/TableInventories";
import {
  getAllProducts,
  getAllProductsHaveQuantityInWarehouse,
} from "../../apis/productService";
import { ToastContext } from "../../contexts/toastProvider";
import ModalCreateProduct from "./components/ModalCreateProduct";
import { getAllUnit } from "../../apis/unitService";
import ModalAdjustInventory from "./components/ModalAdjustInventory";
import ModalAdjustmentInventoryLog from "./components/ModalAdjustmentInventoryLog";

const Inventories = () => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const { toast } = useContext(ToastContext);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [productsHaveQuantityInWarehouse, setProductsHaveQuantityInWarehouse] =
    useState([]);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openModalAdjustInventory, setOpenModalAdjustInventory] =
    useState(false);

  const [openModalAdjustmentInventory, setOpenModalAdjustmentInventory] =
    useState(false);

  const handleOpenModalCreate = () => {
    setOpenCreateModal(true);
  };

  const handleOpenModalAdjustInventory = () => {
    setOpenModalAdjustInventory(true);
  };

  const handleFilterCategory = (event, newValue) => {
    setCategory(newValue);
  };
  const handleClickFilterButton = () => {
    setPage(1);
    fetchDataProduct();
  };
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const fetchDataCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAll();
      const categoriesFormatted = formattedCategories(res.data.data);
      setCategories(categoriesFormatted);
    } catch (error) {
      toast.error(error.response.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDataUnits = async () => {
    try {
      const res = await getAllUnit();
      setUnits(formattedUnits(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProduct = async () => {
    setIsLoadingProduct(true);
    try {
      const res = await getAllProducts({
        limit,
        page,
        search,
        category: category?.id,
      });
      setInventories(res.data?.data?.products);
      setTotalPages(res.data?.data?.totalPages);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // dùng cho điều chỉnh tồn kho
  const fetchDataProductsHaveQuantityInWarehouse = async () => {
    try {
      const res = await getAllProductsHaveQuantityInWarehouse();
      setProductsHaveQuantityInWarehouse(
        formattedProductsHaveQuantityInWarehouse(res.data?.data)
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataCategories();
    fetchDataUnits();
  }, []);

  useEffect(() => {
    fetchDataProduct();
  }, [page]);

  useEffect(() => {
    fetchDataProductsHaveQuantityInWarehouse();
  }, []);

  const formattedCategories = (categories) => {
    return categories.map((category) => {
      return {
        label: category.name,
        id: category.id,
      };
    });
  };
  const formattedUnits = (listUnit) => {
    return listUnit.map((unit) => ({
      label: unit.name,
      id: unit.id,
    }));
  };

  const formattedProductsHaveQuantityInWarehouse = (listProducts) => {
    return listProducts.map((pro) => {
      return {
        label: pro.name,
        id: pro.id,
        inventories: pro.inventories?.map((inv) => ({
          label: inv.warehouse.name,
          id: inv.warehouse.id,
          quantity: inv.quantity,
        })),
      };
    });
  };
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      {/* title and button add */}
      <Box sx={{ mb: "20px" }}>
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Quản lý tồn kho
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px" }}
          onClick={() => setOpenModalAdjustmentInventory(true)}
        >
          <HistoryIcon sx={{ fontSize: "20px" }} />
          <Typography component="span">Lịch sử điều chỉnh tồn kho</Typography>
        </Button>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px" }}
          onClick={handleOpenModalAdjustInventory}
        >
          <EditIcon sx={{ fontSize: "20px" }} />
          <Typography variant="span">Điều chỉnh tồn kho</Typography>
        </Button>
        <Button
          variant="contained"
          sx={{ display: "flex", gap: "5px" }}
          onClick={handleOpenModalCreate}
        >
          <AddIcon />
          <Typography variant="span">Thêm sản phẩm</Typography>
        </Button>
      </Box>

      {/* search and filter */}
      {isLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ size: "24px" }} />
        </Box>
      ) : (
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
              label="Tìm kiếm theo tên hoặc mã sản phẩm"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Autocomplete
              disablePortal
              options={categories}
              size="small"
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Danh mục" />
              )}
              value={category}
              onChange={handleFilterCategory}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button variant="outlined" onClick={handleClickFilterButton}>
              Lọc
            </Button>
          </Box>
        </Box>
      )}

      {/* list products */}
      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          mt: "30px",
        }}
      >
        {isLoadingProduct ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ size: "24px" }} />
          </Box>
        ) : inventories.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
            Không tìm thấy sản phẩm.
          </Typography>
        ) : (
          <TableInventories data={inventories} fetchData={fetchDataProduct} />
        )}
        {inventories.length > 0 && (
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

      {/* modal create product */}
      {openCreateModal && (
        <ModalCreateProduct
          open={openCreateModal}
          setOpen={setOpenCreateModal}
          fetData={fetchDataProduct}
          categories={categories}
          setPage={setPage}
          units={units}
        />
      )}

      {/* modal adjust inventory */}
      {openModalAdjustInventory && (
        <ModalAdjustInventory
          open={openModalAdjustInventory}
          setOpen={setOpenModalAdjustInventory}
          products={productsHaveQuantityInWarehouse}
          fetchData={fetchDataProduct}
          setPage={setPage}
        />
      )}

      {openModalAdjustmentInventory && (
        <ModalAdjustmentInventoryLog
          open={openModalAdjustmentInventory}
          setOpen={setOpenModalAdjustmentInventory}
        />
      )}
    </Box>
  );
};

export default Inventories;
