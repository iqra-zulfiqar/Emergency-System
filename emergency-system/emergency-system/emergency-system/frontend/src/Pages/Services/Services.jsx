import React from "react";
import "./Services.css";

function EmergencyServices() {
  return (
    <>
      <div className="services-container">
        <h1 className="services-title">Emergency Services</h1>
        <p className="services-subtitle">
          Fast & reliable help when you need it most
        </p>

        <div className="services-grid">
          <div className="service-card">
            <h2>Plumber</h2>
            <p>Leakage, pipe burst, water issues</p>
          </div>

          <div className="service-card">
            <h2>Electrician</h2>
            <p>Power failure, wiring, short circuit</p>
          </div>

          <div className="service-card">
            <h2>Painter</h2>
            <p>Home & office painting services</p>
          </div>

          <div className="service-card">
            <h2>Carpenter</h2>
            <p>Furniture repair & wood work</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmergencyServices;
