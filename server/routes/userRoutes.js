import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Route: GET /api/users
// Fetches all users
router.get("/", async (req, res) => {
    const db = req.app.locals.db;
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
});

// Route: POST /api/users
// Creates a new user
router.post("/", async (req, res) => {
    const db = req.app.locals.db;
    const auth = req.auth.payload;
    const newUser = req.body;

    const result = await db.collection("users").insertOne({ ...newUser, userId: auth.sub });
    res.status(201).json(result);
});

// Route: GET /api/users/:id
// Fetches a user by ID
router.get("/:id", async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.params.id;

    try {
        const user = await db.collection("users").findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Route: PUT /api/users/:id
// Updates a user by ID
router.put("/:id", async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.params.id;
    const updateData = req.body;

    try {
        const result = await db.collection("users").updateOne({ userId }, { $set: updateData });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

// Route: DELETE /api/users/:id
// Deletes a user by ID
router.delete("/:id", async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.params.id;

    try {
        const result = await db.collection("users").deleteOne({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

export default router;
