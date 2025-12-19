const express = require("express");

const app = express();
const cors = require("cors");

app.use(cors());

const userRoutes = require("./Routes/userRoutes");
const questionRoutes = require("./Routes/questionRoutes");

app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/question",questionRoutes);

module.exports = app;
