const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
const pool = require("./db");
const argon2 = require('argon2');
const { nanoid } = require("nanoid");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FlatMate server is running");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "FlatMate backend working!" });
});

app.get("/api/flats", async (req, res) => {
    try {
        const result = await pool.query(
  `SELECT f.*
   FROM flat f
   JOIN flat_members fm ON f.id = fm.flat_id
   WHERE fm.user_id = $1`,
    [req.headers.user]
);
        console.log(result.rows)
        res.json({ flats: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
app.get("/items", async (req, res) => {
    
    try {
        const result = await pool.query(
            "SELECT * FROM shopping_list WHERE flat_id = $1",
            [req.headers.flat]
        );
        console.log(result.rows);
        res.json({ items: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
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
    console.log("Signup attempt:", username, email, password);

    try {
        const hashedPassword = await argon2.hash(password);

        const result = await pool.query(
            "INSERT INTO users(flat_id, email, name, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name",
            [null, email, username, hashedPassword]
        );

        const newUser = result.rows[0];

        return res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.name
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/auth/create-flat", async (req, res) => {
    const { name, members, created_by } = req.body;
    console.log("Create flat attempt:", name, members, created_by);
    const joinCode = nanoid(6).toUpperCase();
    try {
        const result = await pool.query(
            "INSERT INTO flat(name, num_people, created_by, join_code) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, members, created_by, joinCode]
        );
        console.log(created_by);
        const newFlat = result.rows[0];
        await pool.query(
            `INSERT INTO flat_members (user_id, flat_id)
            VALUES ($1, $2)`,
            [created_by, newFlat.id]
        );

        res.status(201).json({
            success: true,
            flat: newFlat
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server flat creation error" });
    }
});

app.post("/items", async (req, res) => {
    const { name, flat_id, added_by } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO shopping_list(flat_id,name,quantity,added_by) VALUES ($1, $2, $3, $4) RETURNING *",
            [flat_id, name, 1, added_by]
        );
        const newItem = result.rows[0];
        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/items/purchased/:id", async (req, res) => {
    const { id } = req.params;
    const { flat_id } = req.body;
    try {
        const result = await pool.query(
            "Select name from shopping_list where id = $1",
            [id]
        );
        const newItem = result.rows[0];
        await pool.query(
            "INSERT INTO inventory(flat_id,item_name,quantity,split,cost) VALUES ($1, $2, $3,$4, $5)",
            [flat_id, newItem.name, 1, null, null]
        );
        await pool.query(
            "DELETE FROM shopping_list WHERE id = $1",
            [id]
        );
        res.json({ success: true, message: "Item purchased" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete("/items/remove/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM shopping_list WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({
            success: true,
            message: "Item removed",
            item: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/inventory", async (req, res) => {
    const { flat_id, item_name, quantity } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO inventory (flat_id, item_name, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [flat_id, item_name, quantity]
        );

        res.status(201).json({ item: result.rows[0] });
    } catch (err) {
        console.error("Error adding inventory item:", err);
        res.status(500).json({ message: "Error adding inventory item" });
    }
});

app.get("/api/inventory/:flatId", async (req, res) => {
    const { flatId } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM inventory WHERE flat_id = $1 ORDER BY id ASC",
            [flatId]
        );

        res.json({ items: result.rows });
    } catch (err) {
        console.error("Error fetching inventory:", err);
        res.status(500).json({ message: "Error fetching inventory" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});