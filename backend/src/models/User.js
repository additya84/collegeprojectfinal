const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        rollNumber: {
            type: String,
            required: true,
            trim: true
        },
        semester: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        college: {
            type: String,
            default: "",
            trim: true
        },
        course: {
            type: String,
            default: "BCA Student",
            trim: true
        },
        completedCourses: {
            type: Number,
            default: 0,
            min: 0
        },
        quizScore: {
            type: Number,
            default: 0,
            min: 0
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        skills: {
            type: String,
            default: "",
            trim: true
        },
        about: {
            type: String,
            default: "",
            trim: true
        },
        avatar: {
            type: String,
            default: "../assets/images/profile.png"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
