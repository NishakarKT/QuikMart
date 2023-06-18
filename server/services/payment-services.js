import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: PROCESS.env.RAZORPAY_KEY_ID,
    key_secret: PROCESS.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount = 0, currency = "INR") => {
    if (amount > 0) {
        const options = { amount, currency, receipt: "receipt_order_74394" };
        try {
            const order = await instance.orders.create(options);
            return order;
        } catch (err) { return err; }
    }
    else
        return Error("amount must be greater than 0");
};