const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

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

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: publicProfile(user) });
});

router.put("/me", auth, async (req, res) => {
    const allowedFields = [
        "fullName",
        "rollNumber",
        "college",
        "course",
        "semester",
        "completedCourses",
        "quizScore",
        "progress",
        "skills",
        "about",
        "avatar"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: publicProfile(user) });
});

module.exports = router;
