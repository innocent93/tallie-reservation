// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // ← This line must be here!

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully ✓');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};