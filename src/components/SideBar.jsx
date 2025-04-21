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
import FactoryIcon from "@mui/icons-material/Factory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { NavLink } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";

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
  const [openPartner, setOpenPartner] = React.useState(true);
  const [openOrder, setOpenOrder] = React.useState(true);

  const handleClickPartner = () => {
    setOpenPartner(!openPartner);
  };

  const handleClickOrder = () => {
    setOpenOrder(!openOrder);
  };
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

        <CustomizeListItem
          to={"users"}
          icon={<GroupIcon />}
          text={"Quản lý người dùng"}
        />

        <CustomizeListItem
          to={"inventory"}
          icon={<InventoryIcon />}
          text={"Quản lý tồn kho"}
        />
        <CustomizeListItem
          to={"categories"}
          icon={<CategoryIcon />}
          text={"Quản lý danh mục"}
        />

        <ListItemButton onClick={handleClickPartner}>
          <ListItemIcon>
            <HandshakeIcon />
          </ListItemIcon>
          <ListItemText primary="Đối tác" />
          {openPartner ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

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

        <ListItemButton onClick={handleClickOrder}>
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="Hóa đơn" />
          {openOrder ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

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
      </List>
    </Box>
  );
}
