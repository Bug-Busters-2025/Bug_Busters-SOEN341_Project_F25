import { Router } from "express";
import eventsRouter from "./event.routes";
import usersRouter from "./user.routes";
import authRouter from "./auth.routes";

const api = Router()
api.use("/auth", authRouter);
api.use("/events", eventsRouter);
api.use("/users", usersRouter);

export default api;