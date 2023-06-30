import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
// contexts
import UserContext from "../../contexts/UserContext";
// constants
import { COMPANY } from "../../constants/variables";
import { WISHLIST_ROUTE, HOME_ROUTE, AUTH_USER_ROUTE } from "../../constants/routes";
import {
  PRODUCT_EMPTY_CART_ENDPOINT,
  PRODUCT_REMOVE_FROM_CART_ENDPOINT,
  PRODUCT_CART_TO_WISHLIST_ENDPOINT,
  PRODUCT_NEW_ORDERS_ENDPOINT,
  USER_ENDPOINT,
} from "../../constants/endpoints";
// components
import Loader from "../../components/Loader";
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
  TextField,
} from "@mui/material";
import { CheckCircle, Cancel, AddCircle } from "@mui/icons-material";
import { IMAGES_WEBSITE_LOGO_BLACK_PNG } from "../../constants/images";
//  variables
const ITEMS_PER_PAGE = 8;
const COIN_FACTOR = 0.05;

const Cart = () => {
  const navigate = useNavigate();
  const { user, setUser, setWishlist, cart, setCart, setOrders } = useContext(UserContext);
  const [orderPage, setOrderPage] = useState(1);
  const [cartPage, setCartPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_USER_ROUTE);
  }, [user, navigate]);

  useEffect(() => {
    let total = 0;
    order.forEach((o) => (total += (Number(o.price) || 0) * Number(o.quantity) || 0));
    setTotal(total);
  }, [order]);

  const generateQuikCoins = (total) => total * COIN_FACTOR;

  const openRazorpayPopup = ({ coins, generatedCoins, updatedCoins, finalOrders }) => {
    if (!coins) {
      const options = {
        key: "rzp_test_IAmcmWJGGwBS6X",
        amount: total * 100, // Amount in paisa (e.g., 10000 = ₹100)
        currency: "INR",
        name: COMPANY,
        description: "Purchase Description",
        image: IMAGES_WEBSITE_LOGO_BLACK_PNG,
        handler: (res) => {
          setIsLoading(true);
          axios
            .post(PRODUCT_NEW_ORDERS_ENDPOINT, finalOrders)
            .then((res) => {
              setOrders((orders) => [...orders, ...finalOrders.map((order) => ({ ...order, createdAt: new Date().toISOString() }))]);
              axios
                .patch(USER_ENDPOINT, { _id: user._id, edits: { coins: updatedCoins } })
                .then((res) => {
                  setUser((user) => ({ ...user, coins: updatedCoins }));
                  alert("Orders have been placed!" + (!coins ? "You earned " + generatedCoins + " coins" : ""));
                  clearOrder();
                  setIsLoading(false);
                })
                .catch((err) => {
                  alert("Orders have been placed!");
                  clearOrder();
                  setIsLoading(false);
                });
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact,
        },
        theme: {
          color: "#1976d2",
        },
      };
      if (window && window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.log("Razorpay script is not loaded.");
      }
    } else {
      setIsLoading(true);
      axios
        .post(PRODUCT_NEW_ORDERS_ENDPOINT, finalOrders)
        .then((res) => {
          setOrders((orders) => [...orders, ...finalOrders.map((order) => ({ ...order, createdAt: new Date().toISOString() }))]);
          axios
            .patch(USER_ENDPOINT, { _id: user._id, edits: { coins: updatedCoins } })
            .then((res) => {
              setUser((user) => ({ ...user, coins: updatedCoins }));
              alert("Orders have been placed!" + (!coins ? "You earned " + generatedCoins + " coins" : ""));
              clearOrder();
              setIsLoading(false);
            })
            .catch((err) => {
              alert("Orders have been placed!");
              clearOrder();
              setIsLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const handleOrderPage = (page) => {
    setOrderPage(page);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleCartPage = (page) => {
    setCartPage(page);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const placeOrder = (coins = 0) => {
    const orders = {};
    order.forEach((product) => {
      const data = {
        _id: product._id,
        title: product.title,
        desc: product.desc,
        price: product.price,
        currency: product.currency,
        quantity: product.quantity,
      };
      if (!orders[product.owner]) orders[product.owner] = [data];
      else orders[product.owner].push(data);
    });
    const finalOrders = Object.keys(orders).map((owner) => ({
      from: user._id,
      fromName: user.name,
      to: owner,
      toName: order.find((product) => product.owner === owner)?.ownerName,
      status: "pending",
      products: orders[owner],
    }));
    let total = 0;
    Object.values(orders).forEach((orders) =>
      orders.forEach((order) => (total += (Number(order.quantity) || 0) * (Number(order.price) || 0)))
    );
    const generatedCoins = generateQuikCoins(total);
    const updatedCoins = (Number(user.coins) || 0) + (coins ? -coins : generatedCoins);
    openRazorpayPopup({ total, coins, generatedCoins, updatedCoins, finalOrders });
  };

  const handleQuanitity = (e, product) => {
    setOrder((order) => {
      const idx = order.findIndex((prod) => prod._id === product._id);
      if (idx !== -1) order[idx] = { ...order[idx], quantity: e.target.value };
      return [...order];
    });
  };

  const handleOrder = (product) => {
    setOrder((order) => {
      if (order.findIndex((prod) => prod._id === product._id) === -1) return [...order, { ...product, quantity: 1 }];
      else return order;
    });
    window.scrollTo(0, 0);
  };

  const handleOrders = () => {
    setOrder(cart.filter((product) => product.availability === "true").map((product) => ({ ...product, quantity: 1 })));
    window.scrollTo(0, 0);
  };

  const clearOrder = () => {
    setOrder([]);
    window.scrollTo(0, 0);
  };

  const clearCart = () => {
    try {
      setIsLoading(true);
      axios
        .patch(PRODUCT_EMPTY_CART_ENDPOINT, { userId: user._id })
        .then((res) => {
          setCart([]);
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

  const moveToWishlist = () => {
    try {
      setIsLoading(true);
      axios
        .patch(PRODUCT_CART_TO_WISHLIST_ENDPOINT, { userId: user._id })
        .then((res) => {
          setWishlist((wishlist) => [...wishlist, ...cart]);
          setCart([]);
          navigate(WISHLIST_ROUTE);
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

  const handleRemove = (product) => {
    try {
      setIsLoading(true);
      axios
        .patch(PRODUCT_REMOVE_FROM_CART_ENDPOINT, { userId: user._id, productId: product._id })
        .then((res) => {
          setCart(cart.filter((prod) => prod._id !== product._id));
          alert(product.title + " removed from cart!");
          window.scrollTo(0, 0);
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

  return (
    <>
      <Helmet>
        <title>Cart | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      {user ? (
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" variant="h5">
              My Order
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="error" onClick={() => clearOrder()}>
                Empty Order
              </Button>
              {order.length && user && user.coinValue ? (
                <Button
                  disabled={Number(user.coins) < total / user.coinValue}
                  color="warning"
                  variant="contained"
                  onClick={() => placeOrder(total / user.coinValue)}
                >
                  {Number(user.coins) < total / user.coinValue ? "Insufficient Coins" : "Use Coins"}
                </Button>
              ) : null}
              <Button disabled={!order.length} color="success" variant="contained" onClick={() => placeOrder()}>
                Place Order
              </Button>
            </Stack>
          </Stack>
          {order.length ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sl No.</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Currency</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Total</TableCell>
                      <TableCell align="center">Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE).map((product, index) => (
                      <TableRow key={product._id} sx={{ "& > *": { borderBottom: "unset" } }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell align="center">{product.price}</TableCell>
                        <TableCell align="center">{product.currency}</TableCell>
                        <TableCell align="center">
                          <TextField
                            onChange={(e) => handleQuanitity(e, product)}
                            variant="standard"
                            label="Quantity"
                            defaultValue={1}
                            type="number"
                            inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell align="center">{(Number(product.quantity) || 0) * (Number(product.price) || 0)}</TableCell>
                        <TableCell align="center">
                          <Cancel
                            sx={{ cursor: "pointer" }}
                            onClick={() => setOrder((order) => order.filter((prod) => prod._id !== product._id))}
                            color="error"
                            fontSize="large"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={12} align="left">
                        <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography component="span">
                              <Typography component="span" sx={{ color: "error.main" }}>
                                Total:{" "}
                              </Typography>
                              {total}
                            </Typography>
                          </Box>
                          {user.coinValue ? (
                            <Box>
                              <Typography component="span">
                                <Typography component="span" sx={{ color: "warning.main" }}>
                                  QuikCoins:{" "}
                                </Typography>
                                {(total / user.coinValue).toFixed(2)}
                              </Typography>
                            </Box>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                onChange={(e, value) => handleOrderPage(value)}
                count={Math.ceil((order.length || 1) / ITEMS_PER_PAGE)}
                color="primary"
              />
            </>
          ) : (
            <Stack py={4} spacing={2} alignItems="center" justifyContent="center">
              <Typography color="text.secondary" component="p" variant="h4" align="center">
                No Order Yet!
              </Typography>
              <Typography color="text.secondary" component="p" variant="body1" align="center">
                You haven't careted any order. Add one from the cart!
              </Typography>
            </Stack>
          )}
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" variant="h5">
              My Cart
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="error" onClick={() => clearCart()}>
                Empty Cart
              </Button>
              <Button variant="outlined" onClick={() => moveToWishlist(cart)}>
                Move To Wishlist
              </Button>
              <Button variant="contained" onClick={() => handleOrders()}>
                Add to Order
              </Button>
            </Stack>
          </Stack>
          {cart.length ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sl No.</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Currency</TableCell>
                      <TableCell align="center">Availability</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.slice((cartPage - 1) * ITEMS_PER_PAGE, cartPage * ITEMS_PER_PAGE).map((product, index) => (
                      <TableRow key={product._id} sx={{ "& > *": { borderBottom: "unset" } }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell align="center">{product.price}</TableCell>
                        <TableCell align="center">{product.currency}</TableCell>
                        <TableCell align="center">
                          {product.availability === "true" ? <CheckCircle color="success" /> : <Cancel color="error" />}
                        </TableCell>
                        <TableCell align="center">
                          <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                            <AddCircle color="success" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => handleOrder(product)} />
                            <Cancel fontSize="large" sx={{ cursor: "pointer" }} onClick={() => handleRemove(product)} color="error" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                onChange={(e, value) => handleCartPage(value)}
                count={Math.ceil((cart.length || 1) / ITEMS_PER_PAGE)}
                color="primary"
              />
            </>
          ) : (
            <Stack py={4} spacing={2} alignItems="center" justifyContent="center">
              <Typography color="text.secondary" component="p" variant="h4" align="center">
                An Empty Cart!
              </Typography>
              <Typography color="text.secondary" component="p" variant="body1" align="center">
                You haven't added any products/services to your cart. Add one today!
              </Typography>
              <Button onClick={() => navigate(HOME_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
                Explore Products
              </Button>
            </Stack>
          )}
        </Box>
      ) : null}
    </>
  );
};

export default Cart;
