# Team Incognito Members (1 Member)

1.  Name = Nishakar Kumar
2.  Email = nishakarkumar0@outlook.com
3.  Academics = 3rd Year UG at IIT Kharagpur
4.  GitHub = https://github.com/NishakarKT
5.  LinkedIn = https://www.linkedin.com/in/nishakar-kumar-7016451ba/
6.  YouTube = https://www.youtube.com/@nkodedevelopment

# How to run the app?

1. Commands => "cd ./client/" => "npm i" => "npm start" => React Frontend live at http://localhost:3000
2. Commands => "cd ./server/" => "npm i" => "npm run start" => Node Server live at http://localhost:8000
3. Create server/.env with following environment variables,<br>
   COMPANY=<company_name><br>
   DB_URI=<mongo_conn_url><br>
   JWT_SECRET_KEY=<jwt_secret><br>
   EMAIL=<your_email><br>
   DISPLAY_EMAIL=<your_email><br>
   PASSWORD=<app_password><br>

# Important Links:

1. Repo Link: https://github.com/NishakarKT/QuikMart
2. Video Demonstration: https://drive.google.com/file/d/1CrkdCEbNMDhSN37_R4_WExyc25N-6fwc/view?usp=sharing (bugs in video had been fixed already before the deadline)
3. Screenshots: https://github.com/NishakarKT/QuikMart/tree/main/demo/images
4. Hosted Link (Frontend): https://quikmart.netlify.app/
5. Hosted Link (Backend): https://quikmart.onrender.com/

# Screenshots

1. Authentication
   ![Authentication](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/auth_user.png?raw=true)
   ![Authentication](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/auth_vendor.png?raw=true)
   ![Authentication](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/auth_admin.png?raw=true)
   ![Authentication](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/auth_google.png?raw=true)
   ![Authentication](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/auth_otp.png?raw=true)

3. Home
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_home2.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_home.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_dark.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_orders.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_profile.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_wishlist.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_cart1.png?raw=true)
   ![Home](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/user_cart2.png?raw=true)

4. Vendor
   ![Vendor](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/vendor_dashboard.png?raw=true)
   ![Vendor](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/vendor_new.png?raw=true)
   ![Vendor](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/vendor_products.png?raw=true)
   ![Vendor](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/vendor_profile.png?raw=true)

5. Admin
   ![Admin](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/admin_dashboard.png?raw=true)
   ![Admin](https://github.com/NishakarKT/QuikMart/blob/main/demo/images/admin_new.png?raw=true)

# Architecture

1. Frontend (React):
   1. I used React to build the user interface of the app.
   2. I created reusable components.
   3. I set up routing using libraries like react-router-dom to handle navigation within the app.
   4. For user input and validation, I incorporated forms using React's form handling capabilities and libraries like Validator.
   5. I integrated UI library, Material-UI, to style and enhance the appearance of the app.
2. Backend (Express.js and Node.js):
   1. I set up an Express.js server to handle HTTP requests and responses.
   2. I defined routes for different CRUD operations, such as GET, POST, PATCH, DELETE.
   3. I implemented controllers to handle requests and interact with the database.
   4. To parse incoming request bodies, I used a middleware like express.json.
   5. I ensured the security of user data by integrating authentication and authorization mechanisms, such as JWT (JSON Web Tokens) and hashing (BcryptJS).
   6. I connected to the MongoDB database using an ODM (Object-Document Mapper) Mongoose.
3. Database (MongoDB):
   1. I designed a MongoDB schema to store user, otp and transaction data.
   2. I created collections for different entities, such as users, otps, etc.
   3. I implemented CRUD operations using Mongoose.
   4. I ensured data integrity and validation using Mongoose's built-in validation features.
4. Integration:
   1. I connected the frontend and backend using API endpoints.
   2. I made HTTP requests from the frontend to the backend to perform CRUD operations.
   3. I implemented error handling and displayed appropriate messages to the user.
   4. I handled loading states and provided feedback during API requests.
   5. I used asynchronous programming techniques, such as Promises or async/await, to manage asynchronous operations effectively.
