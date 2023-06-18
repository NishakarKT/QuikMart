import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: String,
    img:{ data: Buffer, contentType: String}
}, { timestamps: true });

export const Image = new mongoose.model("image", imageSchema);