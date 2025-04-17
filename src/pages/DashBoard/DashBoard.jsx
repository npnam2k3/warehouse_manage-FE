import React from "react";

import { Box } from "@mui/material";
import ListProduct from "./components/ListProduct";
import StatsCard from "./components/StatsCard";
import ChartDashBoard from "./components/ChartDashBoard";

const Dashboard = () => {
  const listCard = [
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "",
    },
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "red",
    },
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "blue",
    },
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "green",
    },
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "green",
    },
    {
      title: "Nhập kho tháng này",
      value: 1000000,
      color: "green",
    },
  ];
  return (
    <Box sx={{ bgcolor: "#F0F1FA", minHeight: "100vh", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          bgcolor: "#fff",
          p: 1,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        {listCard.map((card, index) => (
          <StatsCard
            title={card.title}
            value={card.value}
            color={card.color}
            key={index}
          />
        ))}
      </Box>
      <Box
        sx={{
          mt: "40px",
          bgcolor: "#fff",
          p: 1,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <ChartDashBoard />
      </Box>
      <Box
        sx={{
          mt: "40px",
          bgcolor: "#fff",
          p: 1,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <ListProduct />
      </Box>
    </Box>
  );
};

export default Dashboard;
