const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { followUser, unfollowUser,searchUsers,getUserProfile } = require("../Controllers/UserController");

router.post("/follow/:id", authMiddleware, followUser);

router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/search", authMiddleware, searchUsers);
router.get("/:id", authMiddleware, getUserProfile); 


module.exports = router;
