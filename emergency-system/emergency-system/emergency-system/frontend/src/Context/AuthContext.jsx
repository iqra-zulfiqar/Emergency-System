import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Config";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userIsLogedIn, setUserIsLogedIn] = useState(false);
  const [adminIsLogedIn, setAdminIsLogedIn] = useState(false);
  const [role, setRole] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
      if (savedRole === "user") {
        setUserIsLogedIn(true);
      }
      if (savedRole === "admin") {
        setAdminIsLogedIn(true);
      }
    }
  }, []);


  const Logout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/logout`, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        setAdminIsLogedIn(false);
        setUserIsLogedIn(false)
        setRole('')
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          userIsLogedIn,
          setUserIsLogedIn,
          role,
          setRole,
          Logout,
          adminIsLogedIn,
          setAdminIsLogedIn,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export { AuthContext, AuthProvider };
