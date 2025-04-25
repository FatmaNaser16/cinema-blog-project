const express = require("express");
const { createBlog, Home,updateBlog , editBlog, deleteBlog, getFollowedBlogs} = require("../Controllers/BlogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/Home", Home);

router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.patch("/:id", authMiddleware, editBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.get("/followed", authMiddleware, getFollowedBlogs);



module.exports = router;
