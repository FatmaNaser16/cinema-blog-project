const Blog = require("../Models/Blog");
const User = require('../Models/User'); 


const createBlog = async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;

    const newBlog = new Blog({
      title,
      content,
      tags,
      image,
      author: req.user.userId 
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error creating blog:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const Home = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = 3; 
      const skip = (page - 1) * limit;
  
      const blogs = await Blog.find()
        .populate("author", "username email")
        .sort({ createdAt: -1 })
        .skip(skip) 
  
      res.status(200).json(blogs);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, image } = req.body;
  
    try {
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      blog.image = image || blog.image;
  
      await blog.save();
  
      res.status(200).json({ message: "Blog updated", blog });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, image } = req.body;
  
    try {
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only edit your own blogs" });
      }
  
      if (title !== undefined) blog.title = title;
      if (content !== undefined) blog.content = content;
      if (tags !== undefined) blog.tags = tags;
      if (image !== undefined) blog.image = image;
  
      await blog.save();
  
      res.status(200).json({ message: "Blog updated", blog });
    } catch (err) {
      console.error("Edit error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  const deleteBlog = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only delete your own blogs" });
      }
  
      await blog.deleteOne();
  
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };


  const getFollowedBlogs = async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.userId);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const followingIds = currentUser.following;
  
      const blogs = await Blog.find({ author: { $in: followingIds } })
        .populate("author", "username email")  
        .sort({ createdAt: -1 }); 
  
      res.status(200).json(blogs); 
    } catch (err) {
      console.error("Error fetching followed blogs:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
    

  
module.exports = {
  Home,
  createBlog,
  updateBlog,
  editBlog,
  deleteBlog, 
  getFollowedBlogs
   
};
