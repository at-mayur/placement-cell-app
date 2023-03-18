const express = require("express");
const passport = require("passport");

const userController = require("../controllers/userController");

const router = express.Router();

// declaring mappings for /user i.e. sign-in, sign-up, etc
router.get("/sign-up", userController.signUpController);

router.get("/sign-in", userController.signInController);

router.post("/create-user", userController.createUser);

// passport.authenticate to check authentication
// failureRedirect: path to redirect if auth fails
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/user/sign-in" }), userController.createSession);

router.get("/sign-out", userController.signOutController);

module.exports = router;