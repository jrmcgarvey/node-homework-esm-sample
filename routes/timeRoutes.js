import express from "express";
import timeController from "../controllers/timeController.js";

const router = express.Router();

router.get("/time", timeController.getTime);
router.post("/echo", timeController.echoBody);
export default router;
