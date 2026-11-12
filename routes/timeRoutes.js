import express from "express";
import { getTime, echoBody } from "../controllers/timeController.js";

const router = express.Router();

router.get("/time", getTime);
router.post("/echo", echoBody);

export default router;
