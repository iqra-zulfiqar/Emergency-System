import express from "express";
import { getPendingRequests, getApprovedUsers, updateUserStatus} from "../Controllers/userRequestControllers.js";

const UserRequestRoutes = express.Router();

UserRequestRoutes.get("/requests", getPendingRequests);
UserRequestRoutes.get("/approved", getApprovedUsers);
UserRequestRoutes.patch("/update-status/:id", updateUserStatus);

export { UserRequestRoutes };