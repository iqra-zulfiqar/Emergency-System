import React from "react";
import "./Admin.css";
import { AdminSidebar } from "../../Components/AdminLeftSidebar/AdminSidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const Admin = () => {

  const { role ,adminIsLogedIn } = useContext(AuthContext);
  if (!adminIsLogedIn || role !== 'admin') {
    return <Navigate to={'/login'} replace  />
  } 


  return (
    <>
      <div className="admin-con">
        <div className="left">
          <AdminSidebar />
        </div>
        <div className="right">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export { Admin };
