import { Router } from "express";

const usersRouter = Router();

// get list of users
usersRouter.get("", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).send("Database error");
            res.json(results);
    });
});

export default usersRouter;
