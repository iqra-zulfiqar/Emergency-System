import React, { useState } from "react";
import "./LoginPortal.css";
import { AdminLogin } from "../../Components/AdminLogin/AdminLogin";
import { Login } from "../../Components/Login/Login";

const LoginPortal = () => {
  // Default 'user' rakha hai kyunke emergency mein aam banda pehle aata hai
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="emergency-portal-wrapper">
      <div className="portal-container">
        
        <div className="portal-header">
          <div className="icon-badge">🚑</div>
          <h2>Emergency Service Portal</h2>
          <p>Select your login type to proceed to the dashboard</p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="portal-tabs">
          <button 
            className={activeTab === "user" ? "active" : ""} 
            onClick={() => setActiveTab("user")}
          >
            <i className="fa-solid fa-user"></i> User Login
          </button>
          <button 
            className={activeTab === "admin" ? "active" : ""} 
            onClick={() => setActiveTab("admin")}
          >
            <i className="fa-solid fa-user-shield"></i> Service Provider Login
          </button>
        </div>

        {/* Dynamic Component Area */}
        <div className="portal-content">
          {activeTab === "user" ? <Login/> : <AdminLogin/>}
        </div>

        <div className="portal-footer">
          <p>In case of life-threatening emergency, call <strong>1122</strong> directly.</p>
        </div>
      </div>
    </div>
  );
};

export { LoginPortal };