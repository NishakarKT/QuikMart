import React, { useState, useContext, useEffect, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// mui
import { styled } from "@mui/material/styles";
import {
  Stack,
  Button,
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
} from "@mui/material";
import { ChevronLeft, LightMode, DarkMode, AdminPanelSettings, Menu } from "@mui/icons-material";
// constants
import { AUTH_ADMIN_ROUTE } from "../../constants/routes";
// contexts
import AppContext from "../../contexts/AppContext";
import AdminContext from "../../contexts/AdminContext";
// components
import Footer from "../../components/Footer";
// pages
const Dashboard = lazy(() => import("./Dashboard"));

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
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const { users, mode, handleMode } = useContext(AppContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const isProfileComplete = (user) =>
    user &&
    user.name &&
    user.email &&
    user.contact &&
    user.address1 &&
    user.city &&
    user.state &&
    user.country &&
    user.zip &&
    user.location?.coordinates?.length;

  useEffect(() => {
    const user = users.find((user) => user.role === "admin");
    if (user) setUser(user);
  }, [users]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SpeedDial
        sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 10001, p: 2 }}
        icon={<SpeedDialIcon />}
        direction={"up"}
        ariaLabel="SpeedDial playground example"
      >
        {mode !== "light" ? <SpeedDialAction onClick={() => handleMode("light")} icon={<LightMode />} tooltipTitle={"Light Mode"} /> : null}
        {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkMode />} tooltipTitle={"Dark Mode"} /> : null}
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
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <Menu />
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
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav"></List>
      </Drawer>
      <AdminContext.Provider value={{ isProfileComplete }}>
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
          {user.email ? (
            <Routes>
              <Route exact path="/*" element={<Dashboard />} />
            </Routes>
          ) : (
            <Stack sx={{ width: "100%" }} py={16} spacing={2} alignItems="center" justifyContent="center">
              <Typography component="p" variant="h4" align="center" color="error">
                Unauthorized Access!
              </Typography>
              <Typography component="p" variant="body1" align="center" sx={{ color: "grey" }}>
                You are not authorized to access this page.
              </Typography>
              <Button
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate(AUTH_ADMIN_ROUTE)}
                sx={{ width: "fit-content" }}
                variant="contained"
              >
                Sign In As Admin
              </Button>
            </Stack>
          )}
          <Footer />
        </Box>
      </AdminContext.Provider>
    </Box>
  );
};

export default Index;
