const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {name, email, password, profileImageUrl} = req.body;

    // Check if user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({message: "El usuario ya existe"});
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({message: "Error del servidor", error: error.message});
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(500).json({message: ""});
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({message: "Email o contraseña inválidos"});
    }

    // Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({message: "Error del servidor", error: error.message});
  }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado"});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: "Error del servidor", error: error.message});
  }
};

module.exports = {registerUser, loginUser, getUserProfile};
