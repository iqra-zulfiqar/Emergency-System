import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovedUsers.css";
import { API_URL } from "../../../Config";

const ApprovedUsers = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user-req/approved`);
        setApprovedUsers(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchApproved();
  }, []);

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>Verified Service Providers</h2>
        <p>List of all users currently active on the platform.</p>
      </div>

      <div className="cards-grid">
        {approvedUsers.map((user) => (
          <div className="user-card approved-border" key={user._id}>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="cv-container">
                <a
                  href={`${API_URL}/${user.cv.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="view-cv-link"
                >
                  View CV (PDF) 📄
                </a>
              </div>
              <span className="badge">Verified ✅</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ApprovedUsers };