import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter
  .route("/")
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

taskRouter
  .route("/:id")
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

export default taskRouter;
