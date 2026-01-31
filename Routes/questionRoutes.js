const express = require("express");

const questionController = require("./../Controller/questionController");
const userController = require("./../Controller/userController");

const questionRoutes = express.Router();

questionRoutes.route("/").get(questionController.getAllQuestions).post(userController.protect,questionController.createQuestion);
questionRoutes.route("/my-questions").get(userController.protect, questionController.getMyQuestions);
questionRoutes.route("/:id").get(questionController.getQuestion).delete(questionController.deleteQuestion);
questionRoutes.route("/add-solution/:id").post(userController.protect,questionController.addSolution);


module.exports = questionRoutes;