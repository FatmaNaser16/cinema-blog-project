const User = require("../Models/User");

const followUser = async (req, res) => {
  const userToFollowId = req.params.id;

  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const currentUser = await User.findById(req.user.userId);  
    const userToFollow = await User.findById(userToFollowId);  

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (currentUser._id.toString() === userToFollowId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(req.user.userId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error("Error following user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const unfollowUser = async (req, res) => {
  const userToUnfollowId = req.params.id;

  try {
    const currentUser = await User.findById(req.user.userId);
    const userToUnfollow = await User.findById(userToUnfollowId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollowId
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user.userId
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const searchUsers = async (req, res) => {
    const { query } = req.query;
  
    try {
      if (!query) {
        return res.status(400).json({ message: "Please provide a search query" });
      }
  
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ]
      }).select("username email"); 
  
      res.status(200).json(users);
    } catch (err) {
      console.error("Search error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };

  const getUserProfile = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id)
        .select("-password") 
        .populate("followers", "username email") 
        .populate("following", "username email"); 
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Profile error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
module.exports = { followUser, unfollowUser,searchUsers,getUserProfile};
