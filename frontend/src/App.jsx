import React from "react";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Home/Dashboard";
import EditResume from "./pages/ResumeUpdate/EditResume";
import {Toaster} from "react-hot-toast";
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path='/' element={<LandingPage />} />

            <Route path='/ingresa' element={<Login />} />
            <Route path='/registrate' element={<SignUp />} />
            <Route path='/inicio' element={<Dashboard />} />
            <Route path='/cv/:resumeId' element={<EditResume />} />
          </Routes>
        </Router>
      </div>

      <Toaster toastOptions={{className: "", style: {fontSize: "13px"}}} />
    </UserProvider>
  );
};

export default App;
