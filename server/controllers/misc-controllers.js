import fs from "fs";
import { Image } from "../models/misc-models.js";

export const index = (req, res) => {
    res.status(200).send({ msg: "Server is up and running!" });
};

export const uploadImage = async (req, res) => {
    try {
        const img = fs.readFileSync(req.file.path);
        const encode_img = img.toString("base64");
        const final_img = {
            contentType: req.file.mimetype,
            image: new Buffer(encode_img, "base64")
        };
        const image = new Image(final_img);
        const result = await image.save();
        res.contentType(final_img.contentType).status(201).send(final_img.image);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};