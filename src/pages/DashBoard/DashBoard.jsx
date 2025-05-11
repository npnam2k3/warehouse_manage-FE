import React, { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import ListProduct from "./components/ListProduct";
import StatsCard from "./components/StatsCard";
import {
  getBaseInfo,
  getListProductsHaveLowInventory,
  getOrdersRecent,
} from "../../apis/dashboardService";
import ListOrdersRecent from "./components/ListOrdersRecent";

const Dashboard = () => {
  const [baseInfo, setBaseInfo] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [infoInventory, setInfoInventory] = useState(null);

  const fetchDataBaseInfo = async () => {
    try {
      const res = await getBaseInfo();
      setBaseInfo(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataRecentOrders = async () => {
    try {
      const res = await getOrdersRecent();
      setRecentOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProductsHaveLowInventory = async () => {
    try {
      const res = await getListProductsHaveLowInventory();
      setInfoInventory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataBaseInfo();
    fetchDataRecentOrders();
    fetchDataProductsHaveLowInventory();
  }, []);

  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      <Box sx={{ pl: 2 }}>
        <Grid
          container
          spacing={2}
          sx={{
            bgcolor: "#fff",
            pr: 2,
            pt: 2,
            pb: 2,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Số lượng mặt hàng hiện có"}
              value={baseInfo?.quantityProducts}
              color={"#F3F3E0"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Số lượng danh mục sản phẩm"}
              value={baseInfo?.countCategory}
              color={"#DBFFCB"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Số đơn nhập hôm nay"}
              value={baseInfo?.countImportOrderToday}
              color={"#AFDDFF"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Số đơn xuất hôm nay"}
              value={baseInfo?.countExportOrderToday}
              color={"#BEE4D0"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Doanh thu hôm nay"}
              value={baseInfo?.totalRevenue}
              color={"#EAEAEA"}
              suffix=" đ"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title={"Chi phí nhập hàng hôm nay"}
              value={baseInfo?.totalCost}
              color={"#F8F2DE"}
              suffix=" đ"
            />
          </Grid>
        </Grid>
      </Box>

      {recentOrders?.importOrdersRecent?.length > 0 &&
        recentOrders?.exportOrdersRecent?.length > 0 && (
          <Box
            sx={{
              mt: "40px",
              bgcolor: "#fff",
              p: 1,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            {recentOrders?.importOrdersRecent?.length > 0 && (
              <ListOrdersRecent
                isListImportOrder={true}
                listOrders={recentOrders?.importOrdersRecent}
              />
            )}
            {recentOrders?.exportOrdersRecent?.length > 0 && (
              <ListOrdersRecent
                isListImportOrder={false}
                listOrders={recentOrders?.exportOrdersRecent}
              />
            )}
          </Box>
        )}
      <Box
        sx={{
          mt: "40px",
          bgcolor: "#fff",
          p: 1,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <ListProduct
          inventoryThreshold={infoInventory?.inventoryThreshold}
          products={infoInventory?.listProducts}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
