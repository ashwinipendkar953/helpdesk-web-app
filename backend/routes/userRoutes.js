const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      return res.status(400).json({ message: "Something went wrong." });
    }

    const userData = new User({
      username,
      email,
      password: hashPassword,
      role: role || "customer",
    });
    const savedUser = await userData.save();

    res.status(201).json({
      data: savedUser,
      message: "User created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message || error,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // generates JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Exclude password from the user object
    const { password: _, ...userData } = user.toObject();

    res.json({ message: "Login successful!", token, user: userData });
  } catch (error) {
    conosle.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
