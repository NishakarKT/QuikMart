import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// contexts
import HomeContext from "../../contexts/HomeContext";
// constants
import { PRODUCT_CANCEL_ORDERS_ENDPOINT } from "../../constants/endpoints"
// mui
import { Stack, Grid, Box, Collapse, TableCell, TableRow, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Close, CheckCircle, Cancel } from '@mui/icons-material';

const Order = ({ index, order, isPast }) => {
    const { setOrders } = useContext(HomeContext);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (order?.products?.length) {
            let total = 0;
            order.products.forEach(product => total += Number(product.price || 0));
            setTotal(total);
        } else
            setTotal(0);
    }, [order]);

    const cancelOrder = orderId => {
        if (window.confirm("Are you sure you want to cancel this order?"))
            try {
                axios.patch(PRODUCT_CANCEL_ORDERS_ENDPOINT, { _id: orderId })
                    .then(res => {
                        alert("Order cancelled!");
                        setOrders(orders => {
                            const idx = orders.findIndex(order => order._id === orderId);
                            if (idx !== -1)
                                orders[idx] = { ...orders[idx], status: "cancelled" };
                            return orders;
                        });
                    })
                    .catch(err => console.log(err))
            } catch (err) { console.log(err); };
    };

    return (
        <React.Fragment>
            <TableRow onClick={() => setOpen(open => !open)} sx={{ '& > *': { borderBottom: 'unset' }, cursor: "pointer", "&::hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>{(new Date(order.createdAt)).toLocaleString()}</TableCell>
                <TableCell>{order.toName}</TableCell>
                <TableCell align="center">{total}</TableCell>
                {isPast ? <TableCell align="center">{order.status === "accepted" ? <CheckCircle color="success" /> : <Cancel color="error" />}</TableCell> : null}
            </TableRow>
            <TableRow sx={{ cursor: "pointer" }}>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Stack flex={2} p={2} style={{ width: "100%", overflowX: "hidden", overflowY: "auto" }}>
                                <Grid item xs={12} md={8} mb={{ xs: 5, md: 0 }}>
                                    <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ display: "flex", mt: 2 }}>
                                        <Typography component="h1" variant="h4" gutterBottom>Order Details</Typography>
                                        {!isPast ? <Button onClick={() => cancelOrder(order._id)} sx={{ height: "fit-content" }} color="error" type="submit" variant="contained" startIcon={<Close />}>Cancel</Button> : null}
                                    </Stack>
                                    <Stack>
                                        <Typography variant="h6" gutterBottom>Your Order</Typography>
                                        <List disablePadding>
                                            {order?.products?.map((product, index) => (
                                                <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
                                                    <ListItemText primary={product.quantity + " " + product.title} secondary={product.desc} />
                                                    <Typography variant="body2">{product.quantity + " x " + product.price + " = " + (Number(product.quantity) * Number(product.price))}</Typography>
                                                </ListItem>
                                            ))}
                                            <ListItem sx={{ py: 1, px: 0 }}>
                                                <ListItemText primary={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{total}</Typography>
                                            </ListItem>
                                        </List>
                                    </Stack>
                                </Grid>
                            </Stack>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default Order;