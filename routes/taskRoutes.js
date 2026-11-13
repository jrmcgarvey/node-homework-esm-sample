import express from "express";
import {
  create,
  show,
  index,
  update,
  deleteTask,
} from "../controllers/taskController.js";
const router = express.Router();
//create, index, show, update, deleteTask
router.post("/", create);
router.get("/:id", show);
router.get("/", index);
router.patch("/:id", update);
router.delete("/:id", deleteTask);
export default router;
