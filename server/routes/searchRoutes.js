const express = require("express");
const { searchUsers } = require("../controllers/searchController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/searchUsers", auth, searchUsers);


module.exports = router;