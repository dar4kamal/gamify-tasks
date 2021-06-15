const express = require("express");
const router = express.Router();

const addGoal = require("../routeHandlers/goals/addGoal");
const updateGoal = require("../routeHandlers/goals/updateGoal");
const getAllGoals = require("../routeHandlers/goals/getAllGoals");
const removeGoal = require("../routeHandlers/goals/removeGoal");

router.post("/", addGoal);
router.get("/", getAllGoals);
router.put("/:goalId", updateGoal);
router.delete("/:goalId", removeGoal);

module.exports = router;
