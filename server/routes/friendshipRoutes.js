const express = require("express");
const { auth } = require("../middleware/auth");
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, getFriendRequests, getFriends } = require("../controllers/friendshipControllers");
const router = express.Router();


router.post("/sendFriendRequest", auth, sendFriendRequest);
router.post("/acceptFriendRequest", auth, acceptFriendRequest);
router.post("/rejectFriendRequest", auth, rejectFriendRequest);
router.post("/removeFriend", auth, removeFriend);
router.post("/getFriendRequests", auth, getFriendRequests);
router.post("/getFriends", auth, getFriends);


module.exports = router;