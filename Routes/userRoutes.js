const express = require("express");

const userController = require("./../Controller/userController");
const userRoutes = express.Router();

userRoutes.route("/login").post(userController.login);
userRoutes.route("/signup").post(userController.signup);

module.exports = userRoutes;