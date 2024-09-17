const express = require("express");
const { auth } = require("../middleware/auth");
const { getRandomUsers } = require("../controllers/recommendationControllers");
const router = express.Router();

router.post("/getRandomUsers", auth, getRandomUsers);


module.exports = router;