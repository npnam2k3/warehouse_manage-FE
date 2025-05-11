import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import StatisticCommon from "./components/StatisticCommon";
import StatisticOrders from "./components/StatisticOrders";
import StatisticProduct from "./components/StatisticProduct";

export default function StatisticReport() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: "20px" }}
      >
        <Tab label="Số liệu chung" />
        <Tab label="Đơn hàng" />
        <Tab label="Doanh số bán hàng" />
      </Tabs>

      {tab === 0 && <StatisticCommon />}

      {/* Tab 1 */}
      {tab === 1 && <StatisticOrders />}

      {tab === 2 && <StatisticProduct />}
    </Box>
  );
}
