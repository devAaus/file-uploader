import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
   try {
      const DB_URL = process.env.DB_URL;
      await mongoose.connect(DB_URL);
      console.log('Database connected successfully');
   } catch (error) {
      console.log('DB connection error', error);
   }
};
