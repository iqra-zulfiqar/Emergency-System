import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footerContainer">
        <div className="footerSection">
          <h1>Services</h1>
          <ul>
            <li><Link to="/electrician">Electrician</Link> </li>
            <li><Link to="/plumber">Plumber</Link></li>
            <li><Link to="/painter">Painter</Link></li>
            <li><Link to="/carpenter">Carpenter</Link></li>
          </ul>
        </div>

        <div className="footerSection">
          <h1>Available</h1>
          <ul>
            <li>Faisalabad</li>
            
          </ul>
        </div>

        <div className="footerSection">
          <h1>Main Menu</h1>
          <ul>
            <li>
              {" "}
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"about-us"}>About Us</Link>
            </li>
            <li>
              <Link to={"blog"}>Blog</Link>
            </li>
            <li>
              <Link to={"services"}>Services</Link>
            </li>
          </ul>
        </div>

       
      </div>

      <div className="footerBottom">
        © 2025 Emergency Services. All rights reserved.
      </div>
    </>
  );
}

export default Footer;
