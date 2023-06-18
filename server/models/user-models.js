import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        email: { type: String, required: true },
        hashedOtp: { type: String, required: true },
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, unique: true },
        contact: { type: String },
        address1: { type: String },
        address2: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zip: { type: String },
        profilePic: { type: String },
        coverPic: { type: String },
        location: { type: { type: String }, coordinates: { type: [Number] } },
    }, { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

export const Otp = new mongoose.model("otp", otpSchema);
export const User = new mongoose.model("user", userSchema);