import React, { useContext } from "react";
import Razorpay from "razorpay";
// contexts
import UserContext from "../contexts/UserContext";

const RazorpayPayment = ({ name, desc, price }) => {
  const { user } = useContext(UserContext);

  const openRazorpayPayment = () => {
    // const options = {
    //   key: "rzp_test_IAmcmWJGGwBS6X",
    //   amount: price * 100, // amount in paise (example: 1000 paise = ₹10)
    //   currency: "INR",
    //   name: name,
    //   description: desc,
    //   //   image: "https://your-company-logo.png",
    //   handler: (response) => {
    //     // Handle success
    //     console.log(response);
    //   },
    //   prefill: {
    //     name: user.name,
    //     email: user.email,
    //     contact: user.contact,
    //   },
    // };
    // const rzp = new Razorpay(options);
    // rzp.open();
  };

  return (
    <div>
      {/* <h1>Razorpay Payment Integration</h1>
      <button onClick={openRazorpayPayment}>Open Payment Popup</button> */}
    </div>
  );
};

export default RazorpayPayment;
