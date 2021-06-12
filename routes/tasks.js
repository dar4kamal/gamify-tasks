const express = require("express");
const router = express.Router();

const addTask = require("../routeHandlers/tasks/addTask");
const updateTask = require("../routeHandlers/tasks/updateTask");
const getAllTasks = require("../routeHandlers/tasks/getAllTasks");

router.post("/", addTask);
router.get("/", getAllTasks);
router.put("/:taskId", updateTask);

module.exports = router;
