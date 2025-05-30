import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle Create Resume
  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Por favor agregá un título al CV");
      return;
    }

    setError("");

    // Create Resume API Call
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });

      if (response.data?._id) {
        navigate(`/resume/${response.data?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo salió mal. Por favor, intentá de nuevo.");
      }
    }
  };

  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        Crear Nuevo Currículum
      </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-3'>
        Dale un título a tu currículum para comenzar. Podés editar todos los
        detalles más adelante.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({target}) => setTitle(target.value)}
          label='Título del CV'
          placeholder='Ej: CV de Juan Cito'
          type='text'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          Crear CV
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
