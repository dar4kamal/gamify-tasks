const express = require("express");
const router = express.Router();

const getAllGoals = require("../routeHandlers/goals/getAllGoals");

router.get("/", getAllGoals);

module.exports = router;
