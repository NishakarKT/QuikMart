import axios from "axios";
// constants
import { ANALYTICS_GET_ANALYTICS_ENDPOINT, ANALYTICS_NEW_ANALYTICS_ENDPOINT } from "./constants/endpoints";

export const newAnalytics = async (type, data) => {
  try {
    await axios.post(ANALYTICS_NEW_ANALYTICS_ENDPOINT, { type, data });
  } catch (err) {
    console.log(err);
  }
};

export const getAnalytics = async (type, query) => {
  try {
    const response = await axios.get(ANALYTICS_GET_ANALYTICS_ENDPOINT, { params: { type, query } });
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
