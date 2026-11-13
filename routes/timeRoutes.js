import express from "express";
import * as timeController from "../controllers/timeController.js";

const router = express.Router();

router.get("/time", timeController.getTime);
router.post("/echo", timeController.echoBody);
export default router;
