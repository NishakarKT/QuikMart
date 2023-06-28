import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String },
    action: { type: String },
    user: { type: String },
    vendor: { type: String },
    product: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

export const Analytics = new mongoose.model("analytics", analyticsSchema);
