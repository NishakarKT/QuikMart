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
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Pagination,
  TableContainer,
} from "@mui/material";
// components
import Chart from "./Chart";
import Order from "./Order";
import Footer from "../../components/Footer";
// contexts
import VendorContext from "../../contexts/VendorContext";
// constants
import { AUTH_VENDOR_ROUTE, VENDOR_NEW_PRODUCTS_ROUTE, VENDOR_PRODUCTS_ROUTE, VENDOR_PROFILE_ROUTE } from "../../constants/routes";
// data
const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, orders, isProfileComplete } = useContext(VendorContext);
  const [chartData, setChartData] = useState([]);
  const [sales, setSales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [pendingOrdersPage, setPendingOrdersPage] = useState(1);
  const [pastOrdersPage, setPastOrdersPage] = useState(1);

  useEffect(() => {
    if (!user) navigate(AUTH_VENDOR_ROUTE);
  }, [user, navigate]);

  useEffect(() => {
    if (orders?.length) {
      // handle chart data
      const chartData = {};
      orders
        .filter((order) => order.status === "accepted")
        .forEach((order) => {
          let amount = 0,
            quantity = 0;
          const date = new Date(order.createdAt).toLocaleString();
          order.products.forEach((product) => {
            amount += Number(product.quantity || 0) * Number(product.price || 0);
            quantity += Number(product.quantity || 0);
          });
          if (chartData[date]) {
            chartData[date].amount += amount;
            chartData[date].quantity += quantity;
          } else chartData[date] = { amount, quantity };
        });
      // handle today's sales
      setSales(0);
      Object.keys(chartData)
        .filter((key) => key.includes(new Date().toLocaleDateString()))
        .forEach((key) => setSales((sales) => sales + chartData[key].amount));
      // handle chart data
      setChartData(Object.keys(chartData).map((key) => ({ date: key, amount: chartData[key].amount, quantity: chartData[key].quantity })));
      // handle orders
      setPendingOrders(orders.filter((order) => order.status === "pending"));
      setPastOrders(orders.filter((order) => order.status !== "pending"));
    }
  }, [orders]);

  const handlePastOrdersPage = (page) => {
    setPastOrdersPage(page);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handlePendingOrdersPage = (page) => {
    setPendingOrdersPage(page);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

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
          <Grid item xs={12} md={8} lg={9}>
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
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Sales Today
              </Typography>
              <Typography component="p" variant="h4">
                {sales}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1, mb: 1 }}>
                on {new Date().toLocaleDateString()}
              </Typography>
              <Button variant="contained" onClick={() => navigate(VENDOR_NEW_PRODUCTS_ROUTE)}>
                Create a Product
              </Button>
            </Paper>
          </Grid>
          {/* Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Pending Orders
                </Typography>
              </Stack>
              {pendingOrders.length ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Sl No.</TableCell>
                          <TableCell>Date / Time</TableCell>
                          <TableCell>From</TableCell>
                          <TableCell align="center">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingOrders
                          .slice((pendingOrdersPage - 1) * ITEMS_PER_PAGE, pendingOrdersPage * ITEMS_PER_PAGE)
                          .map((order, index) => (
                            <Order key={order._id} index={index} order={order} />
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                    onChange={(e, value) => handlePendingOrdersPage(value)}
                    count={Math.ceil((pendingOrders.length || 1) / ITEMS_PER_PAGE)}
                    color="primary"
                  />
                </>
              ) : (
                <Stack py={4} spacing={2} alignItems="center" justifyContent="center">
                  <Typography component="p" variant="h6" align="center" color="error">
                    No Pending Orders!
                  </Typography>
                  <Typography component="p" variant="body1" align="center" color="text.secondary">
                    You haven't recieved orders recently. Go to your products!
                  </Typography>
                  <Button onClick={() => navigate(VENDOR_PRODUCTS_ROUTE)} variant="contained">
                    Go To Products
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Past Orders
                </Typography>
              </Stack>
              {pastOrders.length ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Sl No.</TableCell>
                          <TableCell>Date / Time</TableCell>
                          <TableCell>From</TableCell>
                          <TableCell align="center">Price</TableCell>
                          <TableCell align="center">Accepted</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pastOrders.slice((pastOrdersPage - 1) * ITEMS_PER_PAGE, pastOrdersPage * ITEMS_PER_PAGE).map((order, index) => (
                          <Order key={order._id} index={index} order={order} isPast />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                    onChange={(e, value) => handlePastOrdersPage(value)}
                    count={Math.ceil((pastOrders.length || 1) / ITEMS_PER_PAGE)}
                    color="primary"
                  />
                </>
              ) : (
                <Stack py={4} spacing={2} alignItems="center" justifyContent="center">
                  <Typography component="p" variant="h6" align="center" color="error">
                    No Past Orders!
                  </Typography>
                  <Typography component="p" variant="body1" align="center" color="text.secondary">
                    You haven't recieved orders in the past. Go to your products!
                  </Typography>
                  <Button onClick={() => navigate(VENDOR_PRODUCTS_ROUTE)} variant="contained">
                    Go To Products
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
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
