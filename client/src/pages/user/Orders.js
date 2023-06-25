import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// contexts
import UserContext from "../../contexts/UserContext";
// constants
import { COMPANY } from "../../constants/variables";
import { CART_ROUTE, AUTH_USER_ROUTE } from "../../constants/routes";
// mui
import {
  Box,
  Stack,
  Button,
  Pagination,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
// components
import Order from "./Order";
//  variables
const ITEMS_PER_PAGE = 8;

const Orders = () => {
  const navigate = useNavigate();
  const { user, orders } = useContext(UserContext);
  const [pendingOrdersPage, setPendingOrdersPage] = useState(1);
  const [pastOrdersPage, setPastOrdersPage] = useState(1);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    if (!user) navigate(AUTH_USER_ROUTE);
  }, [user, navigate]);

  useEffect(() => {
    if (orders.length) {
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

  return (
    <>
      <Helmet>
        <title>Orders | {COMPANY}</title>
      </Helmet>
      {user ? (
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" variant="h5">
              Pending Orders
            </Typography>
          </Stack>
          {pendingOrders.length ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sl No.</TableCell>
                      <TableCell>Date / Time</TableCell>
                      <TableCell>Owner</TableCell>
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
              <Typography component="p" variant="h4" align="center" color="text.secondary">
                No Pending Orders!
              </Typography>
              <Typography component="p" variant="body1" align="center" color="text.secondary">
                You haven't ordered recently. Order from the cart!
              </Typography>
              <Button onClick={() => navigate(CART_ROUTE)} variant="contained">
                Go To Cart
              </Button>
            </Stack>
          )}
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" variant="h5">
              Past Orders
            </Typography>
          </Stack>
          {pastOrders.length ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sl No.</TableCell>
                      <TableCell>Date / Time</TableCell>
                      <TableCell>Owner</TableCell>
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
              <Typography component="p" variant="h4" align="center" color="text.secondary">
                No Past Orders!
              </Typography>
              <Typography component="p" variant="body1" align="center" color="text.secondary">
                You haven't ordered in the past. Order from the cart!
              </Typography>
              <Button onClick={() => navigate(CART_ROUTE)} variant="contained">
                Go To Cart
              </Button>
            </Stack>
          )}
        </Box>
      ) : null}
    </>
  );
};

export default Orders;
