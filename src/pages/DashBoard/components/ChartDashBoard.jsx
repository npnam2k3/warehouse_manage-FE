import { Box, Typography } from "@mui/material";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const ChartDashBoard = () => {
  const data = [
    { name: "Tháng 1", revenue: 120_000_000, importCost: 80_000_000 },
    { name: "Tháng 2", revenue: 95_000_000, importCost: 60_000_000 },
    { name: "Tháng 3", revenue: 500_000_000, importCost: 70_000_000 },
    { name: "Tháng 4", revenue: 130_000_000, importCost: 90_000_000 },
    { name: "Tháng 5", revenue: 125_000_000, importCost: 85_000_000 },
    { name: "Tháng 6", revenue: 140_000_000, importCost: 95_000_000 },
    { name: "Tháng 7", revenue: 150_000_000, importCost: 100_000_000 },
    { name: "Tháng 8", revenue: 160_000_000, importCost: 105_000_000 },
    { name: "Tháng 9", revenue: 155_000_000, importCost: 102_000_000 },
    { name: "Tháng 10", revenue: 165_000_000, importCost: 110_000_000 },
    { name: "Tháng 11", revenue: 170_000_000, importCost: 115_000_000 },
    { name: "Tháng 12", revenue: 100_000_00, importCost: 120_000_000 },
  ];

  return (
    <Box width="100%" minHeight={"500px"} sx={{ p: 5 }}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight={600}
        sx={{ textAlign: "center", mb: "20px" }}
      >
        Biểu đồ doanh thu và chi phí nhập hàng theo tháng
      </Typography>
      <Box sx={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1_000_000_000) {
                  return (value / 1_000_000_000).toFixed(1) + " tỷ";
                } else if (value >= 1_000_000) {
                  return (value / 1_000_000).toFixed(0) + " triệu";
                } else {
                  return value; // fallback nếu nhỏ hơn 1 triệu
                }
              }}
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="revenue" fill="#5DADE2" name="Doanh thu" />
            <Bar dataKey="importCost" fill="#58D68D" name="Chi phí nhập" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ChartDashBoard;
