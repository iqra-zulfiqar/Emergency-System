import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully! `);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Agar connect na ho to server band ho jaye
  }
};

export {connectDB};
