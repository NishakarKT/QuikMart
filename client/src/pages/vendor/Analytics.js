import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// mui
import {
  Stack,
  Box,
  Toolbar,
  Grid,
  Paper,
  Button,
  Typography,
} from "@mui/material";
// components
import Chart from "./Chart";
import Footer from "../../components/Footer";
// contexts
import VendorContext from "../../contexts/VendorContext";
// constants
import { AUTH_VENDOR_ROUTE, PROFILE_ROUTE, VENDOR_NEW_PRODUCTS_ROUTE } from "../../constants/routes";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, orders, isProfileComplete } = useContext(VendorContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) navigate(AUTH_VENDOR_ROUTE);
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
      {isProfileComplete(user) ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Chart chartData={chartData} />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
          <Typography component="p" variant="h4" align="center" color="error">
            Profile Incomplete!
          </Typography>
          <Typography component="p" variant="body1" align="center" color="text.secondary">
            Update your profile with all the necessary details to become a product/service provider!
          </Typography>
          <Button onClick={() => navigate(PROFILE_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
            Update Profile
          </Button>
        </Stack>
      )}
      <Footer />
    </Box>
  ) : null;
};

export default Dashboard;
