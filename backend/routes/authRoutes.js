const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/uploadMiddleware");
const streamifier = require("streamifier");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({success: false, message: "No se envió ninguna imagen"});
  }

  const stream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({success: false, message: "Error al subir la imagen"});
    }

    res.status(200).json({
      success: true,
      message: "Imagen subida con éxito",
      data: result,
    });
  });

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
