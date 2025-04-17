// src/layouts/MainLayout.jsx
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <Box>
      <Header />
      <Stack direction="row" spacing={2}>
        <Box sx={{ width: 260, flexShrink: 0 }}>
          <Sidebar />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
};

export default MainLayout;
