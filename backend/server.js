require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();
const port = process.env.PORT || 5000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: "3mb" }));

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "BCA Hub API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use(express.static(path.join(__dirname, "../BCA-Hub/BCA-Hub")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../BCA-Hub/BCA-Hub/index.html"));
});

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing. Add it in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Backend failed to start:", error.message);
        process.exit(1);
    }
}

startServer();
