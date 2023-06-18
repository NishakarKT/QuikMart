import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// contexts
import AppContext from "../contexts/AppContext";
import HomeContext from "../contexts/HomeContext";
// constants
import { PRODUCT_ADD_TO_WISHLIST_ENDPOINT, PRODUCT_ADD_TO_CART_ENDPOINT, PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT, PRODUCT_REMOVE_FROM_CART_ENDPOINT } from "../constants/endpoints";
// mui
import { Stack, Card, CardHeader, CardMedia, CardContent, Typography, Button, Avatar, Tooltip, IconButton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from '@mui/icons-material/Visibility';
// constants
import { UPLOAD_URL } from "../constants/urls";
// funcs
const truncateStr = (str, max) => str && str.length > max ? `${str.substring(0, max)}...` : str;

const ProductCard = ({ product, sx }) => {
    const { user } = useContext(AppContext);
    const { wishlist, setWishlist, cart, setCart, setProduct } = useContext(HomeContext);
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

    const handleWishlist = () => {
        if (!productInWishlist)
            try {
                axios.post(PRODUCT_ADD_TO_WISHLIST_ENDPOINT, { userId: user._id, productId: product._id })
                    .then(res => setWishlist(wishlist => [...wishlist, product]))
                    .catch(err => console.log(err));
            } catch (err) { console.log(err); }
        else
            try {
                axios.patch(PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT, { userId: user._id, productId: product._id })
                    .then(res => setWishlist(wishlist => wishlist.filter(prod => prod._id !== product._id)))
                    .catch(err => console.log(err));
            } catch (err) { console.log(err); }
    };

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
        <Card sx={{ ...sx, position: "relative" }}>
            <Tooltip title={productInWishlist ? "Remove From WishList" : "Add To WishList"}><IconButton onClick={handleWishlist} sx={{ position: "absolute", right: 10, top: 10, zIndex: 1, color: "white", backgroundColor: "rgba(0,0,0,0.1)", transition: "all 0.2s", "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" } }}>{productInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton></Tooltip>
            <Stack sx={{ height: "100%" }}>
                <CardMedia onClick={() => setProduct(product)} sx={{ cursor: "pointer" }} component="img" height="194" image={product.files.length ? UPLOAD_URL + product.files[0] : ""} alt="" loading="lazy" />
                <CardHeader onClick={() => setProduct(product)} sx={{ cursor: "pointer" }} avatar={<Avatar src={UPLOAD_URL + product.ownerProfilePic} loading="lazy" />} title={truncateStr(product.title, 25)} subheader={truncateStr(product.ownerName, 25)} align="left" />
                <CardContent align="left" sx={{ py: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{truncateStr(product.desc, 100)}</Typography>
                    <Typography variant="h5" color="primary.main">{product.price}<Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.main">{product.deal}</Typography></Typography>
                </CardContent>
                <Stack alignItems="flex-end" direction="row" spacing={1} sx={{ flex: 1, p: 2, pt: 0 }}>
                    <Tooltip title={productInCart ? "Remove From Cart" : "Add To Cart"}><Button onClick={handleCart} sx={{ px: 5 }} fullWidth variant="outlined" startIcon={productInCart ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}>{productInCart ? "Remove" : "Cart"}</Button></Tooltip>
                    <Tooltip title="View Product"><Button onClick={() => setProduct(product)} sx={{ px: 5, whiteSpace: "nowrap" }} fullWidth variant="contained" startIcon={<VisibilityIcon />}>View</Button></Tooltip>
                </Stack>
            </Stack>
        </Card>
    );
};

export default ProductCard;