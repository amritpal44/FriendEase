const express = require("express");
const { auth } = require("../middleware/auth");
const { getRandomUsers, getRecommendedUsers } = require("../controllers/recommendationControllers");
const router = express.Router();

router.post("/getRandomUsers", auth, getRandomUsers);
router.post("/getRecommendedUsers", auth, getRecommendedUsers);


module.exports = router;