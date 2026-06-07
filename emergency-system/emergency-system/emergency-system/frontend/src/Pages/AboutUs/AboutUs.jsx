import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <>
      <div className="about-container">
        <h1 className="about-title">About Us</h1>

        <p className="about-text">
          We provide fast, reliable, and professional emergency home services to
          help you in critical situations. Our mission is to connect you with
          trusted experts whenever you need urgent assistance.
        </p>

        <div className="about-list">
          <div className="about-card">
            <h2>Who We Are</h2>
            <p>
              We are a dedicated emergency service platform offering skilled
              plumbers, electricians, painters, and carpenters at your doorstep.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Our goal is to deliver quick, affordable, and high-quality
              emergency services to homes and offices with complete customer
              satisfaction.
            </p>
          </div>

          <div className="about-card">
            <h2>Why Choose Us</h2>
            <p>
              ✔ 24/7 Emergency Support <br />
              ✔ Verified Professionals <br />
              ✔ Fast Response Time <br />✔ Affordable Pricing
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
