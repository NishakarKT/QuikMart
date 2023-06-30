import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// contexts
import UserContext from "../contexts/UserContext";
// constants
import {
  PRODUCT_ADD_TO_WISHLIST_ENDPOINT,
  PRODUCT_ADD_TO_CART_ENDPOINT,
  PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT,
  PRODUCT_REMOVE_FROM_CART_ENDPOINT,
  PRODUCT_NEW_RATING_ENDPOINT,
  ANALYTICS_NEW_ENDPOINT,
} from "../constants/endpoints";
// mui
import { Stack, Card, CardHeader, CardMedia, CardContent, Typography, Button, Avatar, Tooltip, IconButton, Rating } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
// constants
import { UPLOAD_URL } from "../constants/urls";
import { AUTH_USER_ROUTE } from "../constants/routes";
// funcs
const truncateStr = (str, max) => (str && str.length > max ? `${str.substring(0, max)}...` : str);

const ProductCard = ({ product, sx }) => {
  const navigate = useNavigate();
  const { user, wishlist, setWishlist, cart, setCart, setProduct } = useContext(UserContext);
  const [productInWishlist, setProductInWishlist] = useState(false);
  const [productInCart, setProductInCart] = useState(false);

  useEffect(() => {
    if (user && product) {
      setProductInCart(cart.findIndex((prod) => prod._id === product._id) !== -1);
      setProductInWishlist(wishlist.findIndex((prod) => prod._id === product._id) !== -1);
    } else {
      setProductInCart(false);
      setProductInWishlist(false);
    }
  }, [user, product, wishlist, cart, setProductInCart, setProductInWishlist]);

  const handleWishlist = () => {
    if (!productInWishlist)
      try {
        axios
          .post(PRODUCT_ADD_TO_WISHLIST_ENDPOINT, {
            userId: user._id,
            productId: product._id,
            vendorId: product.owner,
            date: new Date().toISOString(),
          })
          .then((res) => setWishlist((wishlist) => [...wishlist, product]))
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    else
      try {
        axios
          .patch(PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT, {
            userId: user._id,
            productId: product._id,
            vendorId: product.owner,
            date: new Date().toISOString(),
          })
          .then((res) => setWishlist((wishlist) => wishlist.filter((prod) => prod._id !== product._id)))
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
  };

  const handleCart = () => {
    if (!user) navigate(AUTH_USER_ROUTE);
    else {
      if (!productInCart)
        try {
          axios
            .post(PRODUCT_ADD_TO_CART_ENDPOINT, {
              userId: user._id,
              productId: product._id,
              vendorId: product.owner,
              date: new Date().toISOString(),
            })
            .then((res) => setCart((cart) => [...cart, product]))
            .catch((err) => console.log(err));
        } catch (err) {
          console.log(err);
        }
      else
        try {
          axios
            .patch(PRODUCT_REMOVE_FROM_CART_ENDPOINT, {
              userId: user._id,
              productId: product._id,
              vendorId: product.owner,
              date: new Date().toISOString(),
            })
            .then((res) => setCart((cart) => cart.filter((prod) => prod._id !== product._id)))
            .catch((err) => console.log(err));
        } catch (err) {
          console.log(err);
        }
    }
  };

  const handleRating = (rating) => {
    if (!user) navigate(AUTH_USER_ROUTE);
    else {
      axios
        .patch(PRODUCT_NEW_RATING_ENDPOINT, {
          userId: user._id,
          productId: product._id,
          vendorId: product.owner,
          date: new Date().toISOString(),
          rating,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
      // axios
      //   .post(PRODUCT_NEW_RATING_ENDPOINT, {
      //     userId: user._id,
      //     productId: product._id,
      //     vendorId: product.owner,
      //     date: new Date().toISOString(),
      //   })
      //   .then((res) => setCart((cart) => [...cart, product]))
      //   .catch((err) => console.log(err));
    }
  };

  return (
    <Card sx={{ ...sx, position: "relative" }}>
      <Tooltip title={productInWishlist ? "Remove From WishList" : "Add To WishList"}>
        <IconButton
          onClick={handleWishlist}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 1,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.1)",
            transition: "all 0.2s",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
          }}
        >
          {productInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
      <Rating
        sx={{
          position: "absolute",
          left: 10,
          top: 10,
          zIndex: 1,
        }}
        defaultValue={product.rating}
        onChange={(e, rating) => handleRating(rating)}
        precision={0.5}
      />
      <Stack sx={{ height: "100%" }}>
        <CardMedia
          onClick={() => setProduct(product)}
          sx={{ cursor: "pointer" }}
          component="img"
          height="194"
          image={product.files.length ? (product.files[0].startsWith("https://") ? product.files[0] : UPLOAD_URL + product.files[0]) : ""}
          alt=""
          loading="lazy"
        />
        <CardHeader
          onClick={() => setProduct(product)}
          sx={{ cursor: "pointer" }}
          avatar={<Avatar src={UPLOAD_URL + product.ownerProfilePic} loading="lazy" />}
          title={truncateStr(product.title, 25)}
          subheader={truncateStr(product.ownerName, 25)}
          align="left"
        />
        <CardContent align="left" sx={{ pb: 1, pt: 0 }}>
          <Typography variant="body2" color="primary" sx={{ fontWeight: "700" }} gutterBottom>
            {product.category}
          </Typography>
          <Typography variant="body2" color="text.primary" gutterBottom>
            {truncateStr(product.desc, 100)}
          </Typography>
          <Typography variant="h5" color="primary.main">
            {product.price} {product.currency}
            <Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.main">
              {product.deal}
            </Typography>
          </Typography>
        </CardContent>
        <Stack alignItems="flex-end" direction="row" spacing={1} sx={{ flex: 1, p: 2, pt: 0 }}>
          <Tooltip title={productInCart ? "Remove From Cart" : "Add To Cart"}>
            <Button
              onClick={handleCart}
              sx={{ px: 5 }}
              fullWidth
              variant="outlined"
              startIcon={productInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
            >
              {productInCart ? "Remove" : "Cart"}
            </Button>
          </Tooltip>
          <Tooltip title="View Product">
            <Button
              onClick={() => {
                setProduct(product);
                axios
                  .post(ANALYTICS_NEW_ENDPOINT, {
                    type: "product",
                    action: "view",
                    user: user?._id || "guest",
                    product: product._id,
                    vendor: product.owner,
                    date: new Date().toISOString(),
                  })
                  .then((res) => console.log(res.data))
                  .catch((err) => console.log(err));
              }}
              sx={{ px: 5, whiteSpace: "nowrap" }}
              fullWidth
              variant="contained"
              startIcon={<VisibilityIcon />}
            >
              View
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProductCard;
