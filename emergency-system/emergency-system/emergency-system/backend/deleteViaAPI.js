import axios from "axios";

const API_URL = "http://localhost:5000";

const deleteServiceProviders = async () => {
  try {
    const emailsToDelete = [
      "malikshahab668@gmail.com",
      "maryam27zulfiqar@gmail.com"
    ];

    console.log("Attempting to delete service providers...");
    console.log("Emails to delete:", emailsToDelete);

    const response = await axios.post(
      `${API_URL}/api/admin/delete-service-providers`,
      { emails: emailsToDelete },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.success) {
      console.log("✅ Success:", response.data.message);
      console.log("Deleted count:", response.data.deletedCount);
    } else {
      console.log("❌ Error:", response.data.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
    process.exit(1);
  }
};

deleteServiceProviders();
