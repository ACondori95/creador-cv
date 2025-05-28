import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";

const LandingPage = () => {
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("ingresar");

  const handleCTA = () => {};

  return (
    <div className='w-full min-h-full bg-white'>
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <header className='flex justify-between items-center mb-16'>
          <div className='text-xl font-bold'>Creador de CV</div>
          <button
            className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
            onClick={() => setOpenAuthModal(true)}>
            Ingresar / Registrarse
          </button>
        </header>

        {/* Hero Content */}
        <div className='flex flex-col md:flex-row items-center'>
          <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
            <h1 className='text-5xl font-bold mb-6 leading-tight'>
              Armá Tu{" "}
              <span className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bl-[length:200%_200%] animate-text-shine'>
                Currículum Sin Esfuerzo
              </span>
            </h1>
            <p className='text-lg text-gray-700 mb-8'>
              Creá un currículum destacado en minutos con tu creador de CV
              inteligente e intuitivo.
            </p>
            <button
              className='bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer'
              onClick={handleCTA}>
              Empezar
            </button>
          </div>
          <div className='w-full md:w-1/2'>
            <img
              src='https://placehold.co/600x400'
              alt='Imagen principal'
              className='w-full rounded-lg'
            />
          </div>
        </div>

        <section className='mt-5'>
          <h2 className='text-2xl font-bold text-center mb-12'>
            Funciones Que Te Hacen Destacar
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>Edición Sencilla</h3>
              <p className='text-gray-600'>
                Actualizá las secciones de tu currículum con vista previa en
                vivo y formato instantáneo.
              </p>
            </div>

            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>
                Plantillas Hermosas
              </h3>
              <p className='text-gray-600'>
                Elegí entre plantillas modernas y profesionales que son fáciles
                de personalizar.
              </p>
            </div>

            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>
                Exportación Con Un Solo Clic
              </h3>
              <p className='text-gray-600'>
                Descargá tu currículum al instante como un PDF de alta calidad
                con un solo clic.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className='text-sm bg-gray-50 text-secondary text-center p-5 mt-5'>
        Hecho con ❤️... Feliz Programación
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("ingresar");
        }}
        hideHeader>
        <div>
          {currentPage === "ingresar" && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "registrate" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
