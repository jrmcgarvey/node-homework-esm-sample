import express from "express";
import * as anaController from "../controllers/analyticsController.js";
const router = express.Router();

router.get("/users", anaController.getUsersWithStats);
router.get("/users/:id", anaController.getUserAnalytics);
router.get("/tasks/search", anaController.searchTasks);
export default router;
