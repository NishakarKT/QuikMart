import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
// contexts
import AppContext from "../contexts/AppContext";
import HomeContext from "../contexts/HomeContext";
// constants
import { PRODUCT_ADD_TO_CART_ENDPOINT, PRODUCT_REMOVE_FROM_CART_ENDPOINT } from "../constants/endpoints";
import { UPLOAD_URL } from "../constants/urls";
// mui
import { Stack, Card, CardHeader, CardContent, Typography, Button, IconButton, Avatar, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const Product = () => {
  const { user} = useContext(AppContext);
  const { cart, setCart, wishlist, product, setProduct } = useContext(HomeContext);
  const [productInWishlist, setProductInWishlist] = useState(false);
  const [productInCart, setProductInCart] = useState(false);

  useEffect(() => {
    if (user && product) {
      setProductInCart(cart.findIndex(prod => prod._id === product._id) !== -1);
      setProductInWishlist(wishlist.findIndex(prod => prod._id === product._id) !== -1);
    }
    else {
      setProductInCart(false);
      setProductInWishlist(false);
    }
  }, [user, product, wishlist, cart, setProductInCart, setProductInWishlist]);

  const handleCart = () => {
    if (!productInCart)
      try {
        axios.post(PRODUCT_ADD_TO_CART_ENDPOINT, { userId: user._id, productId: product._id })
          .then(res => setCart(cart => [...cart, product]))
          .catch(err => console.log(err));
      } catch (err) { console.log(err); }
    else
      try {
        axios.patch(PRODUCT_REMOVE_FROM_CART_ENDPOINT, { userId: user._id, productId: product._id })
          .then(res => setCart(cart => cart.filter(prod => prod._id !== product._id)))
          .catch(err => console.log(err));
      } catch (err) { console.log(err); }
  };

  return (
    product ? <Stack direction="row">
      <Stack flex={{ xs: 0, sm: 1 }}>
        <Carousel showThumbs={false} stopOnHover={false} autoPlay infiniteLoop>
          {product.files.map(file => <img key={file} style={{ width: "100%", height: "100vh", objectFit: "cover" }} src={UPLOAD_URL + file} alt="" loading="lazy" />)}
        </Carousel>
      </Stack>
      <Stack flex={2} style={{ width: "100%", height: "100vh", overflowX: "hidden", overflowY: "auto" }}>
        <Card elevation={0} sx={{ overflowY: "auto", height: "100vh", overflowX: "hidden", '&::-webkit-scrollbar': { width: "5px" }, '&::-webkit-scrollbar-thumb': { backgroundColor: "lightgray" } }}>
          <CardHeader action={
            <IconButton onClick={() => setProduct(null)} sx={{ color: "white", bgcolor: "error.main", transition: "all 0.2s", "&:hover": { bgcolor: "error.main", filter: "brightness(0.8)" } }}>
              <CloseIcon />
            </IconButton>
          } avatar={<Avatar src={UPLOAD_URL + product.ownerProfilePic} loading="lazy" />} title={product.title} subheader={product.ownerName} align="left" />
          <Stack display={{ xs: "block", sm: "none" }}>
            <Carousel showThumbs={false} stopOnHover={false} autoPlay infiniteLoop>
              {product.files.map(file => <img key={file} style={{ width: "100%", height: "300px", objectFit: "cover" }} src={UPLOAD_URL + file} alt="" loading="lazy" />)}
            </Carousel>
          </Stack>
          <CardContent align="left">
            <Typography variant="body2" color="text.secondary">{product.desc}</Typography>
            <Typography sx={{ py: 2 }} variant="h5" color="primary.main">{product.price}<Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.main">{product.deal}</Typography></Typography>
            <Stack alignItems="flex-end" direction="row" spacing={1} sx={{ flex: 1 }}>
              <Tooltip title={productInCart ? "Remove From Cart" : "Add To Cart"}><Button onClick={handleCart} variant="contained" startIcon={productInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}>{productInCart ? "Remove From Cart" : "Add To Cart"}</Button></Tooltip>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack> : <></>
  );
};

export default Product;