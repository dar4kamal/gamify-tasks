const express = require("express");
const router = express.Router();

const login = require("../routeHandlers/users/login");
const register = require("../routeHandlers/users/register");
const getAllUsers = require("../routeHandlers/users/getAllUsers");

router.get("/", getAllUsers);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
