const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function createToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function publicProfile(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        rollNumber: user.rollNumber,
        college: user.college,
        course: user.course,
        semester: user.semester,
        completedCourses: String(user.completedCourses),
        quizScore: String(user.quizScore),
        progress: String(user.progress),
        skills: user.skills,
        about: user.about,
        avatar: user.avatar
    };
}

router.post("/register", async (req, res) => {
    try {
        const { fullName, rollNumber, semester, email, password } = req.body;

        if (!fullName || !rollNumber || !semester || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            rollNumber,
            semester,
            email,
            password: hashedPassword,
            about: `${fullName} is a ${semester} BCA student.`
        });

        res.status(201).json({
            token: createToken(user),
            user: publicProfile(user)
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        res.json({
            token: createToken(user),
            user: publicProfile(user)
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;
