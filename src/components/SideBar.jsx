import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import FactoryIcon from "@mui/icons-material/Factory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { NavLink, useLocation } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { AuthContext } from "../contexts/AuthProvider";
import { Role } from "../constant/role";

const CustomizeListItem = ({ to, icon, text, sx = {} }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      textDecoration: "none",
      color: isActive ? "#1976d2" : "inherit",
      backgroundColor: isActive ? "#e3f2fd" : "transparent",
    })}
  >
    <ListItemButton sx={sx}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  </NavLink>
);
export default function Sidebar() {
  const { profile } = React.useContext(AuthContext);

  const location = useLocation();
  const [openPartner, setOpenPartner] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState(false);
  const [openDebt, setOpenDebt] = React.useState(false);

  const isAdmin = profile?.role?.name === Role.ADMIN;
  const isAccountant = profile?.role?.name === Role.ACCOUNTANT;

  const handleClickPartner = () => {
    const newState = !openPartner;
    setOpenPartner(newState);
    localStorage.setItem("openPartner", newState.toString());
  };

  const handleClickOrder = () => {
    const newState = !openOrder;
    setOpenOrder(newState);
    localStorage.setItem("openOrder", newState.toString());
  };

  const handleClickDebt = () => {
    const newState = !openDebt;
    setOpenDebt(newState);
    localStorage.setItem("openDebt", newState.toString());
  };

  // Đối tác
  React.useEffect(() => {
    const savedOpenPartner = localStorage.getItem("openPartner");
    const isPartnerPage = ["/customers", "/suppliers"].includes(
      location.pathname
    );

    if (savedOpenPartner === null) {
      // Chưa có trạng thái trong localStorage → thiết lập mặc định
      localStorage.setItem("openPartner", isPartnerPage ? "true" : "false");
      setOpenPartner(isPartnerPage);
    } else {
      if (isPartnerPage) {
        // Trang partner → luôn mở
        setOpenPartner(true);
      } else {
        // Trang khác → giữ trạng thái do người dùng thiết lập
        setOpenPartner(savedOpenPartner === "true");
      }
    }
  }, [location.pathname]);

  // Hóa đơn
  React.useEffect(() => {
    const savedOpenOrder = localStorage.getItem("openOrder");
    const isOrderPage = ["/import-order", "/export-order"].includes(
      location.pathname
    );

    if (savedOpenOrder === null) {
      localStorage.setItem("openOrder", isOrderPage ? "true" : "false");
      setOpenOrder(isOrderPage);
    } else {
      setOpenOrder(isOrderPage ? true : savedOpenOrder === "true");
    }
  }, [location.pathname]);

  // công nợ
  React.useEffect(() => {
    const savedOpenDebt = localStorage.getItem("openDebt");
    const isDebtPage = ["/supplier-debt", "/customer-debt"].includes(
      location.pathname
    );

    if (savedOpenDebt === null) {
      localStorage.setItem("openDebt", isDebtPage ? "true" : "false");
      setOpenDebt(isDebtPage);
    } else {
      setOpenDebt(isDebtPage ? true : savedOpenDebt === "true");
    }
  }, [location.pathname]);
  return (
    <Box
      sx={{
        width: "260px",
        position: "fixed",
        overflowY: "auto",
        top: "64px",
        bottom: 0,
        bgcolor: "#FDFAF6",
      }}
    >
      <List component="nav">
        <CustomizeListItem to={"/"} text={"Tổng quan"} icon={<Dashboard />} />

        {isAdmin && (
          <CustomizeListItem
            to={"users"}
            icon={<GroupIcon />}
            text={"Quản lý người dùng"}
          />
        )}

        <CustomizeListItem
          to={"inventories"}
          icon={<InventoryIcon />}
          text={"Quản lý tồn kho"}
        />
        {(isAccountant || isAdmin) && (
          <CustomizeListItem
            to={"categories"}
            icon={<CategoryIcon />}
            text={"Quản lý danh mục"}
          />
        )}

        {(isAccountant || isAdmin) && (
          <ListItemButton onClick={handleClickPartner}>
            <ListItemIcon>
              <HandshakeIcon />
            </ListItemIcon>
            <ListItemText primary="Đối tác" />
            {openPartner ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        )}
        {(isAccountant || isAdmin) && (
          <Collapse in={openPartner} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <CustomizeListItem
                to={"customers"}
                text={"Khách hàng"}
                icon={<PersonIcon />}
                sx={{ pl: 4 }}
              />

              <CustomizeListItem
                to={"suppliers"}
                text={"Nhà cung cấp"}
                icon={<FactoryIcon />}
                sx={{ pl: 4 }}
              />
            </List>
          </Collapse>
        )}

        {(isAccountant || isAdmin) && (
          <ListItemButton onClick={handleClickOrder}>
            <ListItemIcon>
              <ReceiptLongIcon />
            </ListItemIcon>
            <ListItemText primary="Hóa đơn" />
            {openOrder ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        )}

        {(isAccountant || isAdmin) && (
          <Collapse in={openOrder} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <CustomizeListItem
                to={"import-order"}
                text={"Đơn nhập"}
                icon={<MoveToInboxIcon />}
                sx={{ pl: 4 }}
              />

              <CustomizeListItem
                to={"export-order"}
                text={"Đơn xuất"}
                icon={<LocalShippingIcon />}
                sx={{ pl: 4 }}
              />
            </List>
          </Collapse>
        )}

        {(isAccountant || isAdmin) && (
          <ListItemButton onClick={handleClickDebt}>
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Công nợ" />
            {openDebt ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        )}

        {(isAccountant || isAdmin) && (
          <Collapse in={openDebt} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <CustomizeListItem
                to={"customer-debt"}
                text={"Với khách hàng"}
                icon={<PersonIcon />}
                sx={{ pl: 4 }}
              />

              <CustomizeListItem
                to={"supplier-debt"}
                text={"Với nhà cung cấp"}
                icon={<FactoryIcon />}
                sx={{ pl: 4 }}
              />
            </List>
          </Collapse>
        )}

        {(isAccountant || isAdmin) && (
          <CustomizeListItem
            to={"statistic-report"}
            icon={<BarChartIcon />}
            text={"Báo cáo & thống kê"}
          />
        )}
        {(isAccountant || isAdmin) && (
          <CustomizeListItem
            to={"setup"}
            icon={<SettingsSuggestIcon />}
            text={"Thiết lập hệ thống"}
          />
        )}
      </List>
    </Box>
  );
}
