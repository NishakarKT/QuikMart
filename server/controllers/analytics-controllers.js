import { Analytics } from "../models/analytics-models.js";

// products
export const newAnalytics = async (req, res) => {
  const data = req.body;
  try {
    const newAnalytics = new Analytics(data);
    await newAnalytics.save();
    return { message: "created analytics" };
  } catch (err) {
    return { message: err.message };
  }
};

export const getAnalytics = async (req, res) => {
  const { type, query } = req.body;
  try {
    if (type === "product") {
      const analytics = await Analytics.find(query);
      return { data: analytics, message: "found analytics" };
    } else {
      return { message: "invalid type" };
    }
  } catch (err) {
    return { message: err.message };
  }
};
