import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// mui
import { Stack, Box, Toolbar, Grid, Paper, Button, Typography } from "@mui/material";
// components
import Chart from "./Chart";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
// constants
import { ANALYTICS_GET_ENDPOINT } from "../../constants/endpoints";
import { AUTH_VENDOR_ROUTE, VENDOR_PROFILE_ROUTE } from "../../constants/routes";
// contexts
import VendorContext from "../../contexts/VendorContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isProfileComplete } = useContext(VendorContext);
  const [chartsData, setChartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_VENDOR_ROUTE);
    else {
      setIsLoading(true);
      axios
        .get(ANALYTICS_GET_ENDPOINT, { params: { vendor: user._id, type: "product" } })
        .then((res) => {
          const analytics = res.data.data;
          const productAnalytics = analytics.filter((analytic) => analytic.type === "product");
          console.log(productAnalytics);
          const chartsData = {};
          productAnalytics
            .filter((analytic, i, arr) => i === arr.findIndex((a) => a.action === analytic.action))
            .map((analytic) => analytic.action)
            .forEach((action) => {
              const data = productAnalytics.filter((analytic) => analytic.action === action);
              if (!chartsData[action]) {
                data.forEach((item) => {
                  if (!chartsData[action]) chartsData[action] = [{ date: new Date(item.createdAt).toLocaleString(), y1: 1 }];
                  else
                    chartsData[action].push({
                      x: new Date(item.createdAt).toLocaleString(),
                      y1: chartsData[action].slice(-1)[0].y1 + 1,
                    });
                });
              }
              setChartsData(chartsData);
            });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [user, navigate]);

  return user ? (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      {isLoading ? <Loader /> : null}
      {isProfileComplete(user) ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {Object.keys(chartsData).map((action) => (
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <Chart title={action} chartData={chartsData[action]} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
          <Typography component="p" variant="h4" align="center" color="error">
            Profile Incomplete!
          </Typography>
          <Typography component="p" variant="body1" align="center" color="text.secondary">
            Update your profile with all the necessary details to become a vendor!
          </Typography>
          <Button onClick={() => navigate(VENDOR_PROFILE_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
            Update Profile
          </Button>
        </Stack>
      )}
      <Footer />
    </Box>
  ) : null;
};

export default Dashboard;
