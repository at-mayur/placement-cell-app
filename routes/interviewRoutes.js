const express = require("express");
const passport = require("passport");

const interviewController = require("../controllers/interviewController");

const router = express.Router();

// declaring mappings for /interview
// passport checkAuthentication middleware declared while setting local strategy to check authentication
router.get("/", passport.checkAuthentication, interviewController.interviewController);

// create interview route
router.post("/create-interview", passport.checkAuthentication, interviewController.createInterviewController);

// add student to interview route
router.post("/add-student", passport.checkAuthentication, interviewController.addStudInterviewController);

// update student's interview result route
router.post("/update-result", passport.checkAuthentication, interviewController.updateStudResult);


module.exports = router;