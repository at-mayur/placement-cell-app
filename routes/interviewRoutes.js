const express = require("express");
const passport = require("passport");

const interviewController = require("../controllers/interviewController");

const router = express.Router();

// declaring mappings for /interview
// passport checkAuthentication middleware declared while setting local strategy to check authentication
router.get("/", passport.checkAuthentication, interviewController.interviewController);


module.exports = router;