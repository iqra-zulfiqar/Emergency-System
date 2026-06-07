import express from "express";
import { upload } from "../Middleware/multer.js";
import { loginUser, logoutUser, registerUser, registerServiceProvider } from "../Controllers/userControllers.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/register-service-provider", upload.single("cv"), registerServiceProvider);
userRoutes.post('/login' , loginUser)
userRoutes.post('/logout' , logoutUser)

export { userRoutes };
