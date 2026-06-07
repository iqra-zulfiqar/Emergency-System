import React from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

function Blog() {
  const navigate = useNavigate(); // initialize navigate

  return (
    <div className="blog-container">
      <h1 className="blog-title">Our Blog</h1>
      <p className="blog-subtitle">
        Tips, guides & updates about home emergency services
      </p>

      <div className="blog-list">

        {/* Plumber */}
        <div
          className="blog-card"
          onClick={() => navigate("/plumber")}
          style={{ cursor: "pointer" }}
        >
          <h2>Plumbing Emergency Tips</h2>
          <p>Learn what to do immediately when a pipe bursts or water starts leaking at home.</p>
          <span className="blog-date">click for more info</span>
        </div>

        {/* Electrician */}
        <div
          className="blog-card"
          onClick={() => navigate("/electrician")}
          style={{ cursor: "pointer" }}
        >
          <h2>Electrical Safety at Home</h2>
          <p>Simple safety tips to avoid short circuits and electrical accidents.</p>
          <span className="blog-date">click for more info</span>
        </div>

        {/* Painter */}
        <div
          className="blog-card"
          onClick={() => navigate("/painter")}
          style={{ cursor: "pointer" }}
        >
          <h2>Choosing the Right Painter</h2>
          <p>Things to consider before hiring a painter for your home or office.</p>
          <span className="blog-date">click for more info</span>
        </div>

        {/* Carpenter */}
        <div
          className="blog-card"
          onClick={() => navigate("/carpenter")}
          style={{ cursor: "pointer" }}
        >
          <h2>Carpentry Maintenance Guide</h2>
          <p>Keep your wooden furniture strong and long-lasting with these tips.</p>
          <span className="blog-date">click for more info</span>
        </div>

      </div>
    </div>
  );
}

export default Blog;