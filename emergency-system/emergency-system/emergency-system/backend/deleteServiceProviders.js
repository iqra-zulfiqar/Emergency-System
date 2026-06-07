import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Admin } from "./src/Models/admin.js";

const deleteServiceProviders = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error("❌ Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // First, let's find and show the providers we're looking for
    const providersToDelete = await Admin.find({
      $or: [
        { email: "malikshahab668@gmail.com" },
        { email: "maryam27zulfiqar@gmail.com" }
      ]
    });

    console.log(`Found ${providersToDelete.length} provider(s) to delete:`);
    providersToDelete.forEach(p => {
      console.log(`  - ${p.name} (${p.email})`);
    });

    // Delete the specific service providers by email
    const result = await Admin.deleteMany({
      $or: [
        { email: "malikshahab668@gmail.com" },
        { email: "maryam27zulfiqar@gmail.com" }
      ]
    });

    console.log(`✅ Deleted ${result.deletedCount} service provider(s)`);

    if (result.deletedCount > 0) {
      console.log("✅ Service providers removed successfully!");
      
      // Show remaining providers
      const remaining = await Admin.find({ role: "admin" }).select("name email");
      console.log(`Remaining service providers: ${remaining.length}`);
      remaining.forEach(p => {
        console.log(`  - ${p.name} (${p.email})`);
      });
    } else {
      console.log("⚠️ No service providers found matching the criteria");
    }

    // Close the connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error deleting service providers:", error.message);
    process.exit(1);
  }
};

// Run the deletion
deleteServiceProviders();

