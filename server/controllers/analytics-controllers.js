import { Analytics } from "../models/analytics-models.js";

// products
export const newAnalytics = async (req, res) => {
  const data = req.body;
  try {
    const newAnalytics = new Analytics(data);
    await newAnalytics.save();
    res.status(201).send({ message: "created analytics" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  const query = req.query;
  try {
    const analytics = await Analytics.find(query);
    res.status(200).send({ data: analytics, message: "found analytics" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
