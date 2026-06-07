import React, { useContext } from "react";
import "./AdminSidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const AdminSidebar = () => {
  const { Logout } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-con">
        <div className="logo">
          <h1 onClick={() => navigate("/")}>MyLogo</h1>
        </div>

        <div className="user-req">
          <Link to="user-request" className="sidebar-link">
            User Request
          </Link>
          <Link to="" className="sidebar-link">
            Approved User
          </Link>
          <Link to="booking-option" className="sidebar-link">
            Booking Now
          </Link>
        </div>
        <div className="logout-section">
          <button type="button" className="logout-btn" onClick={Logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export { AdminSidebar };
