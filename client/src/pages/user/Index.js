import React, { lazy, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Routes, Route } from "react-router-dom";
// mui
import { Drawer, Toolbar, Stack, Typography } from "@mui/material";
// constants
import { COMPANY } from "../../constants/variables";
import { PRODUCTS_GET_CART_ENDPOINT, PRODUCTS_GET_WISHLIST_ENDPOINT, PRODUCT_GET_ORDERS_ENDPOINT, PRODUCT_GET_PRODUCTS_BY_LOCATION_ENDPOINT } from "../../constants/endpoints";
// components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import SelectCategoryDialog from "../../components/SelectCategoryDialog";
import LocationRangeDialog from "../../components/LocationRangeDialog";
// mui
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { LightMode, DarkMode, LocationSearching, Category } from "@mui/icons-material";
// contexts
import AppContext from "../../contexts/AppContext";
import UserContext from "../../contexts/UserContext";
// utils
import { movingAverage, getLocation } from "../../utils";
// vars
const COIN_VALUE_FACTOR = 0.001;
// pages
const Home = lazy(() => import("./Home"));
const Orders = lazy(() => import("./Orders"));
const Cart = lazy(() => import("./Cart"));
const WishList = lazy(() => import("./WishList"));
const Profile = lazy(() => import("./Profile"));
const Search = lazy(() => import("./Search"));

const Index = () => {
  const [user, setUser] = useState({});
  const { users, mode, handleMode, category, setCategory } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coinValue, setCoinValue] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationRangeOpen, setLocationRangeOpen] = useState(false);
  const [locationRange, setLocationRange] = useState([0, 1000]);
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = useCallback(category => {
    (async () => {
      try {
        const query = {};
        const coordinates = await getLocation();
        query["availability"] = "true";
        query["location"] = { coordinates, minDist: locationRange[0] || 0, maxDist: locationRange[1] || 1000 };
        if(category) query["category"] = category;
        setIsLoading(true);
        axios
          .get(PRODUCT_GET_PRODUCTS_BY_LOCATION_ENDPOINT, { params: query })
          .then((res) => {
            setProducts(res.data.data);
            setLocationRangeOpen(false);
            setIsLoading(false);
            window.scrollTo(0, 0);
          })
          .catch((err) => {
            setLocationRangeOpen(false);
            setIsLoading(false);
            window.scrollTo(0, 0);
          });
      } catch (err) {
        setLocationRangeOpen(false);
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    })();
  }, [setProducts]);

  useEffect(() => {
    getProducts(category);
  }, [category, locationRange, getProducts]);

  useEffect(() => {
    const user = users.find((user) => user.role === "user");
    setUser(user);
  }, [users]);

  useEffect(() => {
    if (user && user._id) {
      try {
        axios
          .get(PRODUCTS_GET_WISHLIST_ENDPOINT, { params: { userId: user._id } })
          .then((res) => {
            const productIds = res.data.data;
            const wishlist = products.filter((product) => productIds.includes(product._id));
            setWishlist(wishlist);
          })
          .catch((err) => {
            console.log(err);
          });
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
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
      try {
        axios
          .get(PRODUCT_GET_ORDERS_ENDPOINT, { params: { from: user._id } })
          .then((res) => {
            const orders = res.data.data;
            const costs = {};
            orders.forEach((order) => {
              let total = 0;
              const date = new Date(order.createdAt).toLocaleDateString();
              order.products.forEach((product) => (total += Number(product.quantity || 0) * Number(product.price || 0)));
              if (costs[date]) costs[date] += total;
              else costs[date] = total;
            });
            // fill missing dates
            const minDate = new Date(Math.min(...Object.keys(costs).map((c) => new Date(c)))).toLocaleDateString();
            const maxDate = new Date(Math.max(...Object.keys(costs).map((c) => new Date(c)))).toLocaleDateString();
            for (let d = new Date(minDate); d <= new Date(maxDate); d.setDate(d.getDate() + 1)) {
              const date = new Date(d).toLocaleDateString();
              if (!costs[date]) costs[date] = 0;
            }
            // calculate coin value ~ moving average ~ weekly
            const ma = movingAverage(7, Object.values(costs));
            if (ma.length) {
              const coinValue = COIN_VALUE_FACTOR * ma[ma.length - 1];
              setCoinValue(coinValue);
            }
            setOrders(orders);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, [user, products]);

  useEffect(() => {
    const locationRange = JSON.parse(localStorage.getItem(COMPANY))?.range;
    if (locationRange) setLocationRange(locationRange);
  }, [setLocationRange]);

  useEffect(() => setUser((user) => (user && user._id ? { ...user, coinValue } : user)), [coinValue]);

  const handleLocationRange = () => getProducts(locationRange[0], locationRange[1]);

  return (
    <>
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      <SpeedDial sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 3, p: 2 }} icon={<SpeedDialIcon />} direction={"up"} ariaLabel="SpeedDial playground example">
        {mode !== "light" ? <SpeedDialAction onClick={() => handleMode("light")} icon={<LightMode />} tooltipTitle={"Light Mode"} /> : null}
        {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkMode />} tooltipTitle={"Dark Mode"} /> : null}
        <SpeedDialAction onClick={() => setLocationRangeOpen(true)} icon={<LocationSearching />} tooltipTitle={"Location Range"} />
        <SpeedDialAction onClick={() => setCategoryOpen(true)} icon={<Category />} tooltipTitle={"Categories"} />
      </SpeedDial>
      <UserContext.Provider
        value={{
          user,
          setUser,
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
        <Toolbar />
        <Routes>
          <Route exact path="/search/:search" element={<Search />} />
          <Route exact path="/orders" element={<Orders />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="wishlist" element={<WishList />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
        <Drawer anchor={"bottom"} open={Boolean(product)} onClose={() => setProduct(null)} onOpen={() => {}} sx={{ zIndex: 10000 }}>
          <Product />
        </Drawer>
        <LocationRangeDialog locationRange={locationRange} setLocationRange={setLocationRange} locationRangeOpen={locationRangeOpen} setLocationRangeOpen={setLocationRangeOpen} />
        <SelectCategoryDialog category={category} setCategory={setCategory} categoryOpen={categoryOpen} setCategoryOpen={setCategoryOpen} />
        <Footer sx={{ mb: products?.length ? 4 : 0 }} />
        {products?.filter(product => category ? product.category === category : true)?.length ? (
          <Stack
            sx={{
              position: "fixed",
              width: "100vw",
              left: 0,
              bottom: 0,
              backgroundColor: "primary.main",
              fontSize: "20px",
              textAlign: "center",
              p: 0.5,
            }}
          >
            <marquee behavior="scroll" direction="left" scrollamount="10">
              {products.filter(product => category ? product.category === category : true).slice(0, 5).map((product) => (
                <Typography component="span" variant="body1" align="left" color="white">
                  {product.title} | {product.ownerName} | {product.category} | {product.price} {product.currency}
                </Typography>
              ))}
            </marquee>
          </Stack>
        ) : null}
      </UserContext.Provider>
    </>
  );
};

export default Index;
