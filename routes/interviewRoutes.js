const express = require("express");

const router = express.Router();

// declaring mappings for /interview
router.get("/", (req, res) => {
    res.render("interview");
});


module.exports = router;