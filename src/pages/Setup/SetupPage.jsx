import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import Warehouse from "./components/Warehouse/Warehouse";
import Unit from "./components/Unit/Unit";

const SetupPage = () => {
  const [value, setValue] = useState("1");
  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "500" }}>
        Thiết lập hệ thống
      </Typography>

      {/* Tabs */}
      <Tabs value={value} onChange={handleChangeValue} sx={{ mb: 3 }}>
        <Tab label="Quản lý kho" value={"1"} />
        <Tab label="Quản lý đơn vị tính" value={"2"} />
      </Tabs>

      {value === "1" && <Warehouse />}
      {value === "2" && <Unit />}
    </Box>
  );
};

export default SetupPage;
