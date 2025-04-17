// src/constants/menuItems.js (hoặc đặt ở đầu file Sidebar.jsx cũng được)
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ImportExportIcon from "@mui/icons-material/ImportExport";

export const menuItems = [
  {
    title: "Tổng quan",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    title: "Quản lý người dùng",
    icon: <InventoryIcon />,
    path: "users",
  },
  {
    title: "Quản lý tồn kho",
    icon: <ImportExportIcon />,
    path: "inventory",
  },
];
