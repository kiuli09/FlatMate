const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 5000;
const pool = require("./db");
const argon2 = require('argon2');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FlatMate server is running");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "FlatMate backend working!" });
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];

        if (!(await argon2.verify(user.password, password))) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                username: user.name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    console.log("Login attempt:", email, password);
    
});

app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    try {
        const result = await pool.query(
            'INSERT INTO users(flat_id,email, name, password) VALUES ($1, $2, $3, $4)',
            [null, email, username, hashedPassword]
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    console.log("Signup attempt:", username, email, password);
    
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});