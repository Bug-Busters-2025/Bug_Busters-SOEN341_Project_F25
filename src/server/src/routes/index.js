const express = require("express");
const eventsRouter = require("./event.routes");
const usersRouter = require("./user.routes");
const authRouter = require("./auth.routes");

const api = express.Router()
api.use("/auth", authRouter);
api.use("/events", eventsRouter);
api.use("/users", usersRouter);

module.exports = api;