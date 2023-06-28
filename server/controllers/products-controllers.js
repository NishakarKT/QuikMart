import fs from "fs";
import { User } from "../models/user-models.js";
import { Product, Wishlist, Cart, Order } from "../models/product-models.js";
import { Analytics } from "../models/analytics-models.js";

export const addToCart = async (req, res) => {
  const { userId, vendorId, productId, date } = req.body;
  try {
    const newAnalytics = new Analytics({ type: "product", product: productId, user: userId, vendor: vendorId, date, action: "addToCart" });
    await newAnalytics.save();
    await Cart.findOneAndUpdate({ product: productId }, { $addToSet: { users: userId } }, { upsert: true });
    res.status(200).send({ message: "added to cart" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, vendorId, productId, date } = req.body;
  try {
    const newAnalytics = new Analytics({ type: "product", product: productId, user: userId, vendor: vendorId, date, action: "removeFromCart" });
    await newAnalytics.save();
    await Cart.findOneAndUpdate({ product: productId }, { $pull: { users: userId } });
    res.status(200).send({ message: "removed from cart" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { userId, vendorId, productId, date } = req.body;
  try {
    const newAnalytics = new Analytics({ type: "product", product: productId, user: userId, vendor: vendorId, date, action: "addToWishlist" });
    await newAnalytics.save();
    await Wishlist.findOneAndUpdate({ product: productId }, { $addToSet: { users: userId } }, { upsert: true });
    res.status(200).send({ message: "added to wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { userId, vendorId, productId, date } = req.body;
  try {
    const newAnalytics = new Analytics({ type: "product", product: productId, user: userId, vendor: vendorId, date, action: "removeFromWishlist" });
    await newAnalytics.save();
    await Wishlist.findOneAndUpdate({ product: productId }, { $pull: { users: userId } });
    res.status(200).send({ message: "removed from wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const emptyWishlist = async (req, res) => {
  const { userId } = req.body;
  try {
    await Wishlist.update({ users: { $all: [userId] } }, { $pull: { users: userId } }, { multi: true });
    res.status(200).send({ message: "cleared the wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const emptyCart = async (req, res) => {
  const { userId } = req.body;
  try {
    await Cart.update({ users: { $all: [userId] } }, { $pull: { users: userId } }, { multi: true });
    res.status(200).send({ message: "cleared the cart" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const wishlistToCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const wishlist = (await Wishlist.find({ users: { $all: [userId] } }, { _id: 0, product: 1 })).map((item) => item.product);
    await Wishlist.update({ users: { $all: [userId] } }, { $pull: { users: userId } }, { multi: true });
    await Cart.update({ product: { $in: wishlist } }, { $addToSet: { users: userId } }, { upsert: true });
    res.status(200).send({ message: "moved from wishlist to cart" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const cartToWishlist = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = (await Cart.find({ users: { $all: [userId] } }, { _id: 0, product: 1 })).map((item) => item.product);
    await Cart.update({ users: { $all: [userId] } }, { $pull: { users: userId } }, { multi: true });
    await Wishlist.update({ product: { $in: cart } }, { $addToSet: { users: userId } }, { upsert: true });
    res.status(200).send({ message: "moved from cart to wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  const { userId } = req.query;
  try {
    const wishlist = (await Wishlist.find({ users: { $all: [userId] } })).map((item) => item.product);
    res.status(200).send({ data: wishlist, message: "found wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = (await Cart.find({ users: { $all: [userId] } })).map((item) => item.product);
    res.status(200).send({ data: cart, message: "found cart" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  const query = req.query;
  try {
    const orders = await Order.find(query);
    if (!orders || !orders.length) throw "couldn't fetch the orders";
    else res.status(201).send({ data: orders.reverse(), message: "fetched orders" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getProductsByQuery = async (req, res) => {
  const query = req.query;
  try {
    const products = await Product.find(query);
    res.status(200).send({ data: products, message: "found products" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getProductsByLocation = async (req, res) => {
  const query = req.query;
  const location = {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [Number(query.location.coordinates[0]), Number(query.location.coordinates[1])],
      },
      $minDistance: Number(Number(query.location.minDist) || 0),
      $maxDistance: Number(Number(query.location.maxDist) || 100000),
    },
  };
  delete query["location"];
  try {
    const owners = {};
    const users = await User.find({ location }, { _id: 1, name: 1, location: 1, profilePic: 1 });
    users.forEach(
      (user) =>
        (owners[user._id] = { _id: user._id.toString(), name: user.name, profilePic: user.profilePic, location: user.location.coordinates })
    );
    const products = await Product.find({ ...query, owner: { $in: Object.keys(owners) } });
    res.status(200).send({ data: products, message: "found products" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeProducts = async (req, res) => {
  const query = req.body;
  try {
    await Product.deleteMany(query);
    res.status(202).send("deleted products");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeOrders = async (req, res) => {
  const query = req.body;
  try {
    await Order.deleteMany(query);
    res.status(202).send("deleted orders");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const cancelOrders = async (req, res) => {
  const query = req.body;
  try {
    await Order.updateMany(query, { status: "cancelled" });
    res.status(202).send("deleted orders");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const acceptOrders = async (req, res) => {
  const query = req.body;
  try {
    await Order.updateMany(query, { status: "accepted" });
    res.status(202).send("accepted orders");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const editProducts = async (req, res) => {
  const { _id, edits } = req.body;
  try {
    const product = await Product.findOneAndUpdate({ _id }, edits, { new: true });
    res.status(204).send({ product, message: "updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const newProduct = async (req, res) => {
  const data = req.body;
  try {
    const product = new Product(data);
    const newProduct = await product.save();
    res.status(201).send({ data: newProduct, message: "created product" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const editProduct = async (req, res) => {
  const { _id, updates } = req.body;
  if (updates.deletedFiles?.length)
    updates.deletedFiles.forEach((deletedFile) =>
      fs.unlink("media/" + deletedFile, (err) => {
        console.log(err);
      })
    );
  delete updates["deletedFiles"];
  try {
    const newProduct = await Product.findOneAndUpdate({ _id }, updates, { new: true });
    res.status(201).send({ data: newProduct, message: "updated product" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const newProducts = async (req, res) => {
  const data = req.body;
  try {
    Product.collection.insert(data, (err, docs) => {
      if (err) throw "couldn't create all the products";
      else res.status(201).send("created products");
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const newOrder = async (req, res) => {
  const data = req.body;
  try {
    const order = new Order(data);
    const newOrder = await order.save();
    await Cart.findOneAndUpdate({ product: data.product }, { $pull: { users: data.from } });
    res.status(201).send({ data: newOrder, message: "created order" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const newOrders = async (req, res) => {
  const data = req.body;
  try {
    const result = await Order.create(data);
    if (!result) throw "couldn't create all the orders";
    else res.status(201).send("created orders");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
