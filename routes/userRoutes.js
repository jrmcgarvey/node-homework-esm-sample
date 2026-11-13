import express from "express";
import { register, logon, logoff } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.post("/logon", logon);
router.post("/logoff", logoff);

export default router;
