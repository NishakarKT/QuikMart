import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
// mui
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Chart = ({ chartData }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (chartData.length) setData(chartData);
    else setData([]);
  }, [chartData, setData]);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Insights
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
          <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales
            </Label>
            <Tooltip />
          </YAxis>
          <Tooltip />
          <Legend />
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            activeDot={{ r: 4 }}
          />
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey="quantity"
            stroke={theme.palette.secondary.main}
            strokeWidth={2}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;
