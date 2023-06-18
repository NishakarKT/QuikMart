import { User } from "../models/user-models.js";
import { Wishlist, Cart } from "../models/product-models.js";

export const getUser = async (req, res) => {
    const { _id } = req.params;
    try {
        const users = await User.find({ _id });
        if (users.length) {
            res.status(200).send({ data: users[0], message: "found user" });
        }
        else
            res.status(404).send({ data: {}, message: "not found user" });
    } catch (err) { res.status(500).send({ message: err.message }); };
};

export const removeUser = async (req, res) => {
    const { _id } = req.params;
    try {
    } catch (err) { res.status(500).send({ message: err.message }); };
};

export const editUser = async (req, res) => {
    const { _id, edits } = req.body;
    try {
        const user = await User.findOneAndUpdate({ _id }, edits, { new: true });
        res.status(204).send({ user, message: "updated" });
    } catch (err) { res.status(500).send({ message: err.message }); };
};