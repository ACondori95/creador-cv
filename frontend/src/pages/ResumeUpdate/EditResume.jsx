import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import TitleInput from "../../components/Inputs/TitleInput";
import {useReactToPrint} from "react-to-print";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
import StepProgress from "../../components/StepProgress";
import ProfileInfoForm from "./Forms/ProfileInfoForm";

const EditResume = () => {
  const {resumeId} = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [currentPage, setCurrentPage] = useState("info-perfil");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fulllName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
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
      {
        company: "",
        role: "",
        startDate: "", // e.g. "2022-01"
        endDate: "", // e.g. "2023-12"
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0, // percentage value (0-100)
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0, // percentage value (0-100)
      },
    ],
    interests: [""],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate Input
  const validateAndNext = (e) => {};

  // Function to navigate to the next page
  const goToNextStep = () => {};

  // Function to navigate to the previeous page
  const goBack = () => {};

  const renderForm = () => {
    switch (currentPage) {
      case "info-perfil":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );

      default:
        return null;
    }
  };

  // Update simple nested object (like profileInfo, contectInfo, etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {...prev[section], [key]: value},
    }));
  };

  // Update array item (like workExperience[0], skills[1], etc.)
  const updateArrayItem = (section, index, key, value) => {};

  // Add item to array
  const addArrayItem = (section, newItem) => {};

  // Remove item from array
  const removeArrayItem = (section, item) => {};

  // Fetch resume info by ID
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Sin título",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications:
            resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.skills || prevState?.skills,
          interests: resumeInfo?.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.log("Error al obtener los CVs:", error);
    }
  };

  // Upload thumbnail and resume profile img
  const uploadResumeImage = async () => {};

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {};

  // Delete Resume
  const handleDeleteResume = async () => {};

  // Download resume
  const reactToPrintFn = useReactToPrint({contentRef: resumeDownloadRef});

  // Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => {};

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4'>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({...prevState, title: value}))
            }
          />

          <div className='flex items-center gap-4'>
            <button
              className='btn-small-light'
              onClick={() => setOpenThemeSelector(true)}>
              <LuPalette className='text-[16px]' />
              <span className='hidden md:block'>Cambiar Tema</span>
            </button>

            <button className='btn-small-light' onClick={handleDeleteResume}>
              <LuTrash2 className='text-[16px]' />
              <span className='hidden md:block'>Eliminar</span>
            </button>

            <button
              className='btn-small-light'
              onClick={() => setOpenPreviewModal(true)}>
              <LuDownload className='text-[16px]' />
              <span className='hidden md:block'>Previsualizar y Descargar</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='bg-white rounded-lg border border-purple-100 overflow-hidden'>
            <StepProgress progress={progress} />

            {renderForm()}

            <div className='mx-5'>
              {errorMsg && (
                <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'>
                  <LuCircleAlert className='text-md' /> {errorMsg}
                </div>
              )}

              <div className='flex items-end justify-end gap-3 mt-3 mb-5'>
                <button
                  className='btn-small-light'
                  onClick={goBack}
                  disabled={isLoading}>
                  <LuArrowLeft className='text-[16px]' />
                  Atrás
                </button>
                <button
                  className='btn-small-light'
                  onClick={uploadResumeImage}
                  disabled={isLoading}>
                  <LuSave className='text-[16px]' />
                  {isLoading ? "Subiendo..." : "Guardar y Salir"}
                </button>
                <button
                  className='btn-small'
                  onClick={validateAndNext}
                  disabled={isLoading}>
                  {currentPage === "infoAdicional" && (
                    <LuDownload className='text-[16px]' />
                  )}
                  {currentPage === "infoAdicional"
                    ? "Previsualizar y Descargar"
                    : "Siguiente"}
                  {currentPage !== "infoAdicional" && (
                    <LuArrowLeft className='text-[16px] rotate-180' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div ref={resumeRef} className='h-[100vh]'>
            {/* Resume Template */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;
