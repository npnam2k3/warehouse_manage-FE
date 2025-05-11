import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import CountUp from "react-countup";

const StatsCard = ({ title, value, color, suffix = "" }) => {
  return (
    <Card style={{ backgroundColor: color || "#fff", margin: 10 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">
          <CountUp end={value} duration={1} suffix={suffix} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
