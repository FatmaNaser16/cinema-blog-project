const user = require('../Models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await user.findOne({ email }); 

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newuser = new user({
    username,
    email,
    password: hashedPassword,
  });

  await newuser.save();

  const token = jwt.sign(
    { userId: newuser._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    message: "User registered successfully",
    token
  });
};

module.exports = { register };
