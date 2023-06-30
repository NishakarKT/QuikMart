import express from "express";
// services
import { upload } from "./services/file-services.js";
// controllers
import * as miscControllers from "./controllers/misc-controllers.js";
import * as authControllers from "./controllers/auth-controllers.js";
import * as userControllers from "./controllers/user-controllers.js";
import * as adminControllers from "./controllers/admin-controllers.js";
import * as productsControllers from "./controllers/products-controllers.js";
import * as fileControllers from "./controllers/file-controllers.js";
import * as analyticsControllers from "./controllers/analytics-controllers.js";

const Router = express.Router();

// Misc Routes
Router.get("/", miscControllers.index); 
// Auth Routes
Router.post("/auth/in", authControllers.signIn);
Router.post("/auth/token", authControllers.token);
Router.post("/auth/otp-generate", authControllers.otp_generate);
Router.post("/auth/otp-verify", authControllers.otp_verify);
// User Routes
Router.get("/user", userControllers.getUser);
Router.patch("/user", userControllers.editUser);
Router.delete("/user", userControllers.removeUser);
// Admin Routes
Router.get("/admin/get-collections", adminControllers.getCollections);
Router.get("/admin/get-documents", adminControllers.getDocuments);
Router.delete("/admin/remove-documents", adminControllers.removeDocuments);
Router.patch("/admin/edit-document", adminControllers.editDocument);
Router.post("/admin/new-document", adminControllers.newDocument);
// Analytics Routes
Router.post("/analytics/new", analyticsControllers.newAnalytics);
Router.get("/analytics/get", analyticsControllers.getAnalytics);
// Products Routes
Router.delete("/product/remove-products", productsControllers.removeProducts);
Router.get("/product/get-featured-products", productsControllers.getFeaturedProducts);
Router.get("/product/get-products-by-query", productsControllers.getProductsByQuery);
Router.get("/product/get-products-count-by-query", productsControllers.getProductsCountByQuery);
Router.get("/product/get-products-by-location", productsControllers.getProductsByLocation);
Router.post("/product/new-product", productsControllers.newProduct);
Router.patch("/product/edit-product", productsControllers.editProduct);
Router.post("/product/new-products", productsControllers.newProducts);
Router.post("/product/add-to-cart", productsControllers.addToCart);
Router.post("/product/add-to-wishlist", productsControllers.addToWishlist);
Router.patch("/product/remove-from-cart", productsControllers.removeFromCart);
Router.patch("/product/remove-from-wishlist", productsControllers.removeFromWishlist);
Router.get("/product/get-wishlist", productsControllers.getWishlist);
Router.get("/product/get-cart", productsControllers.getCart);
Router.patch("/product/empty-wishlist", productsControllers.emptyWishlist);
Router.patch("/product/empty-cart", productsControllers.emptyCart);
Router.patch("/product/wishlist-to-cart", productsControllers.wishlistToCart);
Router.patch("/product/cart-to-wishlist", productsControllers.cartToWishlist);
Router.post("/product/new-order", productsControllers.newOrder);
Router.post("/product/new-orders", productsControllers.newOrders);
Router.get("/product/get-orders", productsControllers.getOrders);
Router.delete("/product/remove-orders", productsControllers.removeOrders);
Router.patch("/product/cancel-orders", productsControllers.cancelOrders);
Router.patch("/product/accept-orders", productsControllers.acceptOrders);
Router.patch("/product/new-rating", productsControllers.newRating);
Router.post("/product/new-review", productsControllers.newReview);
// File Routes
Router.post("/file/new-file", upload.single("file"), fileControllers.newFile);
Router.post("/file/new-files", upload.array("files"), fileControllers.newFiles);

export default Router;