const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile

router.post("/upload-image", upload.single("image"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, message: "Error"});
    }

    res
      .status(200)
      .json({success: true, message: "Imagen subida con éxito", data: result});
  });
});

module.exports = router;
