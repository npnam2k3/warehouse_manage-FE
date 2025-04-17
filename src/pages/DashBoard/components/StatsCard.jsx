import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatsCard = ({ title, value, color }) => {
  return (
    <Card style={{ backgroundColor: color || "#fff", margin: 10 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
