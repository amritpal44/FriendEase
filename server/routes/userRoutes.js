const express = require("express");
const { signup, singin } = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", singin);

module.exports = router;