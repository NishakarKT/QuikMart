import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
// contexts
import UserContext from "../contexts/UserContext";
// constants
import {
  PRODUCT_ADD_TO_CART_ENDPOINT,
  PRODUCT_REMOVE_FROM_CART_ENDPOINT,
  PRODUCT_ADD_TO_WISHLIST_ENDPOINT,
  PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT,
  PRODUCT_NEW_REVIEW_ENDPOINT,
} from "../constants/endpoints";
import { AUTH_USER_ROUTE } from "../constants/routes";
import { UPLOAD_URL } from "../constants/urls";
// mui
import { Stack, Card, CardHeader, CardContent, Typography, Button, IconButton, Avatar, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";

const Product = () => {
  const navigate = useNavigate();
  const { user, cart, setCart, wishlist, setWishlist, product, setProduct, setProducts } = useContext(UserContext);
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

  const handleReview = (e) => {
    e.preventDefault();
    const review = e.target.review.value;
    const reviewData = { from: user.name, fromProfilePic: user.profilePic, product: product._id, date: new Date().toISOString(), review };
    if (review)
      axios
        .post(PRODUCT_NEW_REVIEW_ENDPOINT, {
          userId: user._id,
          productId: product._id,
          vendorId: product.owner,
          date: new Date().toISOString(),
          reviewData,
        })
        .then((res) => {
          setProduct({ ...product, reviews: [reviewData, ...product.reviews] });
          setProducts((products) =>
            products.map((prod) => {
              if (prod._id === product._id) return { ...prod, reviews: [reviewData, ...prod.reviews] };
              else return prod;
            })
          );
          // reset
          e.target.reset();
        })
        .catch((err) => console.log(err));
  };

  return product ? (
    <Stack direction="row" sx={{ height: "75vh" }}>
      <Stack flex={{ xs: 0, sm: 1 }}>
        <Carousel showThumbs={false} stopOnHover={false} autoPlay infiniteLoop>
          {product.files.map((file) => (
            <img
              key={file}
              style={{ width: "100%", height: "75vh", objectFit: "cover" }}
              src={file.startsWith("https://") ? file : UPLOAD_URL + file}
              alt=""
              loading="lazy"
            />
          ))}
        </Carousel>
      </Stack>
      <Stack flex={2} style={{ width: "100%", height: "75vh", overflowX: "hidden", overflowY: "auto" }}>
        <Card
          elevation={0}
          sx={{
            overflowY: "auto",
            height: "75vh",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "lightgray" },
          }}
        >
          <CardHeader
            action={
              <IconButton
                onClick={() => setProduct(null)}
                sx={{
                  color: "white",
                  bgcolor: "error.main",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "error.main", filter: "brightness(0.8)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            }
            avatar={<Avatar src={UPLOAD_URL + product.ownerProfilePic} loading="lazy" />}
            title={product.title}
            subheader={product.ownerName}
            align="left"
          />
          <Stack display={{ xs: "block", sm: "none" }}>
            <Carousel showThumbs={false} stopOnHover={false} autoPlay infiniteLoop>
              {product.files.map((file) => (
                <img
                  key={file}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                  src={file.startsWith("https://") ? file : UPLOAD_URL + file}
                  alt=""
                  loading="lazy"
                />
              ))}
            </Carousel>
          </Stack>
          <CardContent align="left" sx={{ pb: 1, pt: 0 }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: "700" }} gutterBottom>
              {product.category}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {product.desc}
            </Typography>
            <Typography sx={{ py: 2 }} variant="h5" color="primary.main">
              {product.price} {product.currency}
              <Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.main">
                {product.deal}
              </Typography>
            </Typography>
            <Stack alignItems="flex-end" direction="row" spacing={1} sx={{ flex: 1, mb: 2 }}>
              <Button
                onClick={handleCart}
                variant="contained"
                startIcon={productInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
              >
                {productInCart ? "Remove From Cart" : "Add To Cart"}
              </Button>
              <Button onClick={handleWishlist} variant="outlined" startIcon={productInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
                {productInWishlist ? "Remove From Wishlist" : "Add To Wishlist"}
              </Button>
            </Stack>
            <Stack component="form" direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 2 }} onSubmit={handleReview}>
              <TextField fullWidth variant="standard" name="review" label="Write a review!" placeholder="Ex: Great Product. Loved it!" />
              <IconButton
                sx={{ color: "white", backgroundColor: "primary.main", "&:hover": { backgroundColor: "primary.dark" } }}
                type="submit"
              >
                <SendIcon />
              </IconButton>
            </Stack>
            {product.reviews?.length
              ? product.reviews.map((review) => (
                  <Stack key={review._id} direction="row" alignItems="flex-start" spacing={1} sx={{ mb: 2 }}>
                    <Avatar src={UPLOAD_URL + review.fromProfilePic} loading="lazy" />
                    <Stack>
                      <Typography variant="body2" color="text.primary">
                        {review.review}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.from} on {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Stack>
                ))
              : null}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};

export default Product;
