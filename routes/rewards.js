const express = require("express");
const router = express.Router();

const addReward = require("../routeHandlers/rewards/addReward");
const updateReward = require("../routeHandlers/rewards/updateReward");
const getAllRewards = require("../routeHandlers/rewards/getAllRewards");
const removeReward = require("../routeHandlers/rewards/removeReward");

router.post("/", addReward);
router.get("/", getAllRewards);
router.put("/:rewardId", updateReward);
router.delete("/:rewardId", removeReward);

module.exports = router;
