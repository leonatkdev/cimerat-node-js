const express = require("express");
const router = express.Router();

router.get("/api", (req, res) => {
    res.json("This is api")
});

module.exports = router;
