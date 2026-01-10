// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS: 30000});
//         console.log('mongodb connected successfully.');
//     } catch (error) {
//         console.log(error);
//     }
// }
// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI, {
//     serverSelectionTimeoutMS: 30000,
//   });
//   console.log("MongoDB connected successfully");
// };

// export default connectDB;





// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI, {
//     serverSelectionTimeoutMS: 30000,
//   });
//   console.log("MongoDB connected");
// };
