import React, { lazy, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate } from "react-router-dom";
// mui
import { makeStyles } from "@mui/styles";
import { Container, Drawer } from "@mui/material";
// constants
import { COMPANY } from "../../constants/variables";
import {
  PRODUCTS_GET_CART_ENDPOINT,
  PRODUCTS_GET_WISHLIST_ENDPOINT,
  PRODUCT_GET_ORDERS_ENDPOINT,
  PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT,
} from "../../constants/endpoints";
// components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Product from "../../components/Product";
// import SelectCategoryDialog from "../../components/SelectCategoryDialog";
// import LocationRangeDialog from "../../components/LocationRangeDialog";
// mui
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
// contexts
import AppContext from "../../contexts/AppContext";
import HomeContext from "../../contexts/HomeContext";
// // utils
// import { getLocation } from "../../utils";
// pages
const Home = lazy(() => import("./Home"));
const Orders = lazy(() => import("./Orders"));
const Cart = lazy(() => import("./Cart"));
const WishList = lazy(() => import("./WishList"));
const Profile = lazy(() => import("./Profile"));
const Search = lazy(() => import("./Search"));
// styles
const useStyles = makeStyles({
  container: {
    maxWidth: "100% !important",
    overflowX: "hidden",
  },
});

const Index = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const { users, mode, handleMode, category, setCategory } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [categoryOpen, setCategoryOpen] = useState(false);
  // const [locationRangeOpen, setLocationRangeOpen] = useState(false);
  const [locationRange, setLocationRange] = useState([0, 40000]);

  const getProducts = useCallback(() => {
    (async () => {
      try {
        const query = {};
        // const coordinates = await getLocation();
        query["availability"] = "true";
        // query["location"] = { coordinates, minDist: locationRange[0] || 0, maxDist: locationRange[1] || 1000 };
        axios
          .get(PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT, { params: query })
          .then((res) => {
            setProducts(res.data.data);
            // setLocationRangeOpen(false);
            window.scrollTo(0, 0);
          })
          .catch((err) => {
            // setLocationRangeOpen(false);
            window.scrollTo(0, 0);
          });
      } catch (err) {
        // setLocationRangeOpen(false);
        window.scrollTo(0, 0);
      }
    })();
  }, [setProducts]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    const user = users.find((user) => user.role === "admin");
    setUser(user);
  }, [users]);

  useEffect(() => {
    if (user) {
      try {
        axios
          .get(PRODUCTS_GET_WISHLIST_ENDPOINT, { params: { userId: user._id } })
          .then((res) => {
            const productIds = res.data.data;
            const wishlist = products.filter((product) => productIds.includes(product._id));
            setWishlist(wishlist);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
      try {
        axios
          .get(PRODUCTS_GET_CART_ENDPOINT, { params: { userId: user._id } })
          .then((res) => {
            const productIds = res.data.data;
            const cart = products.filter((product) => productIds.includes(product._id));
            setCart(cart);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
      try {
        axios
          .get(PRODUCT_GET_ORDERS_ENDPOINT, { params: { from: user._id } })
          .then((res) => {
            setOrders(res.data.data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  }, [user, products]);

  useEffect(() => {
    const category = JSON.parse(localStorage.getItem(COMPANY))?.category;
    if (category) setCategory(category);
  }, [setCategory]);

  const handleLocationRange = () => getProducts(locationRange[0], locationRange[1]);

  return (
    <Container disableGutters className={classes.container}>
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      <SpeedDial
        sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 3, p: 2 }}
        icon={<SpeedDialIcon />}
        direction={"up"}
        ariaLabel="SpeedDial playground example"
      >
        {mode !== "light" ? <SpeedDialAction onClick={() => handleMode("light")} icon={<LightMode />} tooltipTitle={"Light Mode"} /> : null}
        {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkMode />} tooltipTitle={"Dark Mode"} /> : null}
        {/* <SpeedDialAction onClick={() => setLocationRangeOpen(true)} icon={<LocationSearching />} tooltipTitle={"Location Range"} />
        <SpeedDialAction onClick={() => setCategoryOpen(true)} icon={<Category />} tooltipTitle={"Categories"} /> */}
      </SpeedDial>
      <HomeContext.Provider
        value={{
          user,
          product,
          setProduct,
          products,
          setProducts,
          locationRange,
          category,
          setLocationRange,
          handleLocationRange,
          wishlist,
          setWishlist,
          cart,
          setCart,
          orders,
          setOrders,
        }}
      >
        <Navbar />
        <Routes>
          <Route exact path="/search/:query" element={<Search />} />
          <Route exact path="/orders" element={<Orders />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="wishlist" element={<WishList />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
        <Drawer anchor={"bottom"} open={Boolean(product)} onClose={() => setProduct(null)} onOpen={() => {}} sx={{ zIndex: 10000 }}>
          <Product />
        </Drawer>
        {/* <LocationRangeDialog
          locationRange={locationRange}
          setLocationRange={setLocationRange}
          locationRangeOpen={locationRangeOpen}
          setLocationRangeOpen={setLocationRangeOpen}
        /> */}
        {/* <SelectCategoryDialog category={category} setCategory={setCategory} categoryOpen={categoryOpen} setCategoryOpen={setCategoryOpen} /> */}
        <Footer />
      </HomeContext.Provider>
    </Container>
  );
};

export default Index;
