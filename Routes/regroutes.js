const express = require("express");
const { register } = require("../Controllers/RegisterController.js")
const { login } = require("../Controllers/LoginController")
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", authMiddleware, (req, res) => {
    res.json({ message: "Logged out! Please delete token on client." });
  });
  

module.exports = router;
