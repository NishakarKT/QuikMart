import mongoose, { mongo } from "mongoose";

export const getCollections = async (req, res) => {
  const excludedCollections = ["wishlists", "carts", "otps", "orders", "images"];
  try {
    const collections = (await mongoose.connection.db.listCollections().toArray()).filter(
      (item) => !excludedCollections.includes(item.name)
    );
    res.status(200).send({ data: collections, message: "found collections" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getDocuments = async (req, res) => {
  const { name } = req.query;
  const projection = { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }; // excluded columns
  try {
    const documents = await mongoose.connection.db.collection(name).find({}, { projection }).toArray();
    res.status(200).send({ data: documents, message: "found documents" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeDocuments = async (req, res) => {
  const { _id, name } = req.body;
  try {
    await mongoose.connection.db.collection(name).deleteMany({ _id: mongoose.Types.ObjectId(_id) });
    // query find by _id
    res.status(200).send({ message: "removed documents" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const editDocument = async (req, res) => {
  const { _id, name, updates } = req.body;
  try {
    await mongoose.connection.db.collection(name).updateOne({ _id: mongoose.Types.ObjectId(_id) }, { $set: updates });
    res.status(200).send({ message: "edited document" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const newDocument = async (req, res) => {
  const { name, data } = req.body;
  try {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    await mongoose.connection.db.collection(name).insertOne(data);
    res.status(200).send({ message: "created document" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
