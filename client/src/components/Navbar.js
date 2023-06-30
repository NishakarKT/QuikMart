import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// constants
import { COMPANY, COMPANY2 } from "../constants/variables";
import { AUTH_ROUTE, CART_ROUTE, HOME_ROUTE, PROFILE_ROUTE, WISHLIST_ROUTE, ORDERS_ROUTE } from "../constants/routes";
import { IMAGES_WEBSITE_LOGO_WHITE_PNG } from "../constants/images";
import { UPLOAD_URL } from "../constants/urls";
// contexts
import AppContext from "../contexts/AppContext";
import HomeContext from "../contexts/UserContext";
// mui
import {
  Stack,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Autocomplete,
  TextField,
  Badge,
} from "@mui/material";
import { Search, MoreVert, Login, Logout, Favorite, ShoppingCart, AccountCircle, FormatListNumbered } from "@mui/icons-material";

const Navbar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const { users, setUsers, role } = useContext(AppContext);
  const { wishlist, cart, orders, products } = useContext(HomeContext);

  useEffect(() => {
    if (location.pathname.startsWith("/search")) setQuery(location.pathname.split("/search/")[1].replaceAll("%20", " "));
  }, [location]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (e) => {
    setMobileMenuAnchorEl(e.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const closeMenus = () => {
    handleMenuClose();
    handleMobileMenuClose();
  };

  const handleProfile = () => {
    navigate(PROFILE_ROUTE);
    setTimeout(() => closeMenus(), 500);
  };

  const handleWishList = () => {
    navigate(WISHLIST_ROUTE);
    closeMenus();
  };

  const handleCart = () => {
    navigate(CART_ROUTE);
    closeMenus();
  };

  const handleOrders = () => {
    navigate(ORDERS_ROUTE);
    closeMenus();
  };

  const handleLogin = () => {
    navigate(AUTH_ROUTE);
    closeMenus();
  };

  const handleLogout = () => {
    const localData = JSON.parse(localStorage.getItem(COMPANY));
    delete localData["token"];
    localStorage.setItem(COMPANY, JSON.stringify(localData));
    setUsers((users) => users.filter((user) => user.role !== role));
    closeMenus();
    navigate(HOME_ROUTE);
  };

  const handleQuery = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("query");
    setQuery(query);
    navigate(`/search/${query}`);
  };

  useEffect(() => {
    setUser(users.find((u) => u.role === role) || {});
  }, [users, role]);

  return (
    <Box component="nav" sx={{ flexGrow: 1, position: "fixed", zIndex: 3, width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <img
            onClick={() => navigate(HOME_ROUTE)}
            src={IMAGES_WEBSITE_LOGO_WHITE_PNG}
            style={{ width: "40px", height: "40px", marginRight: "8px", cursor: "pointer" }}
            alt={"logo"}
            loading="lazy"
          />
          <Stack>
            <Typography variant="h4" noWrap component="div" sx={{ display: { xs: "none", sm: "block" }, fontSize: "20px" }}>
              {COMPANY}
            </Typography>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" }, fontSize: "12px" }}>
              {COMPANY2}
            </Typography>
          </Stack>
          <form style={{ flex: "1" }} onSubmit={(e) => handleQuery(e)}>
            <Stack px={2} py={1} spacing={1} alignItems="center" direction="row">
              <Autocomplete
                disablePortal
                freeSolo={true}
                value={query}
                clearOnBlur={false}
                sx={{ flex: 1, input: { color: "white" }, svg: { color: "white" }, label: { color: "white !important" } }}
                options={products.map((product) => ({ label: product.title }))}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    variant="standard"
                    name="query"
                    placeholder="Search for mobiles, clothes, accessories, etc."
                    label="What do you seek?"
                    InputProps={{ ...params.InputProps, sx: { "&:before": { borderBottom: "1px solid white !important" } } }}
                  />
                )}
              />
              <IconButton type="submit" edge="end" sx={{ color: "white", width: 40, height: 40 }}>
                <Search />
              </IconButton>
            </Stack>
          </form>
          {user.email ? (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton size="large" color="inherit" onClick={handleWishList}>
                  <Badge badgeContent={wishlist.length || 0} color="error">
                    <Favorite />
                  </Badge>
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton size="large" color="inherit" onClick={handleCart}>
                  <Badge badgeContent={cart.length || 0} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton size="large" color="inherit" onClick={handleOrders}>
                  <Badge badgeContent={orders.filter((order) => order.status === "pending").length || 0} color="error">
                    <FormatListNumbered />
                  </Badge>
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton size="large" edge="end" color="inherit" onClick={handleMenuOpen}>
                  <Avatar alt={user.email || "Avatar"} src={UPLOAD_URL + user.profilePic} loading="lazy" />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton size="large" onClick={handleMobileMenuOpen} color="inherit">
                  <MoreVert />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Button onClick={() => navigate(AUTH_ROUTE)} variant="contained" color="info" sx={{ textTransform: "capitalize" }}>
                Sign In/Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {user.email ? (
        <Menu
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleWishList}>
            <ListItemIcon>
              <Favorite fontSize="small" />
            </ListItemIcon>
            <ListItemText>Wishlist</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleCart}>
            <ListItemIcon>
              <ShoppingCart fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cart</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOrders}>
            <ListItemIcon>
              <FormatListNumbered fontSize="small" />
            </ListItemIcon>
            <ListItemText>Orders</ListItemText>
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            <ListItemText>Login</ListItemText>
          </MenuItem>
        </Menu>
      )}
      {user.email ? (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            <ListItemText>Login</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export default Navbar;
