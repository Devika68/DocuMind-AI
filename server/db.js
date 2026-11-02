
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    const connection = await mongoose.connect(mongoURI);

    console.log("=================================");
    console.log("DOCUMIND AI DATABASE");
    console.log(`MongoDB connected: ${connection.connection.host}`);
    console.log(`Database: ${connection.connection.name}`);
    console.log("Status: Connected successfully");
    console.log("=================================");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
