const express = require("express");

const router = express.Router();

// declaring mappings for /user i.e. sign-in, sign-up, etc
router.get("/sign-up", (req, res) => {
    res.render("signup");
});

router.get("/sign-in", (req, res) => {
    res.render("signin");
});

module.exports = router;