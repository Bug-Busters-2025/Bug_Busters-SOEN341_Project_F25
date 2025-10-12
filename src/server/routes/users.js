const express = require("express");
const router = express.Router();
const { requireAuth, getAuth } = require("@clerk/express");
const db = require("../db.js");


router.post("/sync", (req, res) => {
    const {email, name,role="student"} = req.body;

    db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        if (rows.length === 0)
            {
                const insertsql = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";
                db.query(insertsql, [name, email, role], (err2) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).send("Database error");
                    }
                    return res.status(201).json({ message: `User created as ${role}` });
                });
            }
            else
            {
                const updatesql = `UPDATE users SET name = ?, role = ? WHERE email = ?`;
                db.query(updatesql, [name, role, email], (err2) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).send("Database error");
                    }
                    return res.status(200).json({ message: `User updated as ${role}` });
                });
            }
        });
    });
    router.get("/role/:email", (req, res) => {
        const { email } = req.params;
        if (!email) return res.status(400).send("Email is required");
      
        const sql = "SELECT role FROM users WHERE email = ?";
        db.query(sql, [email], (err, rows) => {
          if (err) return res.status(500).send("Database error");
          if (rows.length === 0) return res.status(404).send("User not found");
          res.json({ role: rows[0].role });
        });
      });
    
module.exports = router;
