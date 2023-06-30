import { User } from "./models/user-models.js";
import { Product } from "./models/product-models.js";

const init = async () => {
  const users = await User.find({ role: "vendor" });

  const generateRandomString = (count) => {
    let randomString = "";
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < Math.floor(Math.random() * 10) + 1; j++) randomString += alphabets[Math.floor(Math.random() * alphabets.length)];
      randomString += " ";
    }
    return randomString;
  };

  const generateProducts = async (count) => {
    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const product = new Product({
        title: "Product " + i,
        desc: generateRandomString(Math.floor(Math.random() * 1000) + 100),
        owner: randomUser._id,
        ownerName: randomUser.name,
        ownerProfilePic: randomUser.profilePic,
        category: "Category " + i,
        currency: "INR",
        price: Math.floor(Math.random() * 1000) + 1,
        availability: "true",
        deal: Math.floor(Math.random() * 20) + "% off",
        files: [...Array(1 + Math.floor(Math.random() * 10))].map((i) => "https://source.unsplash.com/random/400x300/?products,service&sig=" + Math.floor(Math.random() * 10000)),
      });
      await product.save();
      console.log("Product " + (i + 1) + " created");
    }
  };
  generateProducts(100);
};

init();
