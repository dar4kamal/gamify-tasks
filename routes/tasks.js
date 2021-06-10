const express = require("express");
const router = express.Router();

const getAllTasks = require("../routeHandlers/tasks/getAllTasks");

router.get("/", getAllTasks);

module.exports = router;
