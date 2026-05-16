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

app.post("/expenses", async (req, res) => {
    const { name, total, splits, flat_id, expense_type, created_by } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO transactions(flat_id, cost, category, type, receipt,items_purchased,status,evidence,completed_on,created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [flat_id, total, expense_type, null, null, name, null, null, null, created_by]
        );
        for (const member in splits) {
            const expenseResults = await pool.query(
                "INSERT INTO expense_split(flat_id, transaction_id, user_id, amount) VALUES ($1, $2, $3, $4)",
                [flat_id, result.rows[0].transaction_id, member, splits[member]]
            );
        }
        res.status(201).json({ expense: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get(`/api/flats/:currentFlat/expenses/:type`, async (req, res) => {
    const { currentFlat, type } = req.params;
    try {
        const transactions = await pool.query(
            `
            SELECT *
            FROM transactions
            WHERE flat_id = $1 AND category = $2
            `,
            [currentFlat, type]
        );

        const formattedExpenses = [];

        for (const tx of transactions.rows) {

            const splitsResult = await pool.query(
                `
                SELECT user_id, amount
                FROM expense_split
                WHERE transaction_id = $1
                `,
                [tx.transaction_id]
            );

            const splits = {};

            splitsResult.rows.forEach(split => {
                splits[split.user_id] = split.amount;
            });

            formattedExpenses.push({
                name: tx.items_purchased,
                total: tx.cost,
                expense_type: tx.category,
                splits: splits,
                created_by: tx.created_by
            });
        }

        res.json({
            expenses: formattedExpenses
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/api/flats/:id/expenses", async (req, res) => {
    try {
        const transactions = await pool.query(
            `
            SELECT *
            FROM transactions
            WHERE flat_id = $1
            `,
            [req.params.id]
        );

        const formattedExpenses = [];

        for (const tx of transactions.rows) {

            const splitsResult = await pool.query(
                `
                SELECT user_id, amount
                FROM expense_split
                WHERE transaction_id = $1
                `,
                [tx.transaction_id]
            );

            const splits = {};

            splitsResult.rows.forEach(split => {
                splits[split.user_id] = split.amount;
            });

            formattedExpenses.push({
                name: tx.items_purchased,
                total: tx.cost,
                expense_type: tx.category,
                splits: splits,
                created_by: tx.created_by
            });
        }

        res.json({
            expenses: formattedExpenses
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

/* AUTHENTICATION ROUTES */

// Login route
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

// Signup route
app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Signup attempt:", username, email, password);

    try {
        const hashedPassword = await argon2.hash(password);

        const result = await pool.query(
            "INSERT INTO users(email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name",
            [email, username, hashedPassword]
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

// Reset password route
app.put("/api/users/:id/password", async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // If theres no current password or new password
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
    }

    // If the new password is less than 6 characters
    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users where id = $1", [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];

        const pswMatch = await argon2.verify(user.password, currentPassword);

        if (!pswMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await argon2.hash(newPassword);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, id]
        );
        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error with updating password" });
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

app.post("/api/auth/join-flat", async (req, res) => {
    const { join_code, user_id } = req.body;
    console.log("Join flat attempt:", join_code, user_id);
    try {
        const result = await pool.query(
            "SELECT * FROM flat WHERE join_code = $1",
            [join_code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Flat not found" });
        }

        const flat = result.rows[0];

        await pool.query(
            `INSERT INTO flat_members (user_id, flat_id)
            VALUES ($1, $2)`,
            [user_id, flat.id]
        );

        res.json({
            success: true,
            message: "Successfully joined flat",
            flat: flat
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/auth/leave-flat", async (req, res) => {
    const { flat_id, user_id } = req.body;
    console.log("Leave flat attempt:", flat_id, user_id);

    try {
        await pool.query(
            "DELETE FROM flat_members WHERE flat_id = $1 AND user_id = $2",
            [flat_id, user_id]
        );

        res.json({
            success: true,
            message: "Successfully left flat"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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
app.get("/itemsCount", async (req, res) => {
    const { flat_id } = req.headers;
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM shopping_list WHERE flat_id = $1",
            [flat_id]
        );
        const newItem = result.rows[0];
        console.log(newItem);
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
            "SELECT name FROM shopping_list WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Shopping list item not found" });
        }

        const newItem = result.rows[0];

        const existingItem = await pool.query(
            `SELECT * FROM inventory 
             WHERE flat_id = $1 
             AND LOWER(item_name) = LOWER($2)`,
            [flat_id, newItem.name]
        );

        if (existingItem.rows.length > 0) {
            await pool.query(
                `UPDATE inventory 
                 SET quantity = quantity + 1
                 WHERE flat_id = $1 
                 AND LOWER(item_name) = LOWER($2)`,
                [flat_id, newItem.name]
            );
        } else {
            await pool.query(
                `INSERT INTO inventory(flat_id, item_name, quantity, split, cost) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [flat_id, newItem.name, 1, null, null]
            );
        }

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

    try {
        const { flat_id, item_name, quantity } = req.body;

        const existingItem = await pool.query(
            `SELECT * FROM inventory WHERE flat_id = $1 AND LOWER(item_name) = LOWER($2)`,
            [flat_id, item_name]
        );

        if (existingItem.rows.length > 0) {
            const currentItem = existingItem.rows[0];

            const updatedItem = await pool.query(
                `UPDATE inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *`,
                [quantity, currentItem.id]
            );
            return res.status(200).json({ item: updatedItem.rows[0] });
        }

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

app.post("/api/inventory/search", async (req, res) => {
    const { flat_id, query } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM inventory WHERE flat_id = $1 AND item_name ILIKE $2 ORDER BY id ASC",
            [flat_id, `%${query}%`]
        );

        res.json({ items: result.rows });
    } catch (err) {
        console.error("Error searching inventory:", err);
        res.status(500).json({ message: "Error searching inventory" });
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

app.get("/api/flats/:flatId/members", async (req, res) => {
    const { flatId } = req.params;

    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email
             FROM flat_members fm
             JOIN users u ON fm.user_id = u.id
             WHERE fm.flat_id = $1
             ORDER BY u.name ASC`,
            [flatId]
        );

        res.json({ members: result.rows });
    } catch (err) {
        console.error("Error fetching flat members:", err);
        res.status(500).json({ message: "Error fetching flat members" });
    }
});

app.post("/api/finance/add-transaction", async (req, res) => {
    console.log("Recieved Request")
    const { flat_id, amount, comment, split, members, current_user, reoccuringType, category } = req.body
    console.log(flat_id)
    console.log(amount)
    console.log(comment)
    console.log(split)
    console.log(members)
    console.log(current_user)
    try {
        console.log("Runing Query")
        const transactions_result = await pool.query(
            "INSERT INTO transactions (flat_id, cost, created_by, comment,reoccurence_type,category) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [flat_id, amount, current_user.id, comment, reoccuringType, category]
        )

        console.log(transactions_result.rows[0].transaction_id)
        // res.json({success: true})
        res.status(201).json({ result: transactions_result })
        for (const user in members) {
            console.log(members[user].id)
            const split_result = await pool.query(
                `INSERT INTO expense_split (flat_id, transaction_id, user_id, amount) 
                 VALUES ($1,$2,$3,$4)`,
                [flat_id, transactions_result.rows[0].transaction_id, members[user].id, amount]
            )
        }

        // res.json({transactions: split_result.rows})
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

app.post("/api/finance/settle-by-category", async (req, res) => {
    console.log("Recieved Request")
    const { category, flat_id, created_by, user_id } = req.body
    console.log("category" + category)
    console.log("faltid:" + flat_id)
    console.log("createdby:" + created_by)
    console.log("ID:" + user_id)
    try {
        console.log("Runing Query")
        if (user_id == -1) {
            console.log("SOL1")
            const settlement_result = await pool.query(
                `update expense_split es 
             set settled = TRUE
             where transaction_id in (select transaction_id from transactions
                                      where category = $1 and flat_id = $2 and created_by = $3 );`,
                [category, flat_id, created_by]
            )
            console.log(settlement_result)
            res.status(201).json({ result: settlement_result })
        } else {
            console.log("SOL2")
            const settlement_result = await pool.query(
                `update expense_split es 
             set settled = TRUE
             where transaction_id in (select transaction_id from transactions
                                      where category = $1 and flat_id = $2 and created_by = $3 )
             and user_id = $4;`,
                [category, flat_id, created_by, user_id]
            )
            console.log(settlement_result)
            res.status(201).json({ result: settlement_result })
        }


        // console.log(settlement_result.rows[0].transaction_id)
        // res.json({success: true})

    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

app.get("/api/finance/get-owes/:flat_id/:user_id", async (req, res) => {
    const { flat_id, user_id } = req.params;

    try {
        const result1 = await pool.query(
            `SELECT u.name, es.user_id, sum(es.amount), t.created_by, t.category  
             FROM expense_split es 
             JOIN transactions t on t.transaction_id = es.transaction_id  
             JOIN users u on u.id = es.user_id 
             WHERE es.flat_id = $1 AND t.created_by = $2 AND settled = FALSE
             GROUP BY u.name,es.user_id,t.created_by,t.category;`,
            [flat_id, user_id]
        );

        const result2 = await pool.query(
            `SELECT u.name, es.user_id, sum(es.amount), t.created_by, t.category  
             FROM expense_split es 
             JOIN transactions t on t.transaction_id = es.transaction_id  
             JOIN users u on u.id = es.user_id 
             WHERE es.flat_id = $1 AND es.user_id = $2 AND settled = FALSE
             GROUP BY u.name,es.user_id,t.created_by,t.category;`,
            [flat_id, user_id]
        );

        res.json({
            owesYou: result1.rows,
            youOwe: result2.rows
        });
    } catch (err) {
        console.error("Error fetching flat members:", err);
        res.status(500).json({ message: "Error fetching flat members" });
    }

});

app.get("/api/finance/:flatId/categories", async (req, res) => {
    const { flatId } = req.params;

    try {
        const result = await pool.query(
            `select distinct(category) from transactions
             where flat_id = $1;`,
            [flatId]
        );

        res.json({ categories: result.rows });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Error fetching categories" });
    }
});

app.delete("/api/inventory/:id", async (req, res) => {
    const { id } = req.params;

    try {

        const result = await pool.query(
            "DELETE FROM inventory WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Inventory item not found" })
        }

        res.json({
            success: true,
            message: "Inventory item removed successfully",
            item: result.rows[0]
        });

    } catch (err) {
        console.error("Error deleting inventory item:", err);
        res.status(500).json({ message: "Error with deleting inventory item" });
    }
})

app.put("/api/inventory/:id", async (req, res) => {
    const { id } = req.params;
    const { item_name, quantity } = req.body;

    try {
        const result = await pool.query(
            "UPDATE inventory SET quantity = $1 WHERE id = $2 RETURNING *",
            [quantity, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        res.json({
            success: true,
            message: "Inventory item updated successfully",
            item: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating inventory item:", err);
        res.status(500).json({ message: "Error with updating inventory item" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 