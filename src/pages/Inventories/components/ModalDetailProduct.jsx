import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import { formatCurrency } from "../../../utils/formatMoney";

export default function ModalDetailProduct({ open, setOpen, product }) {
  return (
    <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
      <AppBar sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Chi tiết sản phẩm: {product?.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* ảnh sản phẩm */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: "400px",
                height: "auto",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <img
                src={
                  product?.imageUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREzepQrMS375z9ZdQb5e_Zyi4FQSlRQZp278nSYN9FW9jXBpm0cRCZgJQ&s"
                }
                alt={product?.name || ""}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>

          {/* Bên phải: thông tin */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product?.name}</Typography>
                <Typography>
                  <b>Mã sản phẩm:</b> {product?.product_code}
                </Typography>
                <Typography>
                  <b>Giá nhập:</b> {formatCurrency(product?.purchase_price)}
                </Typography>
                <Typography>
                  <b>Giá bán:</b> {formatCurrency(product?.sell_price)}
                </Typography>
                <Typography>
                  <b>Đơn vị tính:</b> {product?.unit?.name}
                </Typography>
                {product?.description && (
                  <Typography mt={2}>
                    <b>Mô tả:</b> {product?.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Thông tin phụ bên dưới */}
        <Grid container spacing={4} mt={2}>
          {/* Danh mục */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <CategoryIcon sx={{ width: "20px" }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Danh mục:
                  </Typography>
                </Box>
                <Typography>{product?.category?.name || "Chưa có"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product?.category?.description || ""}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Nhà cung cấp */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <BusinessIcon sx={{ width: "20px" }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Nhà cung cấp:
                  </Typography>
                </Box>
                {product?.suppliers?.length > 0 ? (
                  <List dense>
                    {product?.suppliers?.map((s) => (
                      <ListItem key={s?.id} disablePadding>
                        <ListItemText
                          primary={s?.name_company}
                          secondary={s?.address}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">Chưa có</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Tồn kho */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <InventoryIcon sx={{ width: "20px" }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tồn kho:
                  </Typography>
                </Box>
                {product?.inventories?.length > 0 ? (
                  <List dense>
                    {product?.inventories?.map((inv) => (
                      <ListItem key={inv.id} disablePadding>
                        <ListItemText
                          primary={`${inv?.warehouse?.name || "Kho"}: ${
                            inv?.quantity
                          }`}
                          secondary={`Địa chỉ: ${
                            inv?.warehouse?.address || "chưa có"
                          }`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">Chưa có</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
