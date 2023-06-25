import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    token: { type: String, default: "", required: true },
    email: { type: String, default: "", required: true },
    hashedOtp: { type: String, default: "", required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    email: { type: String, default: "" },
    contact: { type: String, default: "" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    zip: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    coins: {type: String, default: "0"},
    location: { type: { type: String, default: "Point" }, coordinates: { type: [Number], default: [0, 0] } },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export const Otp = new mongoose.model("otp", otpSchema);
export const User = new mongoose.model("user", userSchema);
