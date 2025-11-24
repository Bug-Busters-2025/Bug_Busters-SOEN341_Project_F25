const express = require("express");
const eventsRouter = require("./event.routes");
const usersRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const notificationRouter = require("./notification.routes");
const analyticsRouter = require("./analytics.routes");
const subscriptionsRouter = require("./subscription.routes");

const api = express.Router();
api.use("/auth", authRouter);
api.use("/events", eventsRouter);
api.use("/users", usersRouter);
api.use("/notifications", notificationRouter);
api.use("/analytics", analyticsRouter);
api.use("/subscriptions", subscriptionsRouter);

module.exports = api;
