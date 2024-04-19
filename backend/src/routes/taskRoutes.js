const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authenticateToken");

//Create a new task
router.post("/", authenticateToken, taskController.createTask);

// Get all tasks for the logged-in user
router.get("/", authenticateToken, taskController.getAllTasks);

//Get a specific task by ID
router.get("/:id", authenticateToken, taskController.getTaskById);

//Update a task by ID
router.put("/:id", authenticateToken, taskController.updateTask);

// Delete a task by ID
router.delete("/:id", authenticateToken, taskController.deleteTask);

module.exports = router;
