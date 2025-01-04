"use client";
import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@repo/store/store";
import { errorFalse } from "@repo/store/ErrorSlice";
import { Alert } from "@mui/material";

export default function AutohideSnackbar() {
  const errorState = useSelector((state: RootState) => state.error.value);
  const dispatch = useDispatch();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(errorFalse());
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorState.isOpen}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={errorState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorState.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
