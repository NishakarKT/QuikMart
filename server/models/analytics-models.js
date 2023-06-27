import mongoose from "mongoose";

// types
// 1. view
// 2. order
// 3. cart
// 4. wishlist

const productAnalyticsSchema = new mongoose.Schema(
  {
    type: { type: String },
    user: { type: String },
    vendor: { type: String },
    product: { type: String },
  },
  { timestamps: true }
);

export const ProductAnalyticsSchema = new mongoose.model("productAnalytics", productAnalyticsSchema);
