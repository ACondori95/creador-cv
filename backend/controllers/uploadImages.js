// backend/controllers/uploadImages.js
const {cloudinary} = require("../utils/cloudinary");
const Resume = require("../models/Resume");
const upload = require("../middlewares/uploadMiddleware");

const streamifier = require("streamifier");

const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([{name: "thumbnail"}, {name: "profileImage"}])(
      req,
      res,
      async (err) => {
        if (err) {
          return res
            .status(400)
            .json({message: "La carga del archivo falló", error: err.message});
        }

        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res
            .status(404)
            .json({message: "Currículum no encontrado o no autorizado"});
        }

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        // Subir imagen de miniatura
        if (newThumbnail) {
          // Eliminar imagen anterior si existía
          if (resume.thumbnailLink) {
            const oldId = getPublicIdFromUrl(resume.thumbnailLink);
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }

          const result = await uploadToCloudinary(
            newThumbnail.buffer,
            "thumbnails"
          );
          resume.thumbnailLink = result.secure_url;
        }

        // Subir imagen de perfil
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldId = getPublicIdFromUrl(
              resume.profileInfo.profilePreviewUrl
            );
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }

          const result = await uploadToCloudinary(
            newProfileImage.buffer,
            "profiles"
          );
          resume.profileInfo.profilePreviewUrl = result.secure_url;
        }

        await resume.save();

        res.status(200).json({
          message: "Imágenes subidas con éxito",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    res.status(500).json({
      message: "No se pudieron subir las imágenes",
      error: error.message,
    });
  }
};

// Subir imagen a Cloudinary usando buffer
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {folder},
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Extraer public_id desde la URL de Cloudinary
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1].split(".")[0];
    return `${folder}/${filename}`;
  } catch {
    return null;
  }
};

module.exports = {uploadResumeImages};
