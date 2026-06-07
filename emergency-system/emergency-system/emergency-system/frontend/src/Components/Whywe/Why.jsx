import React from "react";
import {
  FaUserShield,      // Verified Technicians
  FaClock,           // Saves Time
  FaHeadset,         // Customer Support
  FaMoneyBillWave,   // Cost-effective
  FaShieldAlt,       // Safety + Reliability
  FaTruck,           // Doorstep Service
  FaLock             // Secure Transactions
} from "react-icons/fa";

import "./Why.css";

function WhyChooseUs() {
  return (
    <div className="why-container">
      <h2 className="why-title">Why Choose Us?</h2>

      <ul className="why-list">

        <li className="why-item">
          <FaUserShield className="why-icon" />
          Connects you to Verified and Trained Technicians.
        </li>

        <li className="why-item">
          <FaClock className="why-icon" />
          Saves Your Time through an easy and efficient booking process.
        </li>

        <li className="why-item">
          <FaHeadset className="why-icon" />
          Offers Impeccable Customer Support.
        </li>

        <li className="why-item">
          <FaMoneyBillWave className="why-icon" />
          Ensures Cost-effectiveness.
        </li>

        <li className="why-item">
          <FaShieldAlt className="why-icon" />
          Provides High-quality, Reliability and Safety.
        </li>

        <li className="why-item">
          <FaTruck className="why-icon" />
          Promises Doorstep Services, saves travelling costs.
        </li>

        <li className="why-item">
          <FaLock className="why-icon" />
          Guarantees Secure Transactions.
        </li>

      </ul>
    </div>
  );
}

export default WhyChooseUs;

