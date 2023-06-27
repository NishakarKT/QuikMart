import { ProductAnalyticsSchema } from "../models/analytics-models.js";

// products
export const newAnalytics = async (req, res) => {
  const { type, data } = req.body;
  try {
    if (type === "product") {
      const newAnalytics = new ProductAnalyticsSchema(data);
      await newAnalytics.save();
      res.status(200).send({ message: "created analytics" });
    } else {
      res.status(500).send({ message: "invalid type" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  const { type, query } = req.query;
  try {
    if (type === "product") {
      const analytics = await ProductAnalyticsSchema.find(query);
      res.status(200).send({ data: analytics, message: "found analytics" });
    } else {
      res.status(500).send({ message: "invalid type" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
