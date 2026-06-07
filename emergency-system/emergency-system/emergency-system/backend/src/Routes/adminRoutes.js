// Routes/adminRoutes.js
import express from "express";
import { registerAdmin, logoutAdmin, loginAdmin, getAllServiceProviders, deleteServiceProviders } from "../Controllers/adminControllers.js";
import { upload } from "../Middleware/multer.js";

const adminRoutes = express.Router();

adminRoutes.post('/register', upload.single('cv'), registerAdmin);
adminRoutes.post('/login' , loginAdmin);
adminRoutes.get('/logout' , logoutAdmin);
adminRoutes.get('/service-providers' , getAllServiceProviders);
adminRoutes.post('/delete-service-providers', deleteServiceProviders);


export { adminRoutes };
