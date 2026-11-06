import express from "express";
import taskController from "../controllers/taskController.js";
const router = express.Router();
//create, index, show, update, deleteTask
router.post("/", taskController.create);
router.get("/:id", taskController.show);
router.get("/", taskController.index);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.deleteTask);
export default router;
