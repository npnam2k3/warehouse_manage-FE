import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";

export function ConfirmModalResetPass({ message, open, setOpen }) {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  const onClickConfirm = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickConfirm} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
