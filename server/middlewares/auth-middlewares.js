import jwt from "jsonwebtoken";
import { User } from "../models/user-models.js";

// protecting routes for logged in users
export const protect = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                // extracting header token: Bearer <token>
                const token = req.headers.authorization.split(" ")[1];
                // verifying token
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                // add token associated user to request
                // can be accessed in controller => req.user
                req.user = await User.findOne({ _id: decoded._id })
                // proceed
                next();
            } catch (err) {
                throw new Error("not authorized");
            }
        }
        else {
            res.status(401);
            throw new Error("not authorized");
        }
    } catch (err) {
        res.send(err.message)
    }
}