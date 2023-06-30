import React, { useState, useContext, lazy, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// mui
import { styled } from "@mui/material/styles";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  colors,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsightsIcon from "@mui/icons-material/Insights";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
// components
import Loader from "../../components/Loader";
// contexts
import AppContext from "../../contexts/AppContext";
import VendorContext from "../../contexts/VendorContext";
// constants
import { PRODUCT_GET_ORDERS_ENDPOINT } from "../../constants/endpoints";
import {
  HOME_ROUTE,
  VENDOR_ROUTE,
  VENDOR_PRODUCTS_ROUTE,
  VENDOR_NEW_PRODUCTS_ROUTE,
  VENDOR_PROFILE_ROUTE,
  VENDOR_ANALYTICS_ROUTE,
} from "../../constants/routes";
// pages
const Dashboard = lazy(() => import("./Dashboard"));
const NewProducts = lazy(() => import("./NewProducts"));
const Products = lazy(() => import("./Products"));
const Profile = lazy(() => import("./Profile"));
const Analytics = lazy(() => import("./Analytics"));

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { users, mode, handleMode } = useContext(AppContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const isProfileComplete = (user) =>
    user &&
    user.name &&
    user.email
    // user.contact &&
    // user.address1 &&
    // user.city &&
    // user.state &&
    // user.country &&
    // user.zip &&
    // user.location?.coordinates?.length;

    useEffect(() => {
      const user = users.find((user) => user.role === "vendor");
      setUser(user);
      if (user && user._id) {
        axios
          .get(PRODUCT_GET_ORDERS_ENDPOINT, { params: { to: user._id } })
          .then((res) => setOrders(res.data.data))
          .catch((err) => console.log(err));
      }
    }, [users]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {isLoading ? <Loader /> : null}
      <SpeedDial
        sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 10001, p: 2 }}
        icon={<SpeedDialIcon />}
        direction={"up"}
        ariaLabel="SpeedDial playground example"
      >
        {mode !== "light" ? (
          <SpeedDialAction onClick={() => handleMode("light")} icon={<LightModeIcon />} tooltipTitle={"Light Mode"} />
        ) : null}
        {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkModeIcon />} tooltipTitle={"Dark Mode"} /> : null}
      </SpeedDial>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              display: { xs: "none", sm: "block" },
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItemButton
            sx={{ backgroundColor: location.pathname === VENDOR_ROUTE ? colors.grey[300] : "" }}
            onClick={() => navigate(VENDOR_ROUTE)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton
            sx={{ backgroundColor: location.pathname === VENDOR_PRODUCTS_ROUTE ? colors.grey[300] : "" }}
            onClick={() => navigate(VENDOR_PRODUCTS_ROUTE)}
          >
            <ListItemIcon>
              <PrecisionManufacturingIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
          <ListItemButton
            sx={{ backgroundColor: location.pathname === VENDOR_NEW_PRODUCTS_ROUTE ? colors.grey[300] : "" }}
            onClick={() => navigate(VENDOR_NEW_PRODUCTS_ROUTE)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Products" />
          </ListItemButton>
          <ListItemButton
            sx={{ backgroundColor: location.pathname === VENDOR_ANALYTICS_ROUTE ? colors.grey[300] : "" }}
            onClick={() => navigate(VENDOR_ANALYTICS_ROUTE)}
          >
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
          <ListItemButton
            sx={{ backgroundColor: location.pathname === VENDOR_PROFILE_ROUTE ? colors.grey[300] : "" }}
            onClick={() => navigate(VENDOR_PROFILE_ROUTE)}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate(HOME_ROUTE)}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Back To Home" />
          </ListItemButton>
        </List>
      </Drawer>
      <VendorContext.Provider value={{ user, isProfileComplete, products, setProducts, orders, setOrders }}>
        <Routes>
          <Route exact path="/analytics/*" element={<Analytics />} />
          <Route exact path="/products/*" element={<Products />} />
          <Route exact path="/new-products/*" element={<NewProducts />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/*" element={<Dashboard />} />
        </Routes>
      </VendorContext.Provider>
    </Box>
  );
};

export default Index;
