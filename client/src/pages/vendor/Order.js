import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// contexts
import VendorContext from "../../contexts/VendorContext";
// components
import Loader from "../../components/Loader";
// utils
import { truncateStr } from "../../utils";
// constants
import { PRODUCT_CANCEL_ORDERS_ENDPOINT, PRODUCT_ACCEPT_ORDERS_ENDPOINT } from "../../constants/endpoints";
// mui
import { Stack, Grid, Box, Collapse, TableCell, TableRow, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Close, CheckCircle, Cancel } from "@mui/icons-material";

const Order = ({ index, order, isPast }) => {
  const { setOrders } = useContext(VendorContext);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (order?.products?.length) {
      let total = 0;
      order.products.forEach((product) => (total += Number(product.quantity || 0) * Number(product.price || 0)));
      setTotal(total);
    } else setTotal(0);
  }, [order]);

  const cancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?"))
      try {
        setIsLoading(true);
        axios
          .patch(PRODUCT_CANCEL_ORDERS_ENDPOINT, { _id: orderId })
          .then((res) => {
            alert("Order cancelled!");
            setOrders((orders) => orders.map((order) => (order._id === orderId ? { ...order, status: "cancelled" } : order)));
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
  };

  const acceptOrder = (orderId) => {
    if (window.confirm("Are you sure you want to accept this order?"))
      try {
        setIsLoading(true);
        axios
          .patch(PRODUCT_ACCEPT_ORDERS_ENDPOINT, { _id: orderId })
          .then((res) => {
            alert("Order accepted!");
            setOrders((orders) => orders.map((order) => (order._id === orderId ? { ...order, status: "accepted" } : order)));
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <TableRow
        onClick={() => setOpen((open) => !open)}
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer", "&::hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
        <TableCell>{order.fromName}</TableCell>
        <TableCell align="center">{total}</TableCell>
        {isPast ? (
          <TableCell align="center">{order.status === "accepted" ? <CheckCircle color="success" /> : <Cancel color="error" />}</TableCell>
        ) : null}
      </TableRow>
      <TableRow sx={{ cursor: "pointer" }}>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Stack flex={2} p={2} style={{ width: "100%", overflowX: "hidden", overflowY: "auto" }}>
                <Grid item xs={12} mb={{ xs: 5, md: 0 }}>
                  <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ display: "flex", mt: 2 }}>
                    <Typography component="h2" variant="h6" color="primary">
                      Order Details{" "}
                    </Typography>
                    {!isPast ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => cancelOrder(order._id)}
                          sx={{ height: "fit-content" }}
                          color="error"
                          type="submit"
                          variant="contained"
                          startIcon={<Close />}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => acceptOrder(order._id)}
                          sx={{ height: "fit-content" }}
                          color="success"
                          type="submit"
                          variant="contained"
                          startIcon={<CheckCircle />}
                        >
                          Accept
                        </Button>
                      </Stack>
                    ) : null}
                  </Stack>
                  <Stack>
                    <List disablePadding>
                      {order?.products?.map((product, index) => (
                        <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
                          <ListItemText primary={product.title} secondary={truncateStr(product.desc, 400)} />
                          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                            {product.quantity + " x " + product.price + " = " + Number(product.quantity) * Number(product.price)}
                          </Typography>
                        </ListItem>
                      ))}
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" color="error" sx={{ fontWeight: 700 }}>
                              Total
                            </Typography>
                          }
                        />
                        <Typography variant="subtitle1" color="error" sx={{ fontWeight: 700 }}>
                          {total}
                        </Typography>
                      </ListItem>
                    </List>
                  </Stack>
                </Grid>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Order;
