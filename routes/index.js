const express = require("express");

// importing different routes for /user & /interview
const userRoutes = require("./userRoutes");
const interviewRoutes = require("./interviewRoutes");

// declaring router
const router = express.Router();

// Add mappings for diff routes
router.get("/", (req, res) => {
    res.render("students");
});

router.use("/user", userRoutes);
router.use("/interview", interviewRoutes);

// exporting router
module.exports = router;