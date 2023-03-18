const express = require("express");
const passport = require("passport");

// importing different routes for /user & /interview
const userRoutes = require("./userRoutes");
const interviewRoutes = require("./interviewRoutes");

// homecontroller
const homeContorller = require("../controllers/controller");

// declaring router
const router = express.Router();

// Add mappings for diff routes
// passport checkAuthentication middleware declared while setting local strategy to check authentication
router.get("/", passport.checkAuthentication, homeContorller.homeContorller);

router.use("/user", userRoutes);
router.use("/interview", interviewRoutes);

// exporting router
module.exports = router;