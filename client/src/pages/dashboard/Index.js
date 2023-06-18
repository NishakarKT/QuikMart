import React, { useState, useContext, lazy, useEffect } from 'react';
import axios from "axios";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// mui
import { styled } from '@mui/material/styles';
import { CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, Typography, Divider, IconButton, Badge, List, SpeedDial, SpeedDialIcon, SpeedDialAction, colors } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
// contexts
import AppContext from "../../contexts/AppContext";
import DashboardContext from "../../contexts/DashboardContext";
// constants
import { PRODUCT_GET_ORDERS_ENDPOINT } from "../../constants/endpoints";
import { HOME_ROUTE, DASHBOARD_ROUTE, DASHBOARD_PRODUCTS_ROUTE, DASHBOARD_NEW_PRODUCTS_ROUTE } from "../../constants/routes";
// pages
const Dashboard = lazy(() => import("./Dashboard"));
const NewProducts = lazy(() => import("./NewProducts"));
const Products = lazy(() => import("./Products"));

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const Index = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, mode, handleMode } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        try {
            axios.get(PRODUCT_GET_ORDERS_ENDPOINT, { params: { to: user._id } })
                .then(res => setOrders(res.data.data))
                .catch(err => console.log(err))
        } catch (err) { console.log(err); };
    }, [user]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <SpeedDial sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 10001, p: 2 }} icon={<SpeedDialIcon />} direction={"up"} ariaLabel="SpeedDial playground example">
                {mode !== "light" ? <SpeedDialAction onClick={() => handleMode("light")} icon={<LightModeIcon />} tooltipTitle={"Light Mode"} /> : null}
                {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkModeIcon />} tooltipTitle={"Dark Mode"} /> : null}
            </SpeedDial>
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        Dashboard
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItemButton sx={{ backgroundColor: location.pathname === DASHBOARD_ROUTE ? colors.grey[300] : "" }} onClick={() => navigate(DASHBOARD_ROUTE)}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton sx={{ backgroundColor: location.pathname === DASHBOARD_PRODUCTS_ROUTE ? colors.grey[300] : "" }} onClick={() => navigate(DASHBOARD_PRODUCTS_ROUTE)}>
                        <ListItemIcon>
                            <PrecisionManufacturingIcon />
                        </ListItemIcon>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                    <ListItemButton sx={{ backgroundColor: location.pathname === DASHBOARD_NEW_PRODUCTS_ROUTE ? colors.grey[300] : "" }} onClick={() => navigate(DASHBOARD_NEW_PRODUCTS_ROUTE)}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="New Products" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate(HOME_ROUTE)}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Back To Home" />
                    </ListItemButton>
                </List>
            </Drawer>
            <DashboardContext.Provider value={{ products, setProducts, orders, setOrders }}>
                <Routes>
                    <Route exact path="/products" element={<Products />} />
                    <Route exact path="/new-products" element={<NewProducts />} />
                    <Route exact path="/" element={<Dashboard />} />
                </Routes>
            </DashboardContext.Provider>
        </Box>
    );
}

export default Index;