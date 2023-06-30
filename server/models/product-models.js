import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    owner: { type: String },
    ownerName: { type: String },
    ownerProfilePic: { type: String },
    category: { type: String },
    currency: { type: String },
    price: { type: String },
    availability: { type: String },
    deal: { type: String },
    files: { type: Array, default: [] },
  },
  { timestamps: true }
);

productSchema.index({'$**': 'text'});

const wishlistSchema = new mongoose.Schema(
  {
    product: { type: String },
    users: { type: Array, default: [] },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    product: { type: String },
    users: { type: Array, default: [] },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    products: { type: Array, default: [] },
    from: { type: String },
    fromName: { type: String },
    to: { type: String },
    toName: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const ratingSchema = new mongoose.Schema(
  {
    product: { type: String },
    user: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    from: { type: String },
    fromProfilePic: { type: String },
    product: { type: String },
    review: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

export const Product = new mongoose.model("product", productSchema);
export const Wishlist = new mongoose.model("wishlist", wishlistSchema);
export const Cart = new mongoose.model("cart", cartSchema);
export const Order = new mongoose.model("order", orderSchema);
export const Rating = new mongoose.model("rating", ratingSchema);
export const Review = new mongoose.model("review", reviewSchema);
