import express from "express";
import { addReview, getProviderReviews } from "../Controllers/reviewControllers.js";
import { protectUser } from "../Middleware/authMiddleware.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/add", protectUser, addReview);
reviewRoutes.get("/provider/:providerId", getProviderReviews);

export { reviewRoutes };
