import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import TableHistoryImportExportOfProduct from "./TableHistoryImportExportOfProduct";
import { getHistorySellOfProduct } from "../../../apis/exportOrderService";
import { getHistoryPurchaseOfProduct } from "../../../apis/importOrderService";

const ModalHistoryOfProduct = ({ open, setOpen, product }) => {
  const [historyImport, setHistoryImport] = useState([]);
  const [pageHistoryImport, setPageHistoryImport] = useState(1);
  const limit = 5;
  const [totalPagesHistoryImport, setTotalPagesHistoryImport] = useState(1);

  const [historyExport, setHistoryExport] = useState([]);
  const [pageHistoryExport, setPageHistoryExport] = useState(1);
  const [totalPagesHistoryExport, setTotalPagesHistoryExport] = useState(1);

  const handleChangePageImport = (event, value) => {
    setPageHistoryImport(value);
  };
  const handleChangePageExport = (event, value) => {
    setPageHistoryExport(value);
  };

  const fetchDataHistorySellOfProduct = async () => {
    try {
      const res = await getHistorySellOfProduct({
        limit,
        page: pageHistoryExport,
        productId: product.id,
      });
      setHistoryExport(res.data.data.results);
      setTotalPagesHistoryExport(res.data.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataHistoryPurchaseOfProduct = async () => {
    try {
      const res = await getHistoryPurchaseOfProduct({
        limit,
        page: pageHistoryImport,
        productId: product.id,
      });
      setHistoryImport(res.data.data.results);
      setTotalPagesHistoryImport(res.data.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataHistorySellOfProduct();
  }, [pageHistoryExport]);

  useEffect(() => {
    fetchDataHistoryPurchaseOfProduct();
  }, [pageHistoryImport]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="md"
      fullScreen
    >
      <DialogTitle>Sản phẩm {product && product.name}</DialogTitle>
      <DialogContent dividers>
        <Typography
          component={"p"}
          sx={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Lịch sử xuất hàng
        </Typography>
        <TableHistoryImportExportOfProduct
          data={historyExport}
          isImport={false}
          handleChangePage={handleChangePageExport}
          page={pageHistoryExport}
          totalPages={totalPagesHistoryExport}
        />

        <Typography
          component={"p"}
          sx={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Lịch sử nhập hàng
        </Typography>
        <TableHistoryImportExportOfProduct
          data={historyImport}
          isImport={true}
          handleChangePage={handleChangePageImport}
          page={pageHistoryImport}
          totalPages={totalPagesHistoryImport}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          variant="outlined"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalHistoryOfProduct;
