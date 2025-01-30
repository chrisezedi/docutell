import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "";
    await mongoose.connect(mongoURI);
    console.log("Database Connection Successful!");
  } catch (error) {
    console.error("Database Connection Failed!",error);
    process.exit(1)
  }
};

export default dbConnection;
