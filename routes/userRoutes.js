import express from "express";
import * as userController from "../controllers/userController.js";
const router = express.Router();

router.post("/register", userController.register);
router.post("/logon", userController.logon);
router.post("/logoff", userController.logoff);

export default router;
