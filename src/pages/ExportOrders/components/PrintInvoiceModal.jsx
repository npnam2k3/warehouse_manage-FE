import React, { useRef } from "react";
import { Modal, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModalContentPrint from "./ModalContentPrint";
import { useReactToPrint } from "react-to-print";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  overflow: "auto",
  p: 4,
  borderRadius: 2,
};

const PrintInvoiceModal = ({ open, setOpen, order }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Hóa đơn xuất hàng",
    onAfterPrint: () => setOpen(false),
    pageStyle: `@page { size: A4; margin: 1cm; }`,
  });

  if (!order) {
    return null;
  }
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        {/* Nút đóng */}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Nội dung in */}
        <ModalContentPrint ref={printRef} order={order} />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={handlePrint}
          >
            In
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PrintInvoiceModal;
