import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../Context/AuthContext";
import logo from "../../assets/logo.jpeg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { role, userIsLogedIn, adminIsLogedIn, Logout } =
    useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Link to={"/"} className="logo-link">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Hamburger Menu */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>

        {role === "admin" && (
          <li>
            <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
        )}

        {(userIsLogedIn || role === "user") && role !== "admin" && (
          <li>
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          </li>
        )}

        <li>
          <Link to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </Link>
        </li>

        <li>
          <Link to="/blog" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
        </li>

        <li>
          <Link to="/about-us" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
        </li>

        {(userIsLogedIn || role === "user") && role !== "admin" && (
          <li>
            <Link to="/service-provider" onClick={() => setMenuOpen(false)}>
              Service Provider
            </Link>
          </li>
        )}

        {(userIsLogedIn || role === "user") && role !== "admin" && (
          <li>
            <Link to="/live-tracking" onClick={() => setMenuOpen(false)}>
              Live Tracking
            </Link>
          </li>
        )}
      </ul>

      {/* Auth Buttons (Desktop) */}
      <div className="nav-auth desktop-auth">
        {userIsLogedIn || adminIsLogedIn ? (
          <button onClick={Logout} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;