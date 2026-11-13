import express from "express";
import {
  getUsersWithStats,
  getUserAnalytics,
  searchTasks,
} from "../controllers/analyticsController.js";
const router = express.Router();

router.get("/users", getUsersWithStats);
router.get("/users/:id", getUserAnalytics);
router.get("/tasks/search", searchTasks);
export default router;
