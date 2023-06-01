import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import { MongoClient } from "mongodb";
import validateAccessToken from "./auth0.middleware.js";
dotenv.config();

// Import routes
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const PORT = 3003;
const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    appName: "AZOM-NO-TOUCH",
});

let app = express();

app.use(json());
app.use(cors());

// Set up routes
app.use("/api/users", validateAccessToken, userRoutes);
app.use("/api/posts", postRoutes);

// Start everything up
async function connectToDB() {
    try {
        await client.connect();
        app.locals.db = client.db();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connectToDB();

const server = app.listen(PORT, function () {
    console.info("🌍 Listening on port " + server.address().port);
});
