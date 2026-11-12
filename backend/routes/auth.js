const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try{
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message: "Fill all fields" });
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ message: "Account created" });
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// LOGIN
router.post("/login", async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Wrong email or password" });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message: "Wrong email or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name, email: user.email });
  } catch(err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;