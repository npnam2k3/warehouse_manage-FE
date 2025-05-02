import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const StatusOfOrder = ({ options, label, value, handleChange }) => {
  return (
    <Autocomplete
      disablePortal
      options={options}
      size="small"
      sx={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={value}
      onChange={handleChange}
    />
  );
};

export default StatusOfOrder;
