import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {validateEmail} from "../../utils/helper";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle SignUp From Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Por favor ingresá tu nombre completo.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresá una dirección de correo electrónico válida.");
      return;
    }

    if (!password) {
      setError("Por favor ingresá la contraseña.");
      return;
    }

    setError("");

    // SignUp API Call
    try {
    } catch (error) {}
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Creá una Cuenta</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Unite hoy ingresando tus datos a continuación.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
            value={fullName}
            onChange={({target}) => setFullName(target.value)}
            label='Nombre Completo'
            placeholder='Juan Cito'
            type='text'
          />

          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label='Dirección de Email'
            placeholder='ejemplo@email.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label='Contraseña'
            placeholder='Min 8 Caracteres'
            type='password'
          />
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          REGISTRATE
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          ¿Ya tenés una cuenta?{" "}
          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => {
              setCurrentPage("ingresar");
            }}>
            Ingresá
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
