const fs = require("node:fs");
const path = require("node:path");
const Resume = require("../models/Resume");
const {cloudinary} = require("../utils/cloudinary");

// Extract public ID from a Cloudinary URL
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const [publicId] = fileName.split(".");
    const folder = parts[parts.length - 2];
    return `${folder}/${publicId}`;
  } catch (error) {
    return null;
  }
}

// @desc   Create a new resume
// @route  POST /api/resumes
// @access Private
const createResume = async (req, res) => {
  try {
    const {title} = req.body;

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {company: "", role: "", startDate: "", endDate: "", description: ""},
      ],
      education: [{degree: "", institution: "", startDate: "", endDate: ""}],
      skills: [{name: "", progress: 0}],
      projects: [{title: "", description: "", github: "", liveDemo: ""}],
      certifications: [{title: "", issuer: "", year: ""}],
      languages: [{name: "", progress: 0}],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error al crear el currículum", error: error.message});
  }
};

// @desc   Get all resumes for logged-in user
// @route  GET /api/resumes
// @access Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({userId: req.user._id}).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error al crear el currículum", error: error.message});
  }
};

// @desc   Get a single resume by ID
// @route  GET /api/resumes/:id
// @access Private
const getResumeById = async (req, res) => {
  try {
    console.log(req.params._id);
    console.log(req.user._id);
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({message: "Currículum no encontrado"});
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error al crear el currículum", error: error.message});
  }
};

// @desc   Update a resume
// @route  PUT /api/resumes/:id
// @access Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({message: "Currículum no encontrado o no autorizado"});
    }

    // Merge updates from req.body into existing resume
    Object.assign(resume, req.body);

    // Save updated resume
    const savedResume = await resume.save();

    res.json(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error al crear el currículum", error: error.message});
  }
};

// @desc   Delete a resume
// @route  DELETE /api/resumes/:id
// @access Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({message: "Currículum no encontrado o no autorizado"});
    }

    // Delete thumbnailLink and profilePreviewUrl images from uploads folder
    if (resume.thumbnailLink) {
      const publicId = getPublicIdFromUrl(resume.thumbnailLink);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const publicId = getPublicIdFromUrl(resume.profileInfo.profilePreviewUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const deleted = await Resume.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({message: "Currículum no encontrado o no autorizado"});
    }

    res.json({message: "Currículum eliminado con éxito"});
  } catch (error) {
    res
      .status(500)
      .json({message: "Error al crear el currículum", error: error.message});
  }
};

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
