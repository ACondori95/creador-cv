import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../../components/Inputs/Input";
import {validateEmail} from "../../utils/helper";
import {UserContext} from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Por favor ingresá una dirección de correo electrónico válida.");
      return;
    }

    if (!password) {
      setError("Por favor ingresá la contraseña.");
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const {token} = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/inicio");
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
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Bienvenid@ de Nuevo</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Por favor ingresá tus datos para iniciar sesión
      </p>

      <form onSubmit={handleLogin}>
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

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          INGRESAR
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          ¿No tenés una cuenta?{" "}
          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => setCurrentPage("registrate")}>
            Registrate
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
