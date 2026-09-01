const express = require("express");
require('dotenv').config()
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

module.exports = app;