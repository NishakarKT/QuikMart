import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
// components
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";
// contexts
import UserContext from "../../contexts/UserContext";
// constants
import { COMPANY } from "../../constants/variables";
import { CART_ROUTE, HOME_ROUTE, AUTH_USER_ROUTE } from "../../constants/routes";
import { PRODUCT_EMPTY_WISHLIST_ENDPOINT, PRODUCT_WISHLIST_TO_CART_ENDPOINT } from "../../constants/endpoints";
// mui
import { Box, Grid, Stack, Button, Pagination, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
//  variables
const ITEMS_PER_PAGE = 8;

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, setCart, wishlist, setWishlist } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_USER_ROUTE);
  }, [user, navigate]);

  const handlePage = (page) => {
    setPage(page);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const clearWishList = () => {
    setIsLoading(true);
    try {
      axios
        .patch(PRODUCT_EMPTY_WISHLIST_ENDPOINT, { userId: user._id })
        .then((res) => {
          setWishlist([]);
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

  const addToCart = () => {
    setIsLoading(true);
    try {
      axios
        .patch(PRODUCT_WISHLIST_TO_CART_ENDPOINT, { userId: user._id })
        .then((res) => {
          setCart((cart) => {
            wishlist.forEach((product) => {
              if (cart.findIndex((prod) => prod._id === product._id) === -1) cart.push(product);
            });
            return cart;
          });
          setWishlist([]);
          navigate(CART_ROUTE);
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
        <title>Wishlist | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      {user ? (
        <Box p={2}>
          <Stack>
            {wishlist.length ? (
              <>
                <Stack justifyContent="flex-end" direction="row" spacing={1} px={1}>
                  <Button onClick={clearWishList} variant="outlined" startIcon={<RemoveShoppingCartIcon />}>
                    Clear
                  </Button>
                  <Button onClick={addToCart} variant="contained" startIcon={<AddShoppingCartIcon />}>
                    Add To Cart
                  </Button>
                </Stack>
                <Grid container>
                  {wishlist.slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page).map((product) => (
                    <Grid item xs={12} sm={6} lg={3} p={1} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
                <Pagination
                  onChange={(e, page) => handlePage(page)}
                  sx={{ alignSelf: "center", m: 4 }}
                  count={Math.ceil(wishlist.length / ITEMS_PER_PAGE)}
                  color="primary"
                />
              </>
            ) : (
              <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
                <Typography component="p" variant="h4" align="center" color="text.secondary">
                  An Empty Wishlist!
                </Typography>
                <Typography component="p" variant="body1" align="center" sx={{ color: "grey" }}>
                  You haven't added any products/services to your wishlist. Add one today!
                </Typography>
                <Button onClick={() => navigate(HOME_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
                  Explore Products
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      ) : null}
    </>
  );
};

export default Wishlist;
