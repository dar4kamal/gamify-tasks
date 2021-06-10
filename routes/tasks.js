const express = require("express");
const router = express.Router();

const addTask = require("../routeHandlers/tasks/addTask");
const getAllTasks = require("../routeHandlers/tasks/getAllTasks");

router.post("/", addTask);
router.get("/", getAllTasks);

module.exports = router;
