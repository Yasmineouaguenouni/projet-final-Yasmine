import express from "express";
import { ObjectId } from "mongodb";
import validateAccessToken from "../auth0.middleware.js";

const router = express.Router();

// Route: GET /api/posts
// Fetches all posts
router.get("/", async (req, res) => {
    const db = req.app.locals.db;
    const posts = await db.collection("posts").find().toArray();
    res.status(200).json(posts);
});

// Route: POST /api/posts
// Creates a new post
router.post("/", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const auth = req.auth.payload;
    const newPost = req.body;
    const result = await db.collection("posts").insertOne({ ...newPost, userId: auth.sub, comments: [], lovers: [] });
    res.status(201).json(result);
});

// Route: GET /api/posts/mine
// Fetches all the user's posts
router.get("/mine", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const auth = req.auth.payload;
    const posts = await db.collection("posts").find({ userId: auth.sub }).toArray();
    res.status(200).json(posts);
});

// Route: GET /api/posts/not-mine
// Fetches all the non-user's posts
router.get("/not-mine", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const auth = req.auth.payload;
    const posts = await db
        .collection("posts")
        .find({ userId: { $ne: auth.sub } })
        .toArray();
    res.status(200).json(posts);
});

// Route: GET /api/posts/:id
// Fetches a post by ID
router.get("/:id", async (req, res) => {
    const db = req.app.locals.db;
    const postId = req.params.id;

    try {
        const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const user = await db.collection("users").findOne({ userId: post.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comments = post.comments;
        for (const comment of comments) {
            comment.user = await db.collection("users").findOne({ userId: comment.userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        }

        res.status(200).json({ post: { ...post, comments }, user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching post" });
    }
});

// Route: PUT /api/posts/:id
// Updates a post by ID
router.put("/:id", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const postId = req.params.id;
    const auth = req.auth.payload;
    const { comment, description } = req.body;

    try {
        let result;
        if (comment) {
            result = await db.collection("posts").updateOne({ _id: new ObjectId(postId) }, { $push: { comments: { comment, userId: auth.sub } } });
        } else if (description) {
            result = await db.collection("posts").updateOne({ _id: new ObjectId(postId), userId: auth.sub }, { $set: { description: description } });
        }

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
});

// Route: DELETE /api/posts/:id
// Deletes a post by ID
router.delete("/:id", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const postId = req.params.id;
    const auth = req.auth.payload;

    try {
        const result = await db.collection("posts").deleteOne({ _id: new ObjectId(postId), userId: auth.sub });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
});

// Route: POST /api/posts/love/:id
// Loves a post by ID
router.post("/love/:id", validateAccessToken, async (req, res) => {
    const db = req.app.locals.db;
    const postId = req.params.id;
    const { loved } = req.body;
    const auth = req.auth.payload;

    const update = loved ? { $push: { lovers: auth.sub } } : { $pull: { lovers: auth.sub } };

    try {
        const result = await db.collection("posts").updateOne({ _id: new ObjectId(postId) }, update);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
});

export default router;
